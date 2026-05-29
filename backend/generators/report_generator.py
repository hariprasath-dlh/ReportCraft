"""
Report Generator — Builds .docx using python-docx.
Generates all report sections in fixed, required order.
"""

from pathlib import Path

from docx import Document

from models.schemas import ReportRequest
from generators import section_builder
from utils.file_manager import generate_file_id, get_output_path
from utils.logger import logger


TEMPLATE_PATH = Path("templates/report/college_template.docx")


def generate_report(request: ReportRequest, image_paths: list = None) -> tuple:
    """
    Generate a Word report from the request data.
    Returns (file_id, file_path).
    """
    if image_paths is None:
        image_paths = []

    file_id = generate_file_id()
    output_path = get_output_path(file_id, ".docx")

    # Load template or create blank document
    if TEMPLATE_PATH.exists():
        doc = Document(str(TEMPLATE_PATH))
        logger.info("Loaded college report template")
    else:
        doc = Document()
        logger.warning("College report template not found, using blank document")

    title_info = request.title_slide

    # Fixed section order — NEVER reorder
    # 1. Title Page
    section_builder.add_title_page(doc, title_info)
    section_builder.add_page_break(doc)

    # 2. Bonafide Certificate
    section_builder.add_bonafide(doc, title_info)
    section_builder.add_page_break(doc)

    # 3. Acknowledgement
    if request.acknowledgement:
        section_builder.add_acknowledgement(doc, request.acknowledgement)
        section_builder.add_page_break(doc)

    # 4. Abstract
    if request.abstract:
        section_builder.add_abstract(doc, request.abstract)
        section_builder.add_page_break(doc)

    # 5. List of Figures (placeholder)
    section_builder.add_lof(doc)
    section_builder.add_page_break(doc)

    # 6. Table of Contents (placeholder)
    section_builder.add_toc(doc)
    section_builder.add_page_break(doc)

    # 7. Chapter 1 — Introduction
    if request.introduction:
        section_builder.add_chapter(doc, "Chapter 1 — Introduction", request.introduction)
        section_builder.add_page_break(doc)

    # 8. Chapter 2 — Literature Survey
    if request.literature_survey:
        section_builder.add_litsurvey_table(doc, request.literature_survey)
        section_builder.add_page_break(doc)

    # 9. Chapter 3 — Existing System
    if request.existing_system:
        section_builder.add_chapter(doc, "Chapter 3 — Existing System", request.existing_system)
        section_builder.add_page_break(doc)

    # 10. Chapter 4 — Proposed System
    if request.proposed_system:
        section_builder.add_chapter(doc, "Chapter 4 — Proposed System", request.proposed_system)
        section_builder.add_page_break(doc)

    # 11. Additional chapters
    for i, ch in enumerate(request.additional_chapters or [], start=5):
        section_builder.add_chapter(doc, f"Chapter {i} — {ch.title}", ch.content)
        section_builder.add_page_break(doc)

    # 12. Images (if any)
    for i, img_path in enumerate(image_paths):
        section_builder.add_image_with_caption(
            doc, str(img_path), f"Figure {i + 1}: {img_path.stem}"
        )

    # Save
    doc.save(str(output_path))
    logger.info(f"Report saved: {output_path.name}")

    return file_id, output_path
