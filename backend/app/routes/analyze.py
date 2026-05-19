from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.claude import analyze_image
from app.models.care_result import CareResult
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"}

@router.post("/analyze", response_model=CareResult)
async def analyze(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Image must be JPEG, PNG, or WebP")

    image_bytes = await file.read()

    if len(image_bytes) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image too large. Max 10MB.")

    try:
        result = await analyze_image(image_bytes, media_type=file.content_type)
        return CareResult(**result)
    except Exception as e:
        logger.error(f"Analysis failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
