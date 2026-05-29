"""
PPT Generator — Orchestrates building a complete .pptx presentation.
Creates slides in the correct order based on review_type.
No template file needed — everything is built programmatically.
"""

from pptx import Presentation
from pptx.util import Inches
from pathlib import Path

from models.schemas import PPTRequest
from utils.file_manager import generate_file_id, get_output_path
from utils.logger import logger
from generators.slide_builder import (
    build_title_slide,
    build_abstract_slide,
    build_problem_statement_slide,
    build_literature_slide,
    build_existing_system_slide,
    build_proposed_system_slide,
    build_architecture_slide,
    build_image_slide,
    build_dynamic_slide,
)

# Heading text for image slides based on review type
REVIEW_IMAGE_HEADINGS = {
    "review_2": "25% Project Progress",
    "review_3": "50% Project Progress",
    "review_4": "Project Output",
    "final": "Project Output",
}

# Reviews that need literature survey slides
NEEDS_LITERATURE = {"review_1", "review_2", "review_3", "review_4", "final"}

# Reviews that need image slides
NEEDS_IMAGES = {"review_2", "review_3", "review_4", "final"}


def _safe_build(label: str, slide_num: int, builder, *args, **kwargs):
    """Run a slide builder and wrap errors with the slide name/number."""
    try:
        result = builder(*args, **kwargs)
        if result is None:
            logger.warning("Builder '%s' (slide %d) returned None", label, slide_num)
        return result
    except Exception as e:
        raise RuntimeError(
            f"Failed building '{label}' (slide {slide_num}): "
            f"{type(e).__name__}: {e}"
        ) from e


def generate_ppt(data: PPTRequest, image_paths: list = None,
                 architecture_path: Path = None, section_image_map: dict = None) -> tuple:
    """
    Generate a .pptx file for the given PPTRequest.
    
    Args:
        data: PPTRequest with all slide content
        image_paths: List of Path objects for progress/output images
        architecture_path: Optional Path to architecture diagram image
        section_image_map: Optional dict mapping section keys to lists of image file Paths
    
    Returns:
        (file_id: str, output_path: Path, total_slides: int)
    """
    if image_paths is None:
        image_paths = []
    if section_image_map is None:
        section_image_map = {}

    prs = Presentation()
    prs.slide_width = Inches(10)
    prs.slide_height = Inches(7.5)

    slide_num = 1

    if data.sections is not None:
        # ── DYNAMIC PATH ──
        logger.info("DYNAMIC PATH — sections=%d, section_image_map keys=%s",
                    len(data.sections), list((section_image_map or {}).keys()))
        # Merge predefined and custom sections
        all_sections = (data.sections or []) + (data.custom_sections or [])
        enabled_sections = [s for s in all_sections if s.is_enabled]
        enabled_sections.sort(key=lambda s: s.order)

        # 1. Title Slide
        _safe_build("Title Slide", slide_num, build_title_slide, prs, data, slide_num)
        slide_num += 1

        lit_survey_built = False

        # 2. Iterate through sections
        for section in enabled_sections:
            # Map images with their path and caption
            upload_paths = section_image_map.get(section.key, [])
            slide_images = []
            for idx, img_meta in enumerate(section.section_images):
                if idx < len(upload_paths):
                    slide_images.append({
                        "path": upload_paths[idx],
                        "caption": img_meta.caption
                    })

            logger.info("Building slide for section '%s' (key=%s) with %d images",
                        section.title, section.key, len(slide_images))

            # Build the dynamic slide
            _safe_build(
                section.title, slide_num,
                build_dynamic_slide, prs, data, section, slide_num, slide_images
            )
            slide_num += 1

            # Insert Literature Survey right after Problem Statement
            if section.key == "problem" and data.review_type in NEEDS_LITERATURE and data.literature_survey:
                for idx in range(len(data.literature_survey)):
                    _safe_build(
                        f"Literature Survey #{idx + 1}", slide_num,
                        build_literature_slide, prs, data, slide_num, idx
                    )
                    slide_num += 1
                lit_survey_built = True

        # Fallback if problem section was disabled but literature survey is needed and not built yet
        if not lit_survey_built and data.review_type in NEEDS_LITERATURE and data.literature_survey:
            for idx in range(len(data.literature_survey)):
                _safe_build(
                    f"Literature Survey #{idx + 1}", slide_num,
                    build_literature_slide, prs, data, slide_num, idx
                )
                slide_num += 1

        # 3. Add Step 4 Progress Images at the end
        if data.review_type in NEEDS_IMAGES and image_paths:
            heading = REVIEW_IMAGE_HEADINGS.get(data.review_type, "Project Images")
            captions = data.image_captions or []
            for i, img_path in enumerate(image_paths):
                cap = captions[i] if i < len(captions) else img_path.stem
                _safe_build(
                    f"Image: {cap}", slide_num,
                    build_image_slide, prs, data, slide_num, img_path,
                    cap, i + 1, heading
                )
                slide_num += 1

    else:
        # ── PROCEDURAL PATH ──
        # 1. Title slide
        _safe_build("Title Slide", slide_num, build_title_slide, prs, data, slide_num)
        slide_num += 1

        # 2. Abstract
        _safe_build("Abstract", slide_num, build_abstract_slide, prs, data, slide_num)
        slide_num += 1

        # 3. Problem Statement
        _safe_build("Problem Statement", slide_num, build_problem_statement_slide, prs, data, slide_num)
        slide_num += 1

        # 4. Literature Survey (one slide per entry)
        if data.review_type in NEEDS_LITERATURE and data.literature_survey:
            for idx in range(len(data.literature_survey)):
                _safe_build(
                    f"Literature Survey #{idx + 1}", slide_num,
                    build_literature_slide, prs, data, slide_num, idx
                )
                slide_num += 1

        # 5. Existing System
        _safe_build("Existing System", slide_num, build_existing_system_slide, prs, data, slide_num)
        slide_num += 1

        # 6. Proposed System
        _safe_build("Proposed System", slide_num, build_proposed_system_slide, prs, data, slide_num)
        slide_num += 1

        # Architecture slide is optional for review_1 only.
        if data.review_type == "review_1" and architecture_path and architecture_path.exists():
            _safe_build(
                "Architecture", slide_num,
                build_architecture_slide, prs, data, slide_num, architecture_path
            )
            slide_num += 1

        # 8. Progress / Output images (one slide per image)
        if data.review_type in NEEDS_IMAGES and image_paths:
            heading = REVIEW_IMAGE_HEADINGS.get(data.review_type, "Project Images")
            captions = data.image_captions or []
            for i, img_path in enumerate(image_paths):
                cap = captions[i] if i < len(captions) else img_path.stem
                _safe_build(
                    f"Image: {cap}", slide_num,
                    build_image_slide, prs, data, slide_num, img_path,
                    cap, i + 1, heading
                )
                slide_num += 1

    # ── Save ──────────────────────────────────────────────────────────────
    total_slides = slide_num - 1
    file_id = generate_file_id()
    output_path = get_output_path(file_id, ".pptx")
    prs.save(str(output_path))

    # Verify the output file was created
    if not output_path.exists() or output_path.stat().st_size == 0:
        raise RuntimeError(
            f"PPT save appeared to succeed but output file is missing or empty: "
            f"{output_path}"
        )

    logger.info(
        f"PPT saved: {output_path.name} | "
        f"review={data.review_type} | "
        f"slides={total_slides}"
    )

    return file_id, output_path, total_slides
