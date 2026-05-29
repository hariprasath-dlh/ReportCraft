"""
Style Applier — Applies font/style instructions to PPT and DOCX files.
"""

from pptx.util import Pt
from docx.shared import Pt as DocxPt

from utils.logger import logger


def apply_ppt_styles(prs, instructions):
    """Apply style instructions to all slides in a presentation."""
    if not instructions:
        return

    font_family = getattr(instructions, "font_name", None) or "Times New Roman"
    body_size = int(getattr(instructions, "body_font_size", None) or 16)

    for slide in prs.slides:
        for shape in slide.shapes:
            if shape.has_text_frame:
                for paragraph in shape.text_frame.paragraphs:
                    for run in paragraph.runs:
                        run.font.name = font_family

    logger.info(f"Applied PPT styles: {font_family} {body_size}pt")


def apply_doc_styles(doc, instructions):
    """Apply style instructions to all paragraphs in a document."""
    if not instructions:
        return

    font_family = getattr(instructions, "font_name", None) or "Times New Roman"
    body_size = int(getattr(instructions, "body_font_size", None) or 16)

    for paragraph in doc.paragraphs:
        for run in paragraph.runs:
            run.font.name = font_family

    # Apply to tables too
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                for paragraph in cell.paragraphs:
                    for run in paragraph.runs:
                        run.font.name = font_family

    logger.info(f"Applied document styles: {font_family} {body_size}pt")
