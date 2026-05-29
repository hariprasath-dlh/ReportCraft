"""
Upload routes — POST /api/upload/images
"""

from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import List

from models.responses import UploadResponse
from utils.image_processor import save_uploaded_images
from utils.logger import logger

router = APIRouter()


@router.post("/images", response_model=UploadResponse)
async def upload_images(
    files: List[UploadFile] = File(...),
    session_id: str = Form(...),
):
    """Upload images for use in PPT/Report generation."""
    try:
        logger.info(f"Uploading {len(files)} images for session: {session_id}")
        saved_paths = await save_uploaded_images(files, session_id)
        files_info = [
            {"filename": p.name, "path": str(p)} for p in saved_paths
        ]
        return UploadResponse(files=files_info, total=len(saved_paths))
    except Exception as e:
        logger.error(f"Image upload failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
