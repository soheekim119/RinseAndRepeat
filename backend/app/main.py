from dotenv import load_dotenv
load_dotenv

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # Cross-Origin Resource Sharing for frontend and backend communication
from app.routes.analyze import router as analyze_router

app = FastAPI(title="RinseAndRepeat API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze_router, prefix="/api")

@app.get("/health")
def health():
    return {"status": "ok"}