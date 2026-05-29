"""
PDF Converter — Converts .docx/.pptx to .pdf using LibreOffice headless.
NEVER use jsPDF or any JS library for PDF conversion.
"""

import os
import shutil
import subprocess
from pathlib import Path

from utils.logger import logger


def find_libreoffice_executable() -> str:
    """
    Find the LibreOffice / soffice executable on the system.
    Supports Windows standard locations and fallback search.
    """
    # 1. Check if in PATH
    for cmd in ["libreoffice", "soffice", "soffice.exe"]:
        if shutil.which(cmd):
            return cmd

    # 2. Windows specific common paths
    if os.name == "nt":
        common_paths = [
            Path("C:/Program Files/LibreOffice/program/soffice.exe"),
            Path("C:/Program Files (x86)/LibreOffice/program/soffice.exe"),
        ]
        for path in common_paths:
            if path.exists():
                logger.info(f"Found LibreOffice at: {path}")
                return str(path)

    # 3. Fallback to default
    return "libreoffice"


def convert_to_pdf(input_path: str, output_dir: str) -> str:
    """
    Convert a file to PDF using LibreOffice headless mode.
    Works for .docx -> .pdf and .pptx -> .pdf.

    Args:
        input_path: Path to the input file (.docx or .pptx)
        output_dir: Directory to save the output PDF

    Returns:
        Path to the generated PDF file
    """
    input_file = Path(input_path)
    if not input_file.exists():
        raise FileNotFoundError(f"Input file not found: {input_path}")

    logger.info(f"Converting {input_file.name} to PDF")

    libreoffice_bin = find_libreoffice_executable()

    try:
        result = subprocess.run(
            [
                libreoffice_bin,
                "--headless",
                "--convert-to",
                "pdf",
                "--outdir",
                output_dir,
                str(input_file),
            ],
            capture_output=True,
            text=True,
            timeout=120,
        )

        if result.returncode != 0:
            logger.error(f"LibreOffice error: {result.stderr}")
            raise RuntimeError(f"PDF conversion failed: {result.stderr}")

        # Expected output path
        pdf_path = Path(output_dir) / f"{input_file.stem}.pdf"
        if not pdf_path.exists():
            raise FileNotFoundError(f"PDF output not found at {pdf_path}")

        logger.info(f"PDF generated: {pdf_path}")
        return str(pdf_path)

    except subprocess.TimeoutExpired:
        logger.error("LibreOffice conversion timed out")
        raise RuntimeError("PDF conversion timed out (120s limit)")
    except FileNotFoundError as e:
        if "libreoffice" in str(e).lower() or "soffice" in str(e).lower():
            logger.error("LibreOffice not installed")
            raise RuntimeError(
                "LibreOffice is not installed. Install it with: "
                "sudo apt-get install -y libreoffice (Linux) or "
                "brew install --cask libreoffice (macOS) or "
                "winget install TheDocumentFoundation.LibreOffice (Windows)"
            )
        raise

