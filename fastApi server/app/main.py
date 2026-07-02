from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.api.v1 import reviews

# here, write thoings which needs to be done only once when server loads
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("API is starting up...")
    yield
    print("Shutting down API...")

app = FastAPI(lifespan=lifespan)


app.include_router(reviews.router, prefix="/api/v1/reviews", tags=["Review AI"] )
