from pydantic import BaseModel

class ApiResponse(BaseModel):
    statusCode: int = 200
    data: dict = {}
    message: str = "success"
    success: bool = True
