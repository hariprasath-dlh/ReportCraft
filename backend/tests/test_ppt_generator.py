"""
Tests for the PPT generator.
Validates slide count, file creation, and review type handling.
"""

import pytest
from pathlib import Path

from models.schemas import PPTRequest, TitleSlide, Student, LiteratureEntry, StyleInstructions
from generators.ppt_generator import generate_ppt


def _base_request(review_type="review_0", lit_count=0):
    students = [Student(name="Test Student", reg_no="23AD001")]
    lit = [
        LiteratureEntry(title=f"Paper {i}", author=f"Author {i}", year="2024", summary=f"Summary {i}")
        for i in range(lit_count)
    ]
    return PPTRequest(
        project_type="mini_project_2",
        review_type=review_type,
        title_slide=TitleSlide(
            course_code="22UAD607",
            course_name="Mini Project-II",
            project_name="AI Attendance System",
            students=students,
            guide_name="Dr. I.DEVI",
            guide_designation="Assistant Professor",
            department="AI&DS",
        ),
        abstract="Abstract text for testing.",
        problem_statement="Problem statement text.",
        existing_system="Existing system description.",
        proposed_system="Proposed system description.",
        literature_survey=lit,
        instructions=StyleInstructions(),
    )


def test_ppt_review_0_slide_count(temp_dirs):
    """Review 0 should generate: title + abstract + problem + existing + proposed = 5 slides."""
    req = _base_request("review_0")
    file_id, path, total = generate_ppt(req)
    assert path.exists()
    assert total == 5
    path.unlink()


def test_ppt_review_1_slide_count(temp_dirs):
    """Review 1 with 5 lit entries = 5 base + 5 lit = 10 slides."""
    req = _base_request("review_1", lit_count=5)
    file_id, path, total = generate_ppt(req)
    assert path.exists()
    assert total == 10
    path.unlink()


def test_ppt_with_style_instructions(temp_dirs):
    """Custom style instructions should not break generation."""
    req = _base_request("review_0")
    req.instructions = StyleInstructions(
        font_name="Calibri",
        title_font_size=28,
        body_font_size=18,
        bold_headings=False,
        line_spacing=1.5,
        text_alignment="left",
    )
    file_id, path, total = generate_ppt(req)
    assert path.exists()
    path.unlink()


def test_ppt_file_has_pptx_extension(temp_dirs):
    """Generated file should have .pptx extension."""
    req = _base_request("review_0")
    file_id, path, total = generate_ppt(req)
    assert path.suffix == ".pptx"
    assert file_id is not None
    assert len(file_id) > 0
    path.unlink()
