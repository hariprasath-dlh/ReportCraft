"""
File Manager — UUID generation, path helpers, and cleanup utilities.
"""

import os
import time
import uuid
from pathlib import Path

from utils.logger import logger


def generate_file_id() -> str:
    """Generate a unique file ID using UUID4."""
    # Use hex form (no dashes) to keep filenames simple
    return uuid.uuid4().hex


def get_output_path(file_id: str, ext: str) -> Path:
    """Get the output file path for a given file ID and extension."""
    output_dir = Path(os.getenv("OUTPUT_DIR", "outputs"))
    output_dir.mkdir(parents=True, exist_ok=True)
    return output_dir / f"{file_id}{ext}"


def get_upload_dir(session_id: str) -> Path:
    """Get the upload directory for a given session ID."""
    upload_dir = Path(os.getenv("UPLOAD_DIR", "uploads")) / session_id
    upload_dir.mkdir(parents=True, exist_ok=True)
    return upload_dir


def cleanup_old_files() -> int:
    """
    Delete expired files from uploads/ and outputs/ directories.
    Returns the number of files deleted.
    """
    expiry_minutes = int(os.getenv("FILE_EXPIRY_MINUTES", "60"))
    expiry_seconds = expiry_minutes * 60
    now = time.time()
    deleted = 0

    for dir_name in ["uploads", "outputs"]:
        dir_path = Path(os.getenv(dir_name.upper().replace("S", "_DIR", 1), dir_name))
        if not dir_path.exists():
            continue

        for item in dir_path.rglob("*"):
            if item.is_file() and item.name != ".gitkeep":
                age = now - item.stat().st_mtime
                if age > expiry_seconds:
                    item.unlink()
                    deleted += 1
                    logger.info(f"Cleaned up expired file: {item}")

    if deleted:
        logger.info(f"Cleaned up {deleted} expired files")
    return deleted
