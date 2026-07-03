import json
import httpx
from fastapi import APIRouter, status, HTTPException
from app.schemas import ExtractionRequest
from app.services import text_aspects_service
from app.utils import ApiResponse


router = APIRouter()

@router.post("/analyse", response_model=ApiResponse)
async def handleExtraction(request: ExtractionRequest):
    try:

        extracted_data = await text_aspects_service.analyze_multimodal_review(
            review_text=request.review,
            photo_urls=[str(u) for u in request.photoUrls],)
        
        return ApiResponse(
            statusCode=status.HTTP_200_OK, 
            data=extracted_data, 
            message="Aspects extracted successfully"
        )

    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY, 
            detail=f"AI service returned malformed JSON: {str(e)}"
        )
    
    except httpx.TimeoutException:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT, 
            detail="AI service timed out while processing the review."
        )
    
    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY, 
            detail=f"Upstream AI provider error: {e.response.status_code}"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Internal server error during extraction: {str(e)}"
        )