# SKILL.md — ReportCraft Project Agent Instructions
**File name:** `SKILL.md`  
**Place this file at:** `reportcraft/SKILL.md` (project root)  
**Purpose:** Any AI coding agent working on this project reads this file first before touching any code.

---

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REPORTCRAFT — AI AGENT SKILL FILE
Smart Academic PPT, Report and PDF Generator
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

READ THIS ENTIRE FILE BEFORE WRITING ANY CODE.
This file is the single source of truth for every decision in this project.
Do not deviate from the architecture, file structure, or rules defined here.
Do not add features not listed here. Do not use libraries not listed here.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 1 — WHAT THIS PROJECT IS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NAME        : ReportCraft
TYPE        : College-internal web tool (not commercial, no payments, no ads)
PURPOSE     : Auto-generate correctly formatted project review presentations
              (.pptx) and project reports (.docx/.pdf) for engineering college
              students in India.

PROBLEM IT SOLVES:
  Students know their technical content but waste hours on manual formatting —
  wrong fonts, misaligned slides, incorrect spacing, broken PDF exports.
  This tool takes their content as form input and outputs perfectly formatted
  files using pre-built college templates.

WHAT IT GENERATES:
  1. Review PPT presentations (.pptx) — Review 0, 1, 2, 3, 4, Final Review
  2. Project Reports (.docx) — 35 to 55 pages, all required sections
  3. PDF versions of both — using LibreOffice headless (server-side only)
  4. ZIP bundles — PPTX/DOCX + PDF together in one download

PROJECT CATEGORIES SUPPORTED:
  stem           → STEM Project        (1st Year students)
  mini_project_1 → Mini Project 1      (2nd Year students)
  mini_project_2 → Mini Project 2      (3rd Year students)
  final_year     → Final Year Project  (4th Year students)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 2 — COMPLETE TECH STACK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FRONTEND (already built — do not recreate):
  Framework  : TanStack Start (file-based routing, runs with vinxi)
  Language   : TypeScript (.tsx files throughout)
  Styling    : Tailwind CSS + custom glass morphism CSS (src/styles.css)
  State      : Zustand (useProjectStore)
  Drag-drop  : dnd-kit/sortable (image reordering)
  HTTP       : Axios — ALL calls go through src/api/apiClient.ts ONLY
  Routing    : File-based via TanStack (routeTree.gen.ts auto-generated)
  Icons      : Lucide React
  Fonts      : Google Fonts — Inter

  FRONTEND ROUTES:
    /                  → Landing page (do not modify)
    /generate          → Feature hub — PPT or Report choice
    /generate/ppt      → 6-step PPT wizard
    /generate/report   → 8-step Report wizard
    /about             → About page (do not modify)

  KEY FRONTEND FILES:
    src/api/apiClient.ts        ← ALL backend calls here, nowhere else
    src/store/useProjectStore.ts ← Zustand global state
    src/components/rc/          ← All ReportCraft components
    src/styles.css              ← Glass morphism + animation CSS
    routes/                     ← TanStack file-based route files

BACKEND (we build this from scratch):
  Language   : Python 3.11+
  Framework  : FastAPI + uvicorn
  PPTX gen   : python-pptx==0.6.23
  DOCX gen   : python-docx==1.1.2
  Images     : Pillow==10.3.0
  Preview    : mammoth==1.7.1
  Uploads    : python-multipart==0.0.9
  Env vars   : python-dotenv==1.0.1
  Async files: aiofiles==23.2.1
  PDF        : LibreOffice headless (system install, NOT a pip package)
  ZIP        : Python built-in zipfile module (no extra install)

  BACKEND RUNS AT : http://localhost:8000
  FRONTEND RUNS AT: http://localhost:3000 (or vinxi default port)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 3 — COMPLETE FOLDER STRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

