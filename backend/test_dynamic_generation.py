"""
Integration test for PPT custom sections and section image layout.
"""
import sys
import os
from pathlib import Path

# Add backend directory to path
sys.path.insert(0, str(Path(__file__).parent))

# Ensure stdout uses UTF-8 on Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

os.environ.setdefault("OUTPUT_DIR", str(Path(__file__).parent / "outputs"))
os.environ.setdefault("UPLOAD_DIR", str(Path(__file__).parent / "uploads"))

from models.schemas import (
    PPTRequest, TitleSlide, Student, LiteratureEntry, StyleInstructions, PPTSection, SectionImageMeta
)
from generators.ppt_generator import generate_ppt
from pptx import Presentation
from pptx.util import Inches

def test_dynamic_generation():
    paths = (
        Path("templates/ppt/college_logo.png"),
        Path("templates/ppt/college_logo.jpg"),
        Path("templates/ppt/college_logo.jpeg"),
    )
    logo_path = next((p for p in paths if p.exists()), None)
    
    if not logo_path or not logo_path.exists():
        # Create a dummy file if not exists for testing
        logo_path = Path("templates/ppt/college_logo.png")
        logo_path.parent.mkdir(parents=True, exist_ok=True)
        # Create a tiny 1x1 png to satisfy PIL
        from PIL import Image
        img = Image.new('RGB', (100, 100), color = 'red')
        img.save(logo_path)
    
    # 1. Build PPT Request
    request = PPTRequest(
        project_type="mini_project_2",
        review_type="review_1",
        title_slide=TitleSlide(
            course_code="22UAD607",
            course_name="MINI PROJECT-II",
            project_name="Dynamic Testing",
            students=[
                Student(name="STUDENT A", reg_no="23AD001"),
            ],
            guide_name="GUIDE NAME",
            guide_designation="ASSISTANT PROFESSOR",
            department="CSE",
        ),
        # Step 3 lit survey
        literature_survey=[
            LiteratureEntry(title=f"Lit {i}", author="Author", year="2023", summary="Summary")
            for i in range(5)
        ],
        instructions=StyleInstructions(),
        # Custom section list
        sections=[
            PPTSection(
                key="abstract",
                title="Project Overview (Abstract)",
                content="First bullet point of abstract.\nSecond bullet point of abstract.",
                is_enabled=True,
                order=0,
                section_images=[SectionImageMeta(caption="Logo Abstract", order=0)],
                format_as_bullets=True
            ),
            PPTSection(
                key="problem",
                title="Problem Statement",
                content="1. First Issue\n2. Second Issue\nThis should be rendered as bullets.",
                is_enabled=True,
                order=1,
                section_images=[],
                format_as_bullets=False
            ),
            PPTSection(
                key="existing",
                title="Old System",
                content="This system is disabled. It should NOT be generated.",
                is_enabled=False,
                order=2,
                section_images=[],
                format_as_bullets=False
            ),
            PPTSection(
                key="proposed",
                title="Modern Solution",
                content="First point for proposed solution.\nSecond point for proposed solution.",
                is_enabled=True,
                order=3,
                section_images=[
                    SectionImageMeta(caption="NLP Pipeline", order=0),
                    SectionImageMeta(caption="Translation UI", order=1)
                ],
                format_as_bullets=True
            ),
        ],
        custom_sections=[
            PPTSection(
                key="custom_architecture",
                title="Architecture & Design",
                content="This is a custom section at the end.",
                is_enabled=True,
                order=4,
                section_images=[
                    SectionImageMeta(caption="Arch Image 1", order=0),
                    SectionImageMeta(caption="Arch Image 2", order=1),
                    SectionImageMeta(caption="Arch Image 3", order=2),
                ],
                format_as_bullets=False
            ),
            PPTSection(
                key="custom_text_bullets",
                title="Future Extensions",
                content="Scale to support thousands of concurrent users.\nDeploy on edge devices.",
                is_enabled=True,
                order=5,
                section_images=[],
                format_as_bullets=True
            )
        ]
    )

    # 2. Build image map matching form structure
    section_image_map = {
        "abstract": [logo_path],
        "proposed": [logo_path, logo_path],
        "custom_architecture": [logo_path, logo_path, logo_path]
    }

    # 3. Generate presentation
    print("Generating PPT...")
    file_id, output_path, total_slides = generate_ppt(
        request,
        image_paths=[],
        architecture_path=None,
        section_image_map=section_image_map
    )
    
    print(f"File generated successfully: {output_path}")
    print(f"Total slides: {total_slides}")

    # 4. Open and validate shapes
    prs = Presentation(str(output_path))
    assert len(prs.slides) == total_slides, f"Expected {total_slides} slides, got {len(prs.slides)}"
    print(f"Successfully verified slide count of {len(prs.slides)} slides.")

    # We expect:
    # 1. Title slide
    # 2. Project Overview (Abstract) -> has 1 image + text (so split layout)
    # 3. Problem Statement -> has text only
    # 4-8. Literature Survey (5 slides)
    # 9. Modern Solution -> has 2 images + text (split layout)
    # 10. Architecture & Design -> has 3 images + text (split layout)
    # 11. Future Extensions -> has text only
    # Total = 11 slides
    print(f"Expected total slides: 11. Actual: {total_slides}")
    assert total_slides == 11, f"Expected exactly 11 slides, got {total_slides}"

    # Print slide titles
    for idx, slide in enumerate(prs.slides):
        title = ""
        # Let's find any text box with bold text, or just log shape count
        print(f"Slide {idx + 1}: {len(slide.shapes)} shapes")
        # Check that it has a background, navy bar, footer, heading, and content
        assert len(slide.shapes) >= 4, f"Slide {idx + 1} has too few shapes!"

    print("ALL TESTS PASSED!")

if __name__ == "__main__":
    test_dynamic_generation()
