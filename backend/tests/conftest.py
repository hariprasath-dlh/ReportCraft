"""
Test fixtures for the ReportCraft API.
Updated to match new PPTRequest/ReportRequest schema.
"""

import pytest
from pathlib import Path
from fastapi.testclient import TestClient

import sys
sys.path.insert(0, str(Path(__file__).parent.parent))

from main import app
from models.schemas import (
    PPTRequest, ReportRequest, TitleSlide, Student,
    LiteratureEntry, StyleInstructions
)


@pytest.fixture
def client():
    return TestClient(app)


def _make_title_slide(**kwargs):
    defaults = dict(
        course_code="22UAD607",
        course_name="Mini Project-II",
        project_name="AI-Powered Smart Attendance System",
        students=[Student(name="Test Student", reg_no="23AD001")],
        guide_name="Dr. I.DEVI",
        guide_designation="Assistant Professor",
        department="AI&DS",
    )
    defaults.update(kwargs)
    return TitleSlide(**defaults)


def _make_lit_entries(count=5):
    return [
        LiteratureEntry(
            title=f"Title of Paper {i}",
            author=f"Author {i}",
            year=str(2020 + i),
            summary=f"Summary of paper {i} covering relevant topics.",
        )
        for i in range(1, count + 1)
    ]


@pytest.fixture
def sample_ppt_request_r0():
    return PPTRequest(
        project_type="mini_project_2",
        review_type="review_0",
        title_slide=_make_title_slide(),
        abstract="This project automates student attendance using AI facial recognition.",
        problem_statement="Manual attendance is time-consuming and error-prone.",
        existing_system="Paper-based attendance requires manual entry and is unreliable.",
        proposed_system="AI-based facial recognition system provides real-time tracking.",
        instructions=StyleInstructions(),
    )


@pytest.fixture
def sample_ppt_request_r1():
    return PPTRequest(
        project_type="mini_project_2",
        review_type="review_1",
        title_slide=_make_title_slide(),
        abstract="This project automates student attendance using AI facial recognition.",
        problem_statement="Manual attendance is time-consuming and error-prone.",
        literature_survey=_make_lit_entries(5),
        existing_system="Paper-based attendance requires manual entry.",
        proposed_system="AI-based facial recognition system provides real-time tracking.",
        instructions=StyleInstructions(),
    )


@pytest.fixture
def sample_ppt_request():
    """Alias for r0 request."""
    return PPTRequest(
        project_type="stem",
        review_type="review_0",
        title_slide=_make_title_slide(),
        abstract="Abstract text.",
        problem_statement="Problem statement text.",
        existing_system="Existing system text.",
        proposed_system="Proposed system text.",
    )


@pytest.fixture
def sample_report_request():
    return ReportRequest(
        project_type="mini_project_2",
        title_slide=_make_title_slide(),
        acknowledgement="We thank our guide and institution.",
        abstract="This project automates student attendance.",
        introduction="Introduction to the project scope.",
        literature_survey=_make_lit_entries(3),
        existing_system="Paper-based attendance.",
        proposed_system="AI attendance system.",
        instructions=StyleInstructions(),
    )


@pytest.fixture
def temp_dirs(tmp_path, monkeypatch):
    """Set up temporary upload and output directories for tests."""
    upload_dir = tmp_path / "uploads"
    output_dir = tmp_path / "outputs"
    upload_dir.mkdir()
    output_dir.mkdir()
    monkeypatch.setenv("UPLOAD_DIR", str(upload_dir))
    monkeypatch.setenv("OUTPUT_DIR", str(output_dir))
    return upload_dir, output_dir
