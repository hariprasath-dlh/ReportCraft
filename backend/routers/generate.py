"""
Generate routes — POST /api/generate/ppt and POST /api/generate/report
Accepts multipart/form-data with JSON data string and image files.
"""

import json
from pathlib import Path
from typing import List, Optional

from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Request
from starlette.datastructures import UploadFile as StarletteUploadFile
from models.schemas import PPTRequest, ReportRequest
from models.responses import GenerateResponse
from generators.ppt_generator import generate_ppt
from generators.report_generator import generate_report
from utils.image_processor import save_uploaded_images
from utils.file_manager import cleanup_old_files, generate_file_id, get_upload_dir
from utils.logger import logger

router = APIRouter()


async def save_section_image(upload: StarletteUploadFile, session_dir: Path, order: int) -> Path:
    filename = f"{order:03d}_{upload.filename}"
    dest = session_dir / filename
    content = await upload.read()
    dest.write_bytes(content)
    # Resize large images if needed (import resize_if_large from utils.image_processor)
    from utils.image_processor import resize_if_large
    try:
        resize_if_large(dest)
    except Exception as e:
        logger.warning(f"Could not resize section image: {e}")
    logger.info("SAVED section image: key=%s path=%s exists=%s",
                upload.filename, dest.resolve(), dest.exists())
    return dest.resolve()    # ALWAYS return absolute path


@router.post("/ppt", response_model=GenerateResponse)
async def generate_ppt_endpoint(
    request: Request,
    data: str = Form(...),
    images: List[UploadFile] = File(default=[]),
):
    """
    Generate a PowerPoint presentation.
    
    - data: JSON string of PPTRequest
    - images: Optional uploaded image files
    """
    try:
        # Cleanup old files first
        cleanup_old_files()

        # Parse JSON data
        try:
            request_dict = json.loads(data)
            request_obj = PPTRequest(**request_dict)
        except json.JSONDecodeError as e:
            raise HTTPException(status_code=400, detail=f"Invalid JSON data: {e}")
        except Exception as e:
            raise HTTPException(status_code=422, detail=f"Validation error: {e}")

        logger.info(f"Generating PPT | review={request_obj.review_type} | images={len(images)}")

        # Save uploaded images
        image_paths = []
        architecture_path = None
        session_id = generate_file_id()
        if images:
            image_paths = await save_uploaded_images(images, session_id)

            # Separate architecture image if specified
            if request_obj.architecture_image_filename:
                arch_name = request_obj.architecture_image_filename
                for p in image_paths:
                    if p.name == arch_name or p.stem.endswith(arch_name.split('.')[0]):
                        architecture_path = p
                        image_paths = [ip for ip in image_paths if ip != p]
                        break

        # Parse section images (section_image_{sectionKey}_{order})
        section_image_map = {}
        form_data = await request.form()
        section_img_keys = [k for k in form_data.keys() if k.startswith("section_image_")]
        logger.info("SECTION IMAGE KEYS IN FORM: %s", section_img_keys)
        
        session_dir = get_upload_dir(session_id)

        for key, value in form_data.multi_items():
            logger.debug("FORM ITEM: key=%s type=%s value=%s", key, type(value), value)
            if not key.startswith("section_image_"):
                continue
            if not isinstance(value, StarletteUploadFile):
                continue

            stripped = key[len("section_image_"):]   # "<sectionKey>_<order>"
            last_underscore = stripped.rfind("_")
            if last_underscore == -1:
                logger.warning("Malformed section_image key: %s", key)
                continue
            section_key = stripped[:last_underscore]
            try:
                order = int(stripped[last_underscore + 1:])
            except ValueError:
                order = 0
            
            saved_path = await save_section_image(value, session_dir, order)
            if section_key not in section_image_map:
                section_image_map[section_key] = []
            section_image_map[section_key].append((order, saved_path))

        # Sort by order and keep only paths
        for k in list(section_image_map.keys()):
            section_image_map[k] = [path for _, path in sorted(section_image_map[k], key=lambda x: x[0])]

        logger.info("SECTION IMAGE MAP: %s",
                    {k: [str(p) for p in v] for k, v in section_image_map.items()})

        # Generate PPT
        file_id, output_path, total_slides = generate_ppt(
            request_obj, image_paths, architecture_path,
            section_image_map=section_image_map
        )

        return GenerateResponse(
            file_id=file_id,
            filename=output_path.name,
            total_slides=total_slides,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(
            "PPT generation failed: %s | Type: %s",
            str(e), type(e).__name__, exc_info=True
        )
        raise HTTPException(
            status_code=500,
            detail=f"PPT failed: {type(e).__name__}: {str(e)}"
        )


@router.post("/report", response_model=GenerateResponse)
async def generate_report_endpoint(
    data: str = Form(...),
    images: List[UploadFile] = File(default=[]),
):
    """Generate a Word report."""
    try:
        cleanup_old_files()

        try:
            request_dict = json.loads(data)
            request = ReportRequest(**request_dict)
        except json.JSONDecodeError as e:
            raise HTTPException(status_code=400, detail=f"Invalid JSON data: {e}")
        except Exception as e:
            raise HTTPException(status_code=422, detail=f"Validation error: {e}")

        logger.info(f"Generating report for: {request.title_slide.project_name}")

        # Save uploaded images
        image_paths = []
        if images:
            session_id = generate_file_id()
            image_paths = await save_uploaded_images(images, session_id)

        # Generate report
        file_id, output_path = generate_report(request, image_paths)

        return GenerateResponse(
            file_id=file_id,
            filename=output_path.name,
            total_slides=0,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(
            "Report generation failed: %s | Type: %s",
            str(e), type(e).__name__, exc_info=True
        )
        raise HTTPException(
            status_code=500,
            detail=f"Report failed: {type(e).__name__}: {str(e)}"
        )
