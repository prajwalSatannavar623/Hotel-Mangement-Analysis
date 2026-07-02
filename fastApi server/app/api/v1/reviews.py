from fastapi import APIRouter, status
from starlette.concurrency import run_in_threadpool
from app.schemas import ExtractionRequest
from app.services import text_aspects_service
from app.utils import ApiResponse

router = APIRouter()

@router.post("/extract", response_model=ApiResponse)
async def handleExtraction(request: ExtractionRequest):
    extracted_data = await text_aspects_service.extract_aspects(request.text)

       

    return ApiResponse(statusCode=status.HTTP_200_OK, data=extracted_data, message="Aspects extracted succcessfully" )