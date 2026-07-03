from pydantic import BaseModel, HttpUrl


class ExtractionRequest(BaseModel):
    review: str
    photoUrls: list[HttpUrl] = []

