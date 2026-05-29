"""
Convert routes — PDF conversion, file download, and ZIP bundle.
"""

import io
import zipfile
from pathlib import Path

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse, StreamingResponse
from models.schemas import ConvertRequest
from models.responses import ConvertResponse
from converters.pdf_converter import convert_to_pdf
from utils.file_manager import get_output_path
from utils.logger import logger

router = APIRouter()


@router.post("/pdf", response_model=ConvertResponse)
@router.post("/convert/pdf", response_model=ConvertResponse)
async def convert_to_pdf_endpoint(request: ConvertRequest):
    """Convert a .pptx or .docx file to PDF using LibreOffice."""
    try:
        # Find the source file
        ext = f".{request.file_type}" if not request.file_type.startswith(".") else request.file_type
        input_path = get_output_path(request.file_id, ext)

        if not input_path.exists():
            raise HTTPException(
                status_code=404,
                detail=f"File not found: {request.file_id}{ext}"
            )

        logger.info(f"Converting {input_path.name} to PDF")

        # Convert
        output_dir = input_path.parent
        pdf_path = Path(convert_to_pdf(input_path, output_dir))

        return ConvertResponse(
            pdf_file_id=pdf_path.stem,
            filename=pdf_path.name,
        )

    except HTTPException:
        raise
    except RuntimeError as e:
        logger.error(f"PDF conversion failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.error(f"PDF conversion error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/download/{file_id}")
async def download_file(file_id: str):
    """
    Download a generated file by ID.
    Tries extensions in order: .pptx, .docx, .pdf
    """
    for ext in [".pptx", ".docx", ".pdf"]:
        file_path = get_output_path(file_id, ext)
        if file_path.exists():
            media_types = {
                ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ".pdf": "application/pdf",
            }
            return FileResponse(
                path=str(file_path),
                filename=file_path.name,
                media_type=media_types.get(ext, "application/octet-stream"),
            )

    raise HTTPException(status_code=404, detail=f"File not found: {file_id}")


@router.get("/bundle/{file_id}")
async def download_bundle(file_id: str):
    """
    Download a ZIP bundle containing all versions of the file.
    Bundles .pptx + .docx + .pdf if they exist.
    """
    buf = io.BytesIO()
    file_count = 0

    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
        for ext in [".pptx", ".docx", ".pdf"]:
            file_path = get_output_path(file_id, ext)
            if file_path.exists():
                zf.write(str(file_path), file_path.name)
                file_count += 1

    if file_count == 0:
        raise HTTPException(status_code=404, detail=f"No files found for: {file_id}")

    buf.seek(0)
    return StreamingResponse(
        buf,
        media_type="application/zip",
        headers={
            "Content-Disposition": f'attachment; filename="{file_id}_bundle.zip"'
        },
    )