reportcraft/
├── SKILL.md                          ← THIS FILE — read before coding
├── README.md
├── .gitignore
├── .env.example
├── docker-compose.yml
├── .cursor/
│   └── agents/
│       └── repo.chatAgent
│
├── frontend/                         ← TanStack Start app (Lovable export)
│   ├── package.json                  ← dev script: "vinxi dev"
│   ├── app.config.ts                 ← TanStack Start config
│   ├── routeTree.gen.ts              ← auto-generated, never edit manually
│   ├── routes/
│   │   ├── index.tsx                 ← /  (landing)
│   │   ├── generate.tsx              ← /generate (feature hub)
│   │   ├── generate_.ppt.tsx         ← /generate/ppt (PPT wizard)
│   │   ├── generate_.report.tsx      ← /generate/report (Report wizard)
│   │   └── about.tsx                 ← /about
│   └── src/
│       ├── api/
│       │   └── apiClient.ts          ← ALL axios calls here only
│       ├── store/
│       │   └── useProjectStore.ts    ← Zustand state
│       ├── components/rc/            ← ReportCraft components
│       │   ├── Orbs.tsx
│       │   ├── Nav.tsx
│       │   ├── WizardShell.tsx
│       │   ├── CarryForwardBanner.tsx
│       │   └── (all other components)
│       ├── constants/
│       │   ├── reviewStructure.ts
│       │   ├── reportStructure.ts
│       │   ├── projectTypes.ts
│       │   └── defaults.ts
│       └── styles.css                ← glass morphism + animations
│
└── backend/
    ├── main.py                       ← FastAPI entry point
    ├── requirements.txt
    ├── .env                          ← never commit
    ├── Dockerfile
    ├── routers/
    │   ├── __init__.py
    │   ├── generate.py               ← POST /api/generate/ppt + /report
    │   ├── convert.py                ← POST /api/convert/pdf
    │   │                                GET  /api/download/{file_id}
    │   │                                GET  /api/bundle/{file_id}
    │   ├── preview.py                ← POST /api/preview/report + /ppt
    │   ├── upload.py                 ← POST /api/upload/images
    │   └── extract.py                ← POST /api/extract/ppt + /report
    ├── generators/
    │   ├── __init__.py
    │   ├── ppt_generator.py          ← generate_ppt(data, images) → Path
    │   ├── slide_builder.py          ← per-slide functions + BUILDERS dict
    │   ├── slide_map.py              ← SLIDE_MAP dict
    │   ├── report_generator.py       ← generate_report(data, images) → Path
    │   └── section_builder.py        ← per-section functions
    ├── converters/
    │   ├── __init__.py
    │   └── pdf_converter.py          ← LibreOffice subprocess
    ├── models/
    │   ├── __init__.py
    │   ├── schemas.py                ← Pydantic request models
    │   └── responses.py              ← Pydantic response models
    ├── utils/
    │   ├── __init__.py
    │   ├── image_processor.py        ← save, sort, resize, validate
    │   ├── file_manager.py           ← UUID, paths, cleanup
    │   ├── style_applier.py          ← apply font/style to objects
    │   └── logger.py                 ← get_logger(name)
    ├── templates/
    │   ├── ppt/
    │   │   └── college_template.pptx ← CREATE MANUALLY in PowerPoint
    │   └── report/
    │       └── college_template.docx ← CREATE MANUALLY in Word
    ├── uploads/                      ← temp, auto-cleaned
    │   └── .gitkeep
    ├── outputs/                      ← temp, auto-cleaned
    │   └── .gitkeep
    ├── tests/
    │   ├── conftest.py
    │   ├── test_ppt_generator.py
    │   ├── test_report_generator.py
    │   ├── test_pdf_converter.py
    │   └── test_image_processor.py
    └── docs/
        ├── API_REFERENCE.md
        ├── TEMPLATE_SETUP.md
        └── DEPLOYMENT.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 4 — COLLEGE CONTENT RULES (MEMORISE THESE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TITLE SLIDE FIELDS (same for every review type and report):
  course_code        e.g. "19CS601"
  course_name        e.g. "Mini Project 1"
  project_name       full project title
  students           list of {name, reg_no} — minimum 1
  guide_name         faculty guide full name
  guide_designation  e.g. "Associate Professor"
  department         e.g. "Computer Science and Engineering"

PPT SLIDE STRUCTURE BY REVIEW TYPE:
  review_0 → 5 slides:
    Title | Abstract | Problem Statement | Existing System | Proposed System

  review_1 → 6 slides (+ optional 7th):
    Title | Abstract | Problem Statement | Literature Survey |
    Existing System | Proposed System | [Architecture/Flowchart optional]

  review_2 → 7 slides:
    Title | Abstract | Problem Statement | Literature Survey |
    Existing System | Proposed System | 25% Progress Images

  review_3 → 7 slides:
    Title | Abstract | Problem Statement | Literature Survey |
    Existing System | Proposed System | 50% Progress Images

  review_4 → 7 slides:
    Title | Abstract | Problem Statement | Literature Survey |
    Existing System | Proposed System | Final Output Images

  final → 7 slides (same as review_4):
    Title | Abstract | Problem Statement | Literature Survey |
    Existing System | Proposed System | Final Output Images

SLIDE_MAP (used in slide_map.py — never change this without guide approval):
  "review_0": ["title","abstract","problem","existing","proposed"]
  "review_1": ["title","abstract","problem","literature","existing","proposed"]
  "review_2": ["title","abstract","problem","literature","existing","proposed","images_25"]
  "review_3": ["title","abstract","problem","literature","existing","proposed","images_50"]
  "review_4": ["title","abstract","problem","literature","existing","proposed","output_images"]
  "final":    ["title","abstract","problem","literature","existing","proposed","output_images"]

REPORT SECTION ORDER — FIXED, NEVER REORDER:
  1.  Title page
  2.  Bonafide certificate
  3.  Acknowledgement
  4.  Abstract
  5.  List of Figures
  6.  Table of Contents
  7.  Chapter 1 — Introduction
  8.  Chapter 2 — Literature Survey (min 5 entries, 4-column table)
  9.  Chapter 3 — Existing System
  10. Chapter 4 — Proposed System
  11. Additional chapters (student + guide choice, dynamic)

LITERATURE SURVEY RULE:
  Required for: review_1, review_2, review_3, review_4, final, ALL reports
  NOT required for: review_0 only
  Minimum entries: 5
  Each entry fields: title, author, year, summary
  Enforce in frontend: disable Next button if count < 5
  Enforce in backend: Pydantic validator raises ValueError if < 5

IMAGE ORDERING RULE:
  Students name images: 01_arch.png, 02_flow.png, 03_output.png
  Backend sort: sort_images_by_prefix() using regex on filename stem
  Frontend: drag-and-drop reorder is the primary mechanism
  Final order in request = the order images appear in slides/pages

FORMATTING DEFAULTS:
  Report: Times New Roman, 12pt body, 14pt heading, 1.5 spacing, justify
  PPT:    Calibri/Arial, 18pt body, 28pt title, left align

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 5 — ALL API ROUTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

POST   /api/generate/ppt
  In:   multipart/form-data { data: JSON(PPTRequest), images: File[] }
  Out:  { file_id, filename, created_at }
  Does: validate → cleanup_old_files() → save images → generate_ppt() → return

POST   /api/generate/report
  In:   multipart/form-data { data: JSON(ReportRequest), images: File[] }
  Out:  { file_id, filename, created_at }
  Does: validate → cleanup_old_files() → save images → generate_report() → return

POST   /api/convert/pdf
  In:   JSON { file_id: str, file_type: "pptx"|"docx" }
  Out:  { pdf_file_id, filename }
  Does: find file → LibreOffice subprocess → return pdf_file_id

GET    /api/download/{file_id}
  Out:  FileResponse (streams bytes, Content-Disposition header)
  Does: tries extensions in order: pptx, docx, pdf → returns first found
  404 if not found or expired

GET    /api/bundle/{file_id}
  Out:  FileResponse (.zip)
  Does: zipfile.ZipFile in memory → adds pptx + docx + pdf if they exist
        named {file_id}_bundle.zip
  Uses: Python built-in zipfile — no extra library

POST   /api/upload/images
  In:   multipart/form-data { session_id: str, files: File[] }
  Out:  { files: [{filename, path, order}], total }
  Does: validate type (jpg/png/gif) and size (< MAX_IMAGE_MB)
        save to uploads/{session_id}/
        sort by prefix → return sorted list

POST   /api/preview/report
  In:   JSON { file_id: str }
  Out:  { html: str }
  Does: mammoth.convert_to_html(docx_file) → return HTML string

POST   /api/preview/ppt
  In:   JSON { file_id: str }
  Out:  { slides: [{number, title, summary}], total_slides }

POST   /api/extract/ppt     [Phase 7 — last]
  In:   uploaded .pptx file
  Out:  { sections: {slide_1: text, ...} }

POST   /api/extract/report  [Phase 7 — last]
  In:   uploaded .docx file
  Out:  { sections: {section_name: text, ...} }

GET    /health
  Out:  { status: "ok" }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 6 — PYDANTIC SCHEMAS (schemas.py)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class Student(BaseModel):
    name: str
    reg_no: str

class TitleSlide(BaseModel):
    course_code: str
    course_name: str
    project_name: str
    students: List[Student]
    guide_name: str
    guide_designation: str
    department: str

class LiteratureEntry(BaseModel):
    title: str
    author: str
    year: str
    summary: str

class AdditionalChapter(BaseModel):
    title: str
    content: str

class StyleInstructions(BaseModel):
    font_name: str = "Times New Roman"
    title_font_size: int = 28
    body_font_size: int = 18
    bold_headings: bool = True
    line_spacing: float = 1.5
    text_alignment: str = "justify"

class PPTRequest(BaseModel):
    project_type: str
    review_type: str
    title_slide: TitleSlide
    abstract: str
    problem_statement: str
    literature_survey: Optional[List[LiteratureEntry]] = []
    existing_system: str
    proposed_system: str
    architecture_image: Optional[str] = None
    instructions: StyleInstructions = StyleInstructions()
    # validator: review_1+ must have >= 5 literature entries

class ReportRequest(BaseModel):
    project_type: str
    title_slide: TitleSlide
    acknowledgement: str
    abstract: str
    literature_survey: List[LiteratureEntry]   # always min 5
    introduction: str
    existing_system: str
    proposed_system: str
    additional_chapters: Optional[List[AdditionalChapter]] = []
    instructions: StyleInstructions = StyleInstructions()

class ConvertRequest(BaseModel):
    file_id: str
    file_type: str = "docx"

class PreviewRequest(BaseModel):
    file_id: str

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 7 — STEP-BY-STEP IMPLEMENTATION PLAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Build strictly in this order. Do not start the next phase until the current
phase passes its test criteria. Each phase is independently testable.

──────────────────────────────────────────────────────────────────────────
PHASE 1 — Core PPT generation (prove the concept end-to-end)
──────────────────────────────────────────────────────────────────────────
Goal: generate a working Review 1 PPT from form data.

Files to create (in this order):
  1.  backend/utils/logger.py
        get_logger(name) → logging.Logger
        format: "%(asctime)s %(levelname)-8s %(name)s — %(message)s"
        level from LOG_LEVEL env var, default INFO

  2.  backend/utils/file_manager.py
        UPLOAD_DIR, OUTPUT_DIR from .env
        generate_file_id() → uuid4().hex
        get_output_path(file_id, ext) → Path
        get_upload_dir(session_id) → Path (creates if missing)
        cleanup_old_files() → deletes files older than FILE_EXPIRY_MINUTES

  3.  backend/utils/style_applier.py
        apply_ppt_styles(slide, instructions: StyleInstructions)
          iterates shapes → text frames → paragraphs → runs
          sets font.name, font.size (Pt), font.bold
        apply_doc_styles(doc, instructions: StyleInstructions)
          modifies doc.styles["Normal"] font and paragraph_format

  4.  backend/models/schemas.py
        All Pydantic models as listed in Section 6 above
        Include @validator on PPTRequest.literature_survey:
          if review_type in ["review_1","review_2","review_3","review_4","final"]
          and len(v) < 5: raise ValueError("Minimum 5 literature entries required")

  5.  backend/models/responses.py
        GenerateResponse(file_id, filename, created_at)
        ConvertResponse(pdf_file_id, filename)
        PreviewResponse(html)
        PPTPreviewResponse(slides, total_slides)
        UploadResponse(files, total)
        ExtractResponse(sections, source_filename)
        ErrorResponse(detail, code)

  6.  backend/generators/slide_map.py
        SLIDE_MAP dict exactly as defined in Section 4
        No other logic in this file

  7.  backend/generators/slide_builder.py
        Import: from pptx import Presentation; from pptx.util import Inches, Pt
        Implement these functions (each adds ONE slide, returns slide):
          build_title_slide(prs, data, images)
            layouts[0] — fills project_name, all student names+reg, guide info
          build_abstract_slide(prs, data, images)
            layouts[1] — title="Abstract", body=data.abstract
          build_problem_slide(prs, data, images)
            layouts[1] — title="Problem Statement", body=data.problem_statement
          build_litsurvey_slide(prs, data, images)
            layouts[1] — title="Literature Survey"
            body = formatted list of all literature entries
          build_existing_slide(prs, data, images)
            layouts[1] — title="Existing System", body=data.existing_system
          build_proposed_slide(prs, data, images)
            layouts[1] — title="Proposed System", body=data.proposed_system
          build_image_slide(prs, data, images, slide_title)
            layouts[2] — title=slide_title, places images from list
          build_architecture_slide(prs, data, images)
            layouts[2] — title="Architecture / Flowchart"
        BUILDERS dict at bottom:
          {
            "title": build_title_slide,
            "abstract": build_abstract_slide,
            "problem": build_problem_slide,
            "literature": build_litsurvey_slide,
            "existing": build_existing_slide,
            "proposed": build_proposed_slide,
            "architecture": build_architecture_slide,
            "images_25": lambda p,d,i: build_image_slide(p,d,i,"25% Progress"),
            "images_50": lambda p,d,i: build_image_slide(p,d,i,"50% Progress"),
            "output_images": lambda p,d,i: build_image_slide(p,d,i,"Output"),
          }

  8.  backend/generators/ppt_generator.py
        from pptx import Presentation
        TEMPLATE = Path("templates/ppt/college_template.pptx")
        def generate_ppt(data: PPTRequest, image_paths: list) -> Path:
          prs = Presentation(TEMPLATE)
          slide_keys = SLIDE_MAP[data.review_type]
          if data.architecture_image and data.review_type == "review_1":
            slide_keys = slide_keys + ["architecture"]
          for key in slide_keys:
            BUILDERS[key](prs, data, image_paths)
            apply_ppt_styles(prs.slides[-1], data.instructions)
          out = OUTPUT_DIR / f"{generate_file_id()}.pptx"
          prs.save(out)
          logger.info("PPT saved: %s", out.name)
          return out

  9.  backend/routers/convert.py
        GET /api/download/{file_id}
          tries: OUTPUT_DIR / f"{file_id}.pptx" → .docx → .pdf
          returns FileResponse if found, 404 if not

  10. backend/routers/generate.py
        POST /api/generate/ppt
          parse data as PPTRequest
          call cleanup_old_files()
          call generate_ppt(payload, [])   ← empty images for Phase 1
          return GenerateResponse

  11. backend/main.py
        load_dotenv()
        app = FastAPI(title="ReportCraft API")
        add CORSMiddleware (allow FRONTEND_ORIGIN from env)
        include all routers
        startup event: create uploads/ and outputs/ if missing
        GET /health → {"status":"ok"}

  12. backend/requirements.txt
        fastapi==0.111.0
        uvicorn[standard]==0.29.0
        python-pptx==0.6.23
        python-docx==1.1.2
        Pillow==10.3.0
        mammoth==1.7.1
        python-multipart==0.0.9
        python-dotenv==1.0.1
        aiofiles==23.2.1

  13. backend/templates/ppt/college_template.pptx
        CREATE MANUALLY in PowerPoint (see TEMPLATE_SETUP.md):
        layouts[0] = Title slide
        layouts[1] = Content slide (title + body)
        layouts[2] = Image slide (title + placeholders)
        Include college logo, color theme, slide master

PHASE 1 TEST — must pass before Phase 2:
  curl -X POST http://localhost:8000/api/generate/ppt \
    -F 'data={"project_type":"mini_project_1","review_type":"review_1",...}'
  → receives file_id
  curl http://localhost:8000/api/download/{file_id} --output test.pptx
  → open in PowerPoint → 6 slides present → correct content → correct font

──────────────────────────────────────────────────────────────────────────
PHASE 2 — All PPT review types + image handling
──────────────────────────────────────────────────────────────────────────
Goal: all 6 review types generate correctly with images.

Files to create/update:
  1.  backend/utils/image_processor.py
        ALLOWED_TYPES = {"image/jpeg","image/png","image/gif","image/webp"}
        sort_images_by_prefix(paths):
          import re
          def n(p): m=re.match(r"^(\d+)",Path(p).stem); return int(m.group(1)) if m else 999
          return sorted(paths, key=n)
        resize_if_large(path, max_width=1920):
          from PIL import Image
          with Image.open(path) as img:
            if img.width > max_width:
              ratio = max_width/img.width
              img = img.resize((max_width, int(img.height*ratio)), Image.LANCZOS)
              img.save(path)
          return path
        validate_image(path) → bool (check file is real image)
        async save_uploaded_images(files, session_dir) → List[Path]:
          for each: validate type, validate size, write bytes, resize
          return sort_images_by_prefix(saved)

  2.  backend/routers/upload.py
        POST /api/upload/images
        call save_uploaded_images(files, get_upload_dir(session_id))
        return UploadResponse

  3.  backend/routers/generate.py (update)
        Accept images: List[UploadFile] = File([])
        save images via save_uploaded_images before calling generate_ppt

  4.  backend/generators/slide_builder.py (update)
        build_image_slide: iterate image_paths, place each with add_picture()
        from pptx.util import Inches
        image placement: top=Inches(1.5), left=Inches(0.5), width=Inches(4)

  5.  backend/tests/conftest.py
        fixtures: mock_ppt_request(), sample_image_path(), temp_dirs()

  6.  backend/tests/test_ppt_generator.py
        test review_0_has_5_slides
        test review_1_has_6_slides
        test review_2_has_7_slides
        test title_slide_has_project_name
        test literature_slide_missing_in_review_0

  7.  backend/tests/test_image_processor.py
        test sort_by_prefix_correct_order
        test resize_reduces_large_image
        test invalid_file_rejected

PHASE 2 TEST:
  Upload 3 images named 01_arch.png, 03_output.png, 02_flow.png
  Generate Review 2 PPT → images appear in order: arch → flow → output

──────────────────────────────────────────────────────────────────────────
PHASE 3 — Report (DOCX) generation
──────────────────────────────────────────────────────────────────────────
Goal: generate a complete 35+ page report with all sections in correct order.

Files to create:
  1.  backend/generators/section_builder.py
        from docx import Document
        from docx.shared import Pt, Inches
        from docx.enum.text import WD_ALIGN_PARAGRAPH

        add_title_page(doc, title_slide):
          Centered college name, project title, student list, guide info

        add_bonafide(doc, title_slide):
          doc.add_page_break()
          Centered heading "BONAFIDE CERTIFICATE"
          Para: "This is to certify that project entitled '[project_name]'
                 submitted by [student names] is a bonafide record of work..."
          Signature lines for guide and HOD

        add_acknowledgement(doc, text):
          doc.add_page_break()
          Heading "ACKNOWLEDGEMENT"
          Paragraph with provided text, justified

        add_abstract(doc, text):
          doc.add_page_break()
          Heading "ABSTRACT"
          Paragraph with provided text, justified

        add_lof(doc):
          doc.add_page_break()
          Heading "LIST OF FIGURES"
          Placeholder paragraph "List of figures will be updated after final review"

        add_toc(doc):
          doc.add_page_break()
          Heading "TABLE OF CONTENTS"
          Placeholder paragraph "Update this field in Word: right-click → Update Field"

        add_chapter(doc, title, content, level=1):
          doc.add_page_break()
          doc.add_heading(title, level=level)
          doc.add_paragraph(content).alignment = WD_ALIGN_PARAGRAPH.JUSTIFY

        add_litsurvey_table(doc, entries):
          doc.add_page_break()
          doc.add_heading("Chapter 2 — Literature Survey", level=1)
          table = doc.add_table(rows=1, cols=4)
          table.style = "Table Grid"
          headers = ["Title", "Author", "Year", "Summary"]
          for cell, h in zip(table.rows[0].cells, headers): cell.text = h
          for e in entries:
            row = table.add_row().cells
            row[0].text = e.title; row[1].text = e.author
            row[2].text = e.year;  row[3].text = e.summary

        add_image_with_caption(doc, image_path, caption):
          doc.add_picture(str(image_path), width=Inches(5))
          p = doc.add_paragraph(caption)
          p.alignment = WD_ALIGN_PARAGRAPH.CENTER

        add_page_break(doc):
          doc.add_page_break()

  2.  backend/generators/report_generator.py
        TEMPLATE = Path("templates/report/college_template.docx")
        def generate_report(data: ReportRequest, image_paths: list) -> Path:
          doc = Document(TEMPLATE)
          apply_doc_styles(doc, data.instructions)
          add_title_page(doc, data.title_slide)
          add_bonafide(doc, data.title_slide)
          add_acknowledgement(doc, data.acknowledgement)
          add_abstract(doc, data.abstract)
          add_lof(doc)
          add_toc(doc)
          add_chapter(doc, "Chapter 1 — Introduction", data.introduction)
          add_litsurvey_table(doc, data.literature_survey)
          add_chapter(doc, "Chapter 3 — Existing System", data.existing_system)
          add_chapter(doc, "Chapter 4 — Proposed System", data.proposed_system)
          for i, ch in enumerate(data.additional_chapters or [], start=5):
            add_chapter(doc, f"Chapter {i} — {ch.title}", ch.content)
          for img_path in image_paths:
            add_image_with_caption(doc, img_path, f"Figure: {img_path.stem}")
          out = OUTPUT_DIR / f"{generate_file_id()}.docx"
          doc.save(out)
          return out

  3.  backend/routers/generate.py (add report route)
        POST /api/generate/report
        parse ReportRequest → save images → generate_report → return

  4.  backend/templates/report/college_template.docx
        CREATE MANUALLY in Word:
        Margins: 1 inch all sides
        Normal: Times New Roman 12pt, 1.5 spacing, Justify
        Heading 1: Times New Roman 14pt Bold
        Heading 2: Times New Roman 12pt Bold
        Header: college name

  5.  backend/tests/test_report_generator.py
        test all sections present in correct order
        test lit survey table has 4 columns
        test page count roughly correct (doc.paragraphs length > 50)

PHASE 3 TEST:
  POST /api/generate/report with full data → download .docx →
  open in Word → verify section order matches FIXED ORDER above

──────────────────────────────────────────────────────────────────────────
PHASE 4 — PDF conversion + ZIP bundle
──────────────────────────────────────────────────────────────────────────
Goal: convert both .pptx and .docx to .pdf — also ZIP bundle download.

Files to create/update:
  1.  backend/converters/pdf_converter.py
        import subprocess
        def convert_to_pdf(input_path: Path, output_dir: Path) -> Path:
          if not input_path.exists():
            raise FileNotFoundError(f"Input not found: {input_path}")
          output_dir.mkdir(parents=True, exist_ok=True)
          result = subprocess.run(
            ["libreoffice","--headless","--convert-to","pdf",
             "--outdir", str(output_dir), str(input_path)],
            capture_output=True, timeout=60
          )
          if result.returncode != 0:
            err = result.stderr.decode(errors="replace")
            if "not found" in err.lower() or result.returncode == 127:
              raise RuntimeError("LibreOffice not installed. Run: sudo apt-get install -y libreoffice")
            raise RuntimeError(f"Conversion failed: {err}")
          out = output_dir / f"{input_path.stem}.pdf"
          if not out.exists():
            raise RuntimeError(f"PDF not created at expected path: {out}")
          return out

  2.  backend/routers/convert.py (add PDF and bundle routes)
        POST /api/convert/pdf
          find file by file_id + file_type
          call convert_to_pdf(input_path, OUTPUT_DIR)
          return ConvertResponse(pdf_file_id=out.stem, filename=out.name)

        GET /api/bundle/{file_id}
          import zipfile, io
          buf = io.BytesIO()
          with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
            for ext in ["pptx","docx","pdf"]:
              p = OUTPUT_DIR / f"{file_id}.{ext}"
              if p.exists(): zf.write(p, p.name)
          buf.seek(0)
          return StreamingResponse(buf, media_type="application/zip",
            headers={"Content-Disposition": f'attachment; filename="{file_id}_bundle.zip"'})

  3.  backend/Dockerfile
        FROM python:3.11-slim
        RUN apt-get update && apt-get install -y libreoffice --no-install-recommends \
            && rm -rf /var/lib/apt/lists/*
        WORKDIR /app
        COPY requirements.txt .
        RUN pip install --no-cache-dir -r requirements.txt
        COPY . .
        RUN mkdir -p uploads outputs
        EXPOSE 8000
        CMD ["uvicorn","main:app","--host","0.0.0.0","--port","8000"]

  4.  backend/tests/test_pdf_converter.py
        test output_file_exists_after_conversion
        test output_starts_with_pdf_header (%PDF)
        test libreoffice_not_found_raises_clear_error

PHASE 4 TEST:
  Generate a .pptx → POST /api/convert/pdf → download .pdf → open → formatting preserved
  GET /api/bundle/{file_id} → unzip → contains both files

──────────────────────────────────────────────────────────────────────────
PHASE 5 — Live preview (mammoth HTML)
──────────────────────────────────────────────────────────────────────────
Goal: student sees a readable HTML preview before downloading.

Files to create:
  1.  backend/routers/preview.py
        POST /api/preview/report
          path = get_output_path(body.file_id, "docx")
          with open(path,"rb") as f:
            result = mammoth.convert_to_html(f)
          return PreviewResponse(html=result.value)

        POST /api/preview/ppt
          path = get_output_path(body.file_id, "pptx")
          prs = Presentation(path)
          slides = []
          for i, slide in enumerate(prs.slides):
            title = slide.shapes.title.text if slide.shapes.title else f"Slide {i+1}"
            texts = [sh.text for sh in slide.shapes if sh.has_text_frame and sh != slide.shapes.title]
            summary = " ".join(texts)[:120]
            slides.append({"number":i+1, "title":title, "summary":summary})
          return {"slides":slides, "total_slides":len(slides)}

PHASE 5 TEST:
  Generate report → POST /api/preview/report → HTML returned →
  render in frontend PreviewPanel → all section headings visible

──────────────────────────────────────────────────────────────────────────
PHASE 6 — Connect frontend to backend
──────────────────────────────────────────────────────────────────────────
Goal: replace all mock functions in apiClient.ts with real API calls.

File to update — ONE FILE ONLY:
  frontend/src/api/apiClient.ts
    Set baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"

    Replace each mock with real axios call:

    generatePPT(data, images):
      const form = new FormData()
      form.append("data", JSON.stringify(data))
      images.forEach(img => form.append("images", img.file, img.name))
      const res = await api.post("/api/generate/ppt", form,
        { headers: {"Content-Type":"multipart/form-data"} })
      return res.data

    generateReport(data, images):
      same pattern as generatePPT but POST to /api/generate/report

    convertToPDF(fileId, fileType):
      const res = await api.post("/api/convert/pdf", {file_id:fileId, file_type:fileType})
      return res.data

    downloadFile(fileId):
      const res = await api.get(`/api/download/${fileId}`, {responseType:"blob"})
      const url = URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement("a"); a.href=url; a.click()
      URL.revokeObjectURL(url)

    downloadBundle(fileId):
      same as downloadFile but GET /api/bundle/{fileId}

    previewReport(fileId):
      const res = await api.post("/api/preview/report", {file_id:fileId})
      return res.data

IMPORTANT: TanStack Start uses vinxi, not vite.
  The /api proxy in vite.config cannot be used.
  Instead set VITE_API_BASE_URL in the .env at frontend root.
  TanStack Start reads .env variables with VITE_ prefix the same way.
  CORS on backend must allow the frontend origin (set in backend .env).

PHASE 6 TEST:
  Run frontend (vinxi dev) + backend (uvicorn) simultaneously
  Fill PPT wizard → click Generate Now → real file_id returned →
  click Download → real .pptx downloads → open in PowerPoint

──────────────────────────────────────────────────────────────────────────
PHASE 7 — Extract from uploaded file (last, optional advanced)
──────────────────────────────────────────────────────────────────────────
Goal: student uploads old .pptx or .docx → text extracted → form pre-filled.

Files to create:
  1.  backend/routers/extract.py
        POST /api/extract/ppt
          from pptx import Presentation; from io import BytesIO
          prs = Presentation(BytesIO(await file.read()))
          sections = {f"slide_{i+1}": " ".join(sh.text for sh in s.shapes if sh.has_text_frame)
                      for i,s in enumerate(prs.slides)}
          return ExtractResponse(sections=sections, source_filename=file.filename)

        POST /api/extract/report
          from docx import Document
          doc = Document(BytesIO(await file.read()))
          text = "\n".join(p.text for p in doc.paragraphs if p.text.strip())
          return ExtractResponse(sections={"full_text":text}, source_filename=file.filename)

PHASE 7 TEST:
  Upload an old review PPT → verify slide text extracted correctly →
  form fields pre-filled in frontend

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 8 — ABSOLUTE RULES (NEVER BREAK THESE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RULE 1 — PDF = LibreOffice headless ONLY
  Never jsPDF. Never html2pdf. Never docx2pdf. Never browser print.
  The ONLY acceptable PDF method:
  subprocess.run(["libreoffice","--headless","--convert-to","pdf","--outdir",...])

RULE 2 — All API calls through apiClient.ts ONLY
  No direct fetch() or axios calls anywhere else in the frontend.
  If you need a new API call, add it to apiClient.ts first.

RULE 3 — Image ordering by filename numeric prefix
  Always call sort_images_by_prefix() before passing images to generator.
  Drag-drop order from frontend overrides prefix sort when explicitly reordered.

RULE 4 — Literature survey minimum 5 entries — enforce in BOTH places
  Frontend: Next button disabled, tooltip shown, counter badge shown
  Backend: Pydantic @validator raises ValueError

RULE 5 — Temp files auto-deleted
  cleanup_old_files() is called at the top of EVERY generate route.
  Never accumulate files in uploads/ or outputs/ across requests.

RULE 6 — Template files are source of truth for formatting
  Never hardcode font names, colors, or margins in Python generator code.
  Open the template file → inherit its styles → fill content only.

RULE 7 — Report section order is FIXED
  bonafide → acknowledgement → abstract → lof → toc →
  introduction → literature survey → existing → proposed → additional
  Never skip. Never reorder. Never add sections between fixed ones.

RULE 8 — No print() in backend code
  Every module uses: logger = get_logger(__name__)

RULE 9 — No authentication in v1
  No login. No sessions. No user accounts. No JWT. No cookies.
  Open internal college tool. Keep it simple.

RULE 10 — No database in v1
  No PostgreSQL. No SQLite. No Redis. No Celery.
  Files are keyed by UUID. Stored in outputs/. Cleaned after expiry.
  Carry-forward uses localStorage (frontend only).

RULE 11 — Do not add features not in this document
  This is a college tool with a fixed feature set.
  Any new feature request must be discussed first.
  Do not add: user profiles, project history, AI suggestions, email sharing,
  cloud sync, real-time collaboration, or payment features.

RULE 12 — Never commit .env files
  backend/.env is in .gitignore. Never commit it.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 9 — ENVIRONMENT SETUP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BACKEND SETUP:
  cd backend
  python -m venv venv
  source venv/bin/activate        # Windows: venv\Scripts\activate
  pip install -r requirements.txt
  sudo apt-get install -y libreoffice   # Ubuntu/Debian/WSL
  cp ../.env.example .env              # then edit .env
  uvicorn main:app --reload --port 8000

FRONTEND SETUP (TanStack Start):
  cd frontend
  npm install
  npm run dev                     # runs vinxi dev, not vite

FRONTEND ENV (frontend/.env):
  VITE_API_BASE_URL=http://localhost:8000

BACKEND ENV (backend/.env):
  UPLOAD_DIR=./uploads
  OUTPUT_DIR=./outputs
  MAX_IMAGE_MB=10
  FILE_EXPIRY_MINUTES=60
  FRONTEND_ORIGIN=http://localhost:3000
  LOG_LEVEL=INFO

VERIFY EVERYTHING WORKS:
  curl http://localhost:8000/health   → {"status":"ok"}
  libreoffice --version               → LibreOffice 7.x.x
  python -c "import pptx,docx,mammoth; print('OK')"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 10 — SUCCESS CRITERIA (HOW TO KNOW EACH PHASE IS DONE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PHASE 1 DONE when:
  ✓ Review 1 PPT opens in PowerPoint with 6 correct slides
  ✓ Title slide shows project name, all student names, guide info
  ✓ Font matches StyleInstructions settings
  ✓ File downloads successfully via /api/download/{file_id}

PHASE 2 DONE when:
  ✓ All 6 review types generate correct slide counts
  ✓ Images appear on image slides in correct sorted order
  ✓ Large images are resized before placement
  ✓ All pytest tests in test_ppt_generator.py pass

PHASE 3 DONE when:
  ✓ Report .docx opens in Word with all 10+ sections present
  ✓ Section order matches FIXED ORDER exactly
  ✓ Literature survey is a formatted 4-column table
  ✓ Each section starts on a new page
  ✓ Font throughout is Times New Roman 12pt

PHASE 4 DONE when:
  ✓ .pptx converts to .pdf with formatting preserved
  ✓ .docx converts to .pdf with all 35+ pages intact
  ✓ ZIP bundle contains both files, downloads as one click
  ✓ test_pdf_converter.py passes

PHASE 5 DONE when:
  ✓ HTML preview renders in frontend PreviewPanel
  ✓ All section headings are visible in preview
  ✓ PPT slide list shows correct titles and summaries

PHASE 6 DONE when:
  ✓ Full end-to-end PPT: fill form → generate → download .pptx
  ✓ Full end-to-end Report: fill form → generate → download .docx
  ✓ PDF conversion works from frontend button
  ✓ ZIP bundle downloads from frontend button
  ✓ No mock functions remaining in apiClient.ts

PHASE 7 DONE when:
  ✓ Upload old .pptx → form fields pre-filled with extracted text

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 11 — TEMPLATE FILE CREATION GUIDE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BEFORE PHASE 1 — create college_template.pptx manually in PowerPoint:
  1. Design → Slide Size → Widescreen 16:9
  2. View → Slide Master → insert college logo
  3. Set college color theme
  4. Create layouts:
     layouts[0] = Title slide (large title + subtitle)
     layouts[1] = Content slide (title + body text area)
     layouts[2] = Image slide (title + image placeholders)
  5. Close Slide Master
  6. Save as: backend/templates/ppt/college_template.pptx

BEFORE PHASE 3 — create college_template.docx manually in Word:
  1. Layout → Margins → 1 inch all sides (confirm with guide)
  2. Styles:
     Normal   = Times New Roman 12pt, 1.5 spacing, Justify
     Heading 1 = Times New Roman 14pt Bold
     Heading 2 = Times New Roman 12pt Bold
  3. Insert → Header → college name (centered)
  4. Insert → Footer → page number (centered)
  5. Delete all body content (keep header/footer only)
  6. Save as: backend/templates/report/college_template.docx

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 12 — HOW TO USE THIS SKILL FILE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. CURSOR AI AGENT (@repo)
   Place SKILL.md at: reportcraft/SKILL.md
   In any Cursor chat, type:
     @repo read SKILL.md then build Phase 1 starting with schemas.py
   The @repo agent will read the file and follow all rules automatically.

2. GITHUB COPILOT / INLINE TOOLS
   Open SKILL.md in a tab before asking Copilot for code.
   Copilot reads open files as context — having SKILL.md open ensures it
   follows the architecture without you repeating it every time.

3. ANY AI CHAT (Claude, GPT, Gemini)
   Paste the contents of SKILL.md as your first message.
   Then ask your question. The AI will treat this as the project specification.
   Example:
     [paste SKILL.md contents]
     Now implement Phase 1 Step 7 — slide_builder.py

4. TEAM MEMBERS (if working with others)
   Every developer on this project reads SKILL.md first before writing code.
   If you want to change anything in SKILL.md — discuss first, then update the
   file, then tell the team. SKILL.md is always the current truth.

5. UPDATING SKILL.md
   When a phase is completed, mark it: add ✓ DONE next to the phase header.
   When a new requirement is added by the guide, add it to the relevant section.
   Never remove content from SKILL.md — only add or annotate.
```
