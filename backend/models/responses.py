"""
Pydantic response models for the ReportCraft API.
"""

from typing import List, Optional, Dict
from datetime import datetime
from pydantic import BaseModel


class GenerateResponse(BaseModel):
    file_id: str
    filename: str
    total_slides: int = 0
    created_at: datetime = None

    def __init__(self, **data):
        if "created_at" not in data or data["created_at"] is None:
            data["created_at"] = datetime.utcnow()
        super().__init__(**data)


class ConvertResponse(BaseModel):
    pdf_file_id: str
    filename: str


class PreviewResponse(BaseModel):
    html: Optional[str] = None


class PPTPreviewResponse(BaseModel):
    slides: List[dict] = []
    total_slides: int = 0


class UploadResponse(BaseModel):
    files: List[dict] = []
    total: int = 0


class ExtractResponse(BaseModel):
    sections: Dict[str, str] = {}
    source_filename: str = ""


class DownloadInfo(BaseModel):
    file_id: str
    filename: str


class ErrorResponse(BaseModel):
    detail: str
    code: str = "INTERNAL_ERROR"
