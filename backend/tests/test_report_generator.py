"""
Tests for the Report generator.
Validates file creation and content ordering.
"""

import pytest
from pathlib import Path
from docx import Document

from models.schemas import ReportRequest, TitleSlide, Student, LiteratureEntry, StyleInstructions
from generators.report_generator import generate_report


def _base_report_request():
    return ReportRequest(
        project_type="mini_project_2",
        title_slide=TitleSlide(
            course_code="22UAD607",
            course_name="Mini Project-II",
            project_name="AI Attendance System",
            students=[Student(name="Test Student", reg_no="23AD001")],
            guide_name="Dr. I.DEVI",
            guide_designation="Assistant Professor",
            department="AI&DS",
        ),
        acknowledgement="We thank our guide for their continuous support.",
        abstract="This project automates attendance using facial recognition.",
        introduction="Introduction chapter content here.",
        literature_survey=[
            LiteratureEntry(title="Paper 1", author="Author A", year="2022", summary="Summary A"),
            LiteratureEntry(title="Paper 2", author="Author B", year="2023", summary="Summary B"),
        ],
        existing_system="Manual paper-based system.",
        proposed_system="AI-powered automated system.",
        instructions=StyleInstructions(),
    )


def test_report_generates_file(temp_dirs):
    """Basic report generation should produce a .docx file."""
    req = _base_report_request()
    file_id, path = generate_report(req)
    assert path.exists()
    assert path.suffix == ".docx"
    assert file_id is not None
    path.unlink()


def test_report_with_literature(temp_dirs):
    """Report with literature entries should include a literature table."""
    req = _base_report_request()
    file_id, path = generate_report(req)
    doc = Document(str(path))
    # Should have at least one table (literature survey)
    assert len(doc.tables) >= 1
    path.unlink()


def test_report_title_page_contains_project_name(temp_dirs):
    """Report should have the project name on the first page."""
    req = _base_report_request()
    file_id, path = generate_report(req)
    doc = Document(str(path))
    full_text = "\n".join(p.text for p in doc.paragraphs)
    assert "AI Attendance System" in full_text
    path.unlink()


def test_report_empty_optional_fields(temp_dirs):
    """Report should not fail with empty optional fields."""
    req = ReportRequest(
        project_type="stem",
        title_slide=TitleSlide(
            project_name="Minimal Project",
            department="CSE",
        ),
        abstract="Abstract only.",
    )
    file_id, path = generate_report(req)
    assert path.exists()
    path.unlink()
