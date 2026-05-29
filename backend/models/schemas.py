"""
Pydantic request models for the ReportCraft API.
Matches the Dr. NGP Institute of Technology PPT template specification.
"""

from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


class Student(BaseModel):
    name: str
    reg_no: str


class TitleSlide(BaseModel):
    course_code: str = ""
    course_name: str = ""
    project_name: str = ""
    students: List[Student] = Field(default_factory=list)
    guide_name: str = ""
    guide_designation: str = ""
    department: str = ""


class LiteratureEntry(BaseModel):
    title: str = ""
    author: str = ""
    year: str = ""
    summary: str = ""


class AdditionalChapter(BaseModel):
    title: str = ""
    content: str = ""


class SectionImageMeta(BaseModel):
    """Metadata for a per-section image (caption + order only; file sent separately)."""
    caption: str = ""
    order: int = 0


class PPTSection(BaseModel):
    """A customizable PPT section (predefined or user-created)."""
    key: str
    title: str
    content: str = ""
    is_enabled: bool = True
    order: int = 0
    section_images: List[SectionImageMeta] = Field(default_factory=list)
    format_as_bullets: bool = False


class StyleInstructions(BaseModel):
    font_name: str = "Times New Roman"
    title_font_size: int = 24
    body_font_size: int = 16
    bold_headings: bool = True
    line_spacing: float = 1.15
    text_alignment: str = "justify"


class PPTRequest(BaseModel):
    model_config = ConfigDict(validate_default=True)

    project_type: str = ""
    review_type: str = "review_0"
    title_slide: TitleSlide = Field(default_factory=TitleSlide)
    abstract: str = ""
    problem_statement: str = ""
    literature_survey: Optional[List[LiteratureEntry]] = Field(default_factory=list)
    existing_system: str = ""
    proposed_system: str = ""
    architecture_image_filename: Optional[str] = None
    image_captions: Optional[List[str]] = Field(default_factory=list)
    instructions: StyleInstructions = Field(default_factory=StyleInstructions)

    # New optional fields for section customization (backward compatible)
    sections: Optional[List[PPTSection]] = None
    custom_sections: Optional[List[PPTSection]] = Field(default_factory=list)

    @field_validator("literature_survey")
    @classmethod
    def validate_lit_count(cls, v, info):
        review = info.data.get("review_type", "review_0")
        # Skip validation when new sections format is provided
        sections = info.data.get("sections")
        if sections is not None:
            return v
        needs_lit = ["review_1", "review_2", "review_3", "review_4", "final"]
        entries = v or []
        if review in needs_lit and len(entries) < 5:
            raise ValueError(
                f"Literature survey needs min 5 entries for {review}. Got {len(entries)}."
            )
        return entries

    @model_validator(mode="after")
    def validate_literature_for_review(self):
        # Skip validation when new sections format is provided
        if self.sections is not None:
            return self
        needs_lit = {"review_1", "review_2", "review_3", "review_4", "final"}
        entries = self.literature_survey or []
        if self.review_type in needs_lit and len(entries) < 5:
            raise ValueError(
                f"Literature survey needs min 5 entries for {self.review_type}. Got {len(entries)}."
            )
        return self


class ReportRequest(BaseModel):
    project_type: str = ""
    title_slide: TitleSlide = Field(default_factory=TitleSlide)
    acknowledgement: str = ""
    abstract: str = ""
    literature_survey: List[LiteratureEntry] = Field(default_factory=list)
    introduction: str = ""
    existing_system: str = ""
    proposed_system: str = ""
    additional_chapters: Optional[List[AdditionalChapter]] = Field(default_factory=list)
    instructions: StyleInstructions = Field(default_factory=StyleInstructions)


class ConvertRequest(BaseModel):
    file_id: str
    file_type: str = "pptx"


class PreviewRequest(BaseModel):
    file_id: str
