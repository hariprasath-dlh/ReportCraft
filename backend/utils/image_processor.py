"""
Image Processor — Handles uploaded image saving, sorting, resizing, and validation.
"""

import os
import re
from pathlib import Path
from typing import List

from PIL import Image
from fastapi import UploadFile

from utils.file_manager import get_upload_dir
from utils.logger import logger


ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp"}


async def save_uploaded_images(files: List[UploadFile], session_id_or_dir) -> List[Path]:
    """Save valid uploaded images to the session upload directory."""
    upload_dir = (
        session_id_or_dir
        if isinstance(session_id_or_dir, Path)
        else get_upload_dir(str(session_id_or_dir))
    )
    upload_dir.mkdir(parents=True, exist_ok=True)

    saved_paths = []
    for i, file in enumerate(files):
        if file.content_type not in ALLOWED_IMAGE_TYPES:
            logger.warning(f"Skipped unsupported image type: {file.filename} ({file.content_type})")
            continue

        content = await file.read()
        max_mb = float(os.getenv("MAX_IMAGE_MB", "10"))
        if len(content) / 1024 / 1024 > max_mb:
            logger.warning(f"Skipped oversized image: {file.filename}")
            continue

        safe_name = Path(file.filename or f"image_{i + 1}.png").name
        safe_name = re.sub(r"[^A-Za-z0-9._ -]", "_", safe_name)
        filename = f"{i + 1:02d}_{safe_name}"
        filepath = upload_dir / filename

        with open(filepath, "wb") as f:
            f.write(content)

        # Validate and resize
        if validate_image(filepath):
            resize_if_large(filepath)
            saved_paths.append(filepath)
            logger.info(f"Saved image: {filepath}")
        else:
            filepath.unlink(missing_ok=True)
            logger.warning(f"Invalid image removed: {file.filename}")

    return sort_images_by_prefix(saved_paths)


def sort_images_by_prefix(paths: List[Path]) -> List[Path]:
    """Sort image paths by their numeric prefix (01_, 02_, etc.)."""
    def get_prefix(p):
        match = re.match(r"^(\d+)", Path(p).stem)
        return int(match.group(1)) if match else 999
    return sorted(paths, key=get_prefix)


def resize_if_large(path: Path, max_width: int = 1920) -> None:
    """Resize image if wider than max_width, preserving aspect ratio."""
    try:
        with Image.open(path) as img:
            if img.width > max_width:
                ratio = max_width / img.width
                new_height = int(img.height * ratio)
                img = img.resize((max_width, new_height), Image.LANCZOS)
                img.save(path)
                logger.info(f"Resized {path.name} to {max_width}x{new_height}")
    except Exception as e:
        logger.warning(f"Could not resize {path}: {e}")


def validate_image(path: Path) -> bool:
    """Validate that the file is a valid image."""
    max_mb = float(os.getenv("MAX_IMAGE_MB", "10"))
    max_bytes = max_mb * 1024 * 1024

    if not path.exists():
        return False

    if path.stat().st_size > max_bytes:
        logger.warning(f"Image too large: {path.name} ({path.stat().st_size} bytes)")
        return False

    try:
        with Image.open(path) as img:
            img.verify()
        return True
    except Exception:
        return False
