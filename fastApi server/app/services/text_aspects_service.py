import json
import httpx
import json
import os
from dotenv import load_dotenv

load_dotenv()

if(os.getenv("MODE") == "development"):
    OLLAMA_URL = os.getenv("OLLAMA_URL_BASE")
else:
    OLLAMA_URL = os.getenv("OLLAMA_URL_PRODUCTION")

async def extract_aspects(text: str) -> dict:
    instruction = """You are a helpful assistant that extracts hotel review aspects into JSON format.

        You must output ONLY valid JSON with exactly these 6 keys, no other keys, no extra text before or after:
        - "bedroom": mentions about the room/bed (or null if not mentioned)
        - "cleanliness": mentions about cleanliness/hygiene (or null)
        - "food_and_beverages": mentions about food/breakfast/dining (or null)
        - "bathroom": mentions about the bathroom (or null)
        - "surrounding_area": mentions about location/surroundings (or null)
        - "other": anything else (staff, service, price, wifi, etc.) (or null)

        Include both positive and negative mentions, using the reviewer's own wording where possible.

        Example:
        Review: "The room was spacious and clean but breakfast was disappointing."
        Output: {"bedroom": "room was spacious", "cleanliness": "clean", "food_and_beverages": "breakfast was disappointing", "bathroom": null, "surrounding_area": null, "other": null}

        Now extract from this review:"""

    async with httpx.AsyncClient() as client:
        # Ollama's local API endpoint
        response = await client.post(
            OLLAMA_URL,
            json={
                "model": "llama3.1",
                "prompt": f"{instruction}\n\nReview: {text}",
                "format": "json", # valid json output
                "stream": False   # get full response at once
            },
            timeout=60.0
        )
    
    result = response.json()
    return json.loads(result['response'])












# import os
# import json
# import httpx
# from dotenv import load_dotenv

# load_dotenv()

# MODE = os.getenv("MODE")
# OLLAMA_URL_BASE = os.getenv("OLLAMA_URL_BASE")
# OLLAMA_URL_PRODUCTION = os.getenv("OLLAMA_URL_PRODUCTION")
# GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# async def extract_aspects(text: str) -> dict:
#     instruction = """You are a helpful assistant that extracts hotel review aspects into JSON format.

#         You must output ONLY valid JSON with exactly these 6 keys, no other keys, no extra text before or after:
#         - "bedroom": mentions about the room/bed (or null if not mentioned)
#         - "cleanliness": mentions about cleanliness/hygiene (or null)
#         - "food_and_beverages": mentions about food/breakfast/dining (or null)
#         - "bathroom": mentions about the bathroom (or null)
#         - "surrounding_area": mentions about location/surroundings (or null)
#         - "other": anything else (staff, service, price, wifi, etc.) (or null)

#         Example:
#         Review: "The room was spacious and clean but breakfast was disappointing."
#         Output: {"bedroom": "room was spacious", "cleanliness": "clean", "food_and_beverages": "breakfast was disappointing", "bathroom": null, "surrounding_area": null, "other": null}
# """

#     async with httpx.AsyncClient() as client:
#         if MODE == "development":
#             # ---------------------------------------------------------
#             # LOCAL OLLAMA REQUEST
#             # ---------------------------------------------------------
#             response = await client.post(
#                 OLLAMA_URL_BASE,
#                 json={
#                     "model": "llama3.1",
#                     "prompt": f"{instruction}\n\nReview: {text}",
#                     "format": "json",
#                     "stream": False
#                 },
#                 timeout=60.0
#             )
#             result = response.json()
#             return json.loads(result['response'])

#         else:
#             # ---------------------------------------------------------
#             # PRODUCTION GROQ REQUEST (OpenAI Standard Format)
#             # ---------------------------------------------------------
#             response = await client.post(
#                 OLLAMA_URL_PRODUCTION,
#                 headers={
#                     "Authorization": f"Bearer {GROQ_API_KEY}",
#                     "Content-Type": "application/json"
#                 },
#                 json={
#                     "model": "llama-3.1-8b-instant", # Groq's specific model name
#                     "messages": [
#                         {"role": "system", "content": instruction},
#                         {"role": "user", "content": text}
#                     ],
#                     "response_format": {"type": "json_object"} # Forces JSON output
#                 },
#                 timeout=60.0
#             )
#             result = response.json()
#             # The standard API format nests the response slightly deeper
#             return json.loads(result['choices'][0]['message']['content'])