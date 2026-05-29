"""
Section Builder — Per-section functions for report (DOCX) generation.
Builds all fixed-order sections of the college project report.
"""

from pathlib import Path

from docx import Document
from docx.shared import Inches, Pt
from docx.enum.text import WD_ALIGN_PARAGRAPH

from utils.logger import logger


def add_title_page(doc, title_info):
    """Add the college-standard title page to the document."""
    # Project title (large, centred, bold)
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run(title_info.project_name or "Project Title")
    run.bold = True
    run.font.size = Pt(20)

    doc.add_paragraph()  # Spacer

    # Course info
    if title_info.course_code:
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.add_run(f"Course Code: {title_info.course_code}").font.size = Pt(13)

    if title_info.course_name:
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.add_run(f"Course: {title_info.course_name}").font.size = Pt(13)

    if title_info.department:
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.add_run(f"Department of {title_info.department}").font.size = Pt(13)

    doc.add_paragraph()  # Spacer

    # Students
    if title_info.students:
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = p.add_run("Submitted by:")
        run.bold = True
        run.font.size = Pt(12)
        for student in title_info.students:
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.add_run(f"{student.name}  ({student.reg_no})")

    doc.add_paragraph()  # Spacer

    # Guide
    if title_info.guide_name:
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.add_run("Under the Guidance of").bold = True
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = p.add_run(title_info.guide_name)
        run.bold = True
        if title_info.guide_designation:
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.add_run(title_info.guide_designation)

    logger.info("Added title page")


def add_bonafide(doc, title_info):
    """Add the bonafide certificate page."""
    doc.add_heading("BONAFIDE CERTIFICATE", level=1)

    student_names = ", ".join(s.name for s in (title_info.students or []))
    project = title_info.project_name or "this project"
    guide = title_info.guide_name or "the Guide"
    dept = f"Department of {title_info.department}" if title_info.department else "the Department"

    text = (
        f"This is to certify that the project entitled \"{project}\" submitted by "
        f"{student_names} is a bonafide record of work done by them under my supervision "
        f"in partial fulfillment of the requirements for the award of the degree of "
        f"Bachelor of Engineering."
    )
    p = doc.add_paragraph(text)
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY

    doc.add_paragraph()
    doc.add_paragraph()

    # Signature lines
    p = doc.add_paragraph()
    p.add_run(f"{guide}").bold = True
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT

    logger.info("Added bonafide certificate")


def add_acknowledgement(doc, ack_text):
    """Add acknowledgement section."""
    doc.add_heading("ACKNOWLEDGEMENT", level=1)
    p = doc.add_paragraph(ack_text)
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    logger.info("Added acknowledgement")


def add_abstract(doc, abstract_text):
    """Add abstract section."""
    doc.add_heading("ABSTRACT", level=1)
    p = doc.add_paragraph(abstract_text)
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    logger.info("Added abstract")


def add_lof(doc):
    """Add List of Figures (placeholder)."""
    doc.add_heading("LIST OF FIGURES", level=1)
    doc.add_paragraph(
        "List of figures will be updated after final review."
    )
    logger.info("Added list of figures placeholder")


def add_toc(doc):
    """Add Table of Contents (placeholder)."""
    doc.add_heading("TABLE OF CONTENTS", level=1)
    doc.add_paragraph(
        "Update this field in Word: Right-click → Update Field"
    )
    logger.info("Added table of contents placeholder")


def add_chapter(doc, title, content):
    """Add a chapter with title and justified content."""
    doc.add_heading(title, level=1)
    if content:
        for para in content.split("\n\n"):
            if para.strip():
                p = doc.add_paragraph(para.strip())
                p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    logger.info(f"Added chapter: {title}")


def add_litsurvey_table(doc, entries):
    """Add literature survey as a 4-column table."""
    doc.add_heading("Chapter 2 — Literature Survey", level=1)

    if not entries:
        doc.add_paragraph("No literature entries provided.")
        return

    # Create 4-column table
    table = doc.add_table(rows=1, cols=4)
    table.style = "Table Grid"

    # Header row
    headers = ["Title", "Author(s)", "Year", "Topics Covered"]
    for i, header in enumerate(headers):
        cell = table.rows[0].cells[i]
        cell.text = header
        for paragraph in cell.paragraphs:
            for run in paragraph.runs:
                run.bold = True

    # Data rows — support both LiteratureEntry objects and dicts
    for entry in entries:
        row = table.add_row()
        if hasattr(entry, "title"):
            row.cells[0].text = entry.title or ""
            row.cells[1].text = entry.author or ""
            row.cells[2].text = entry.year or ""
            row.cells[3].text = entry.summary or ""
        else:
            row.cells[0].text = entry.get("title", "")
            row.cells[1].text = entry.get("author", "")
            row.cells[2].text = entry.get("year", "")
            row.cells[3].text = entry.get("summary", "")

    logger.info(f"Added literature survey table with {len(entries)} entries")


def add_image_with_caption(doc, image_path, caption=""):
    """Add an image with caption to the document."""
    try:
        doc.add_picture(str(image_path), width=Inches(5.5))
        if caption:
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            run = p.add_run(caption)
            run.italic = True
            run.font.size = Pt(10)
        logger.info(f"Added image: {image_path}")
    except Exception as e:
        logger.warning(f"Could not add image {image_path}: {e}")
        doc.add_paragraph(f"[Image not available: {caption or image_path}]")


def add_page_break(doc):
    """Add a page break."""
    doc.add_page_break()
