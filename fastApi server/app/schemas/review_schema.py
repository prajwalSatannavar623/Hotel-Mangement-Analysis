from pydantic import BaseModel, HttpUrl


class ExtractionRequest(BaseModel):
    text: str
    # image_urls: list[HttpUrl] = []

