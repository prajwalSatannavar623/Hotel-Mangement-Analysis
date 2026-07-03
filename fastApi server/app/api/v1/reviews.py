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

        # gets aspects classified
        # download and store the images from cloudinary
        # send aspects and images to cross modal retreival model
        # semantic localization on the obtained pairs
        # send back a)aspects classified, b) localized pairs



        extracted_data = await text_aspects_service.extract_aspects(request.review)
        
        return ApiResponse(
            statusCode=status.HTTP_200_OK, 
            data=extracted_data, 
            message="Aspects extracted successfully"
        )

    except json.JSONDecodeError as e:
        # Happens if the AI model outputs plain text instead of valid JSON
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY, 
            detail=f"AI service returned malformed JSON: {str(e)}"
        )
    
    except httpx.TimeoutException:
        # Happens if Ollama or Groq takes longer than the 60s timeout limit
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT, 
            detail="AI service timed out while processing the review."
        )
    
    except httpx.HTTPStatusError as e:
        # Happens if Groq/Ollama returns an upstream HTTP error (e.g., 401 Unauthorized or 429 Rate Limit)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY, 
            detail=f"Upstream AI provider error: {e.response.status_code}"
        )
        
    except Exception as e:
        # Catch-all for any unexpected crashes
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Internal server error during extraction: {str(e)}"
        )