import os
import json
import uuid
import httpx
from typing import List, Dict, Any, Optional

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
MODEL = "qwen/qwen3-vl-8b-instruct"


# =============================================================================
# STAGE 1 — Extract aspects/claims from the review TEXT ONLY.
# This is a well-understood, reliable task on its own. Keeping it separate
# from the visual grounding means the model isn't juggling two jobs at once.
# =============================================================================

EXTRACTION_PROMPT = """You are an expert hotel review auditor.
Read the guest review below and extract every distinct claim (complaint or praise).

Return ONLY valid JSON:
{
  "aspects": [
    {
      "category": "cleanliness | bedroom | bathroom | food_and_beverages | surrounding_area | other",
      "sentiment": "positive | negative | neutral",
      "claim": "The exact complaint or praise mentioned in the text"
    }
  ]
}

Rules:
- One entry per distinct claim, no duplicates.
- "claim" must be grounded in the actual review text, not inferred or invented.
"""


async def extract_aspects(review_text: str) -> List[Dict[str, Any]]:
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
    }
    data = {
        "model": MODEL,
        "messages": [
            {
                "role": "user",
                "content": f'{EXTRACTION_PROMPT}\n\nGuest Review Text:\n"{review_text}"',
            }
        ],
        "response_format": {"type": "json_object"},
        "temperature": 0.1,
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(OPENROUTER_URL, headers=headers, json=data, timeout=30.0)
        response.raise_for_status()
        raw = response.json()["choices"][0]["message"]["content"]
        parsed = json.loads(raw)

    aspects = parsed.get("aspects", [])
    # Attach a stable id to each claim so stage 2 can reference it unambiguously.
    for a in aspects:
        a["id"] = uuid.uuid4().hex[:8]
    return aspects


# =============================================================================
# STAGE 2 — Ground each claim against the photos. This call does ONE job:
# "does visual evidence for this specific claim exist, and where."
# Photos are explicitly labeled so index confusion isn't possible, and the
# few-shot example shows BOTH a match and a null, so the model isn't biased
# toward always finding "evidence".
# =============================================================================

def _build_grounding_prompt(claims: List[Dict[str, Any]], num_photos: int) -> str:
    claims_list = "\n".join(f'- claim_id "{c["id"]}": {c["claim"]}' for c in claims)

    return f"""You are a visual auditor. You are given {num_photos} photos, each labeled
"Photo 1:", "Photo 2:", etc. in the order they appear below, and a list of claims
extracted from a hotel review.

For EACH claim, decide whether it is physically visible in ANY of the photos.

Claims:
{claims_list}

For each claim, first reason briefly about what you looked for, then decide.
Return ONLY valid JSON in this exact structure:

{{
  "results": [
    {{
      "claim_id": "c1",
      "reasoning": "Looked for a stained carpet across all photos; Photo 2 shows a clean carpet, no stain visible anywhere.",
      "match": null
    }},
    {{
      "claim_id": "c2",
      "reasoning": "Photo 3 clearly shows a cracked bathroom tile matching the claim.",
      "match": {{"photo_index": 3, "bbox_2d": [120, 340, 560, 780]}}
    }}
  ]
}}

STRICT RULES:
- "match" MUST be the JSON literal null unless the claimed object/defect is
  actually, clearly visible in one of the photos. Do not guess or infer from
  context — only report what you can literally see.
- If "match" is not null: "photo_index" must be an integer from 1 to {num_photos},
  and "bbox_2d" must be [x1, y1, x2, y2] using normalized 0-1000 scale coordinates
  tightly bounding the relevant object/defect.
- Every claim_id from the list above must appear exactly once in "results".
- Abstract claims (e.g. "friendly staff", "great value") will never have visual
  evidence — always return match: null for these.
"""


async def ground_claims(
    claims: List[Dict[str, Any]], photo_urls: List[str]
) -> Dict[str, Optional[Dict[str, Any]]]:
    """Returns {claim_id: {"photo_index": int, "bbox_2d": [...]}} or {claim_id: None}."""
    if not claims or not photo_urls:
        return {c["id"]: None for c in claims}

    content: List[Dict[str, Any]] = [
        {"type": "text", "text": _build_grounding_prompt(claims, len(photo_urls))}
    ]
    for i, url in enumerate(photo_urls, start=1):
        content.append({"type": "text", "text": f"Photo {i}:"})
        content.append({"type": "image_url", "image_url": {"url": url}})

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
    }
    data = {
        "model": MODEL,
        "messages": [{"role": "user", "content": content}],
        "response_format": {"type": "json_object"},
        "temperature": 0.1,
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(OPENROUTER_URL, headers=headers, json=data, timeout=60.0)
        response.raise_for_status()
        raw = response.json()["choices"][0]["message"]["content"]

        print("\n--- RAW GROUNDING JSON ---")
        print(raw)
        print("--------------------------\n")

        parsed = json.loads(raw)

    out: Dict[str, Optional[Dict[str, Any]]] = {c["id"]: None for c in claims}
    for r in parsed.get("results", []):
        claim_id = r.get("claim_id")
        if claim_id not in out:
            continue  # model hallucinated an id we didn't ask about

        match = r.get("match")
        if not isinstance(match, dict):
            continue  # null, missing, or malformed -> stays None, no guessing

        idx = match.get("photo_index")
        bbox = match.get("bbox_2d")

        valid_idx = isinstance(idx, int) and 1 <= idx <= len(photo_urls)
        valid_bbox = (
            isinstance(bbox, list)
            and len(bbox) == 4
            and all(isinstance(v, (int, float)) for v in bbox)
        )

        if valid_idx and valid_bbox:
            clamped_bbox = [max(0, min(1000, int(v))) for v in bbox]
            out[claim_id] = {"photo_index": idx, "bbox_2d": clamped_bbox}
        # else: leave as None rather than guessing a fallback photo/box

    return out


# =============================================================================
# PUBLIC ENTRY POINT
# =============================================================================

async def analyze_multimodal_review(review_text: str, photo_urls: List[str]) -> Dict[str, Any]:
    claims = await extract_aspects(review_text)
    grounding = await ground_claims(claims, photo_urls)

    aspects_out = []
    for c in claims:
        match = grounding.get(c["id"])
        evidence = None
        if match is not None:
            evidence = {
                "photo_url": photo_urls[match["photo_index"] - 1],
                "bbox_2d": match["bbox_2d"],
            }

        aspects_out.append(
            {
                "category": c.get("category", "other"),
                "sentiment": c.get("sentiment", "neutral"),
                "claim": c.get("claim", ""),
                "evidence": evidence,  # {"photo_url": ..., "bbox_2d": [...]} or None
            }
        )

    return {"aspects": aspects_out}
