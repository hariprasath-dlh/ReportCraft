# 🎓 ReportCraft — Smart Academic PPT & Report Generator

> **Stop fighting with formatting. Start focusing on your project.**  
> A one-click tool that generates perfectly formatted college project review presentations and reports for Indian engineering students.

![Status](https://img.shields.io/badge/Status-Active%20Development-2ea44f?style=for-the-badge)
![Frontend](https://img.shields.io/badge/Frontend-TanStack%20Start-0f172a?style=for-the-badge&logo=react)
![Backend](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

---

## 📖 Table of Contents

- [🎯 The Problem](#-the-problem)
- [💡 Our Solution](#-our-solution)
- [✨ Features Built So Far](#-features-built-so-far)
- [🗺️ Roadmap — What's Coming Next](#️-roadmap--whats-coming-next)
- [🛠️ Tech Stack](#️-tech-stack)
- [🧩 Project Architecture](#-project-architecture)
- [📂 Folder Structure](#-folder-structure)
- [🧭 My Approach — How I'm Building This](#-my-approach--how-im-building-this)
- [🚀 Getting Started](#-getting-started)
- [🌐 API Endpoints](#-api-endpoints)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)
- [🙏 Acknowledgements](#-acknowledgements)

---

## 🎯 The Problem

If you've ever been an engineering student in India, you already know the drill.

Every semester, you spend **hours — sometimes days** — wrestling with formatting instead of your actual project work:

- 📏 Wrong font sizes, wrong fonts entirely (Times New Roman instead of Calibri, 11pt instead of 12pt)
- 🎨 Misaligned slides, broken bullet points, inconsistent colors
- 📄 Reports that should be 40 pages but look like 15 because of spacing issues
- 🔄 Re-formatting the same content for Review 1, then Review 2, then Review 3…
- 😤 Guides rejecting submissions because "the literature survey table isn't in the right format"
- 🖨️ PDF exports that look nothing like the Word document

**The irony?** Students know their technical content perfectly. They've built the project, written the code, done the research. But they waste precious time on *manual formatting* — something a tool should handle automatically.

This is especially painful because:
- Every college has **strict templates** that rarely change year to year
- The templates have **fixed section orders** that must be followed exactly
- Students across all 4 years (STEM → Mini Project 1 → Mini Project 2 → Final Year) go through the same struggle

**ReportCraft exists to eliminate this friction completely.**

---

## 💡 Our Solution

ReportCraft is a **college-internal web tool** (not commercial, no ads, no payments) that:

1. 📝 Takes your project content through a clean, step-by-step wizard
2. 🎨 Applies your college's formatting template automatically
3. 📦 Generates perfectly formatted `.pptx` presentations and `.docx`/`.pdf` reports
4. 📥 Delivers downloadable files ready for submission — no manual tweaking needed

### 🎭 The Philosophy

> **"You focus on WHAT to say. We'll handle HOW it looks."**

The student types (or pastes) their abstract, problem statement, literature survey, etc. into a friendly form. ReportCraft handles:
- ✅ Correct fonts and sizes
- ✅ Proper slide layouts
- ✅ Page breaks between report sections
- ✅ Literature survey 4-column tables
- ✅ Image placement and ordering
- ✅ Title slide structure with all student/guide details
- ✅ Fixed section order (bonafide → acknowledgement → abstract → …)

---

## ✨ Features Built So Far

### 📊 PPT Generation (Primary Feature — Complete)

| Feature | Description |
|---------|-------------|
| 🎓 **Multi-Year Support** | STEM (1st year), Mini Project 1 (2nd year), Mini Project 2 (3rd year), Final Year Project (4th year) |
| 🔄 **All 6 Review Types** | Review 0, Review 1, Review 2, Review 3, Review 4, and Final Review — each with the correct slide count |
| 📋 **Step-by-Step Wizard** | 6 clean steps: Project Year → Review Type → Title Slide → Sections → Output Images → Review & Generate |
| ✏️ **Inline Section Title Editing** | Click the pencil icon to rename any section (e.g., "Proposed System" → "Methodology") |
| ➕ **Custom Sections** | Add your own sections beyond the predefined ones — fully deletable |
| 🔀 **Section Enable/Disable Toggle** | Skip any predefined section from the final PPT with one click |
| 📎 **Per-Section Image Uploads** | Attach up to 3 images per section with optional figure captions |
| 🖼️ **Image Reordering** | Drag-and-drop reorder images within a section |
| 🔢 **Smart Bullet Formatting** | Per-section checkbox to render content as bullet points (auto-strips `-`, `•`, `1.` markers) |
| 📝 **Post-Generation Editing** | Edit content after generating and re-download without re-filling the form |
| 💾 **Carry-Forward** | Auto-saves progress to localStorage — close the tab, come back later |
| ⬇️ **Direct Download** | Generated `.pptx` downloads immediately — open in PowerPoint, ready to submit |

### 🎨 UI / UX

- 🌌 Glass morphism design with animated gradient orbs
- 🎭 Smooth micro-animations on every interaction
- 📱 Responsive layout that works on tablets too
- 🌓 Clean, focused, distraction-free wizard experience
- ⚡ Fast — generation happens in under 3 seconds

---

## 🗺️ Roadmap — What's Coming Next

### 🚧 In Progress / Planned

| Phase | Feature | Status |
|-------|---------|--------|
| 📄 **Phase 3** | **Report (DOCX) Generation** — 35–55 page project reports with all required sections (title page, bonafide, acknowledgement, abstract, list of figures, table of contents, chapters) | 🔨 In Progress |
| 📑 **Phase 4** | **PDF Conversion** — via LibreOffice headless (not browser print, not jsPDF) + **ZIP bundle** download | 📋 Planned |
| 👁️ **Phase 5** | **Live Preview** — HTML preview of generated report/PPT before downloading (via mammoth) | 📋 Planned |
| 🔗 **Phase 6** | **Full Frontend-Backend Integration** — replace all mock API calls with real endpoints | 📋 Planned |
| 📤 **Phase 7** | **Extract & Pre-fill** — upload an old `.pptx` or `.docx` and auto-fill the wizard with extracted text | 📋 Planned |
| 🖼️ **Image Processing** | Auto-resize large images (>1920px) before placement | 🔨 In Progress |
| 🧪 **Testing Suite** | pytest tests for all generators and routers | 📋 Planned |
| 🐳 **Docker Support** | One-command `docker-compose up` setup | 📋 Planned |

### ❌ Not Planned (Hard Boundaries)

- No user accounts or authentication (internal college tool — keep it simple)
- No database (files stored temporarily by UUID, auto-cleaned)
- No cloud sync or real-time collaboration
- No AI content generation (this is a formatting tool, not a content tool)
- No payments or ads

---

## 🛠️ Tech Stack

### 🎨 Frontend

| Tech | Purpose |
|------|---------|
| ⚛️ **TanStack Start** | File-based routing framework (runs on vinxi) |
| 📘 **TypeScript** | Type-safe component code (`.tsx` files throughout) |
| 🎨 **Tailwind CSS** | Utility-first styling |
| 💎 **Glass Morphism CSS** | Custom design system with blur, borders, animations |
| 🔄 **useState** | Local component state (no Redux/Zustand needed) |
| 🖱️ **Native HTML5 Drag & Drop** | Image reordering (no extra dependencies) |
| 🌐 **Axios** | All HTTP calls routed through `apiClient.ts` |
| 🖼️ **Lucide React** | Beautiful icon set |
| 🔤 **Inter (Google Fonts)** | Primary typeface |

### ⚙️ Backend

| Tech | Purpose |
|------|---------|
| 🐍 **Python 3.11+** | Runtime language |
| ⚡ **FastAPI** | Modern async web framework |
| 🚀 **Uvicorn** | ASGI server |
| 📊 **python-pptx** | PPT generation with template inheritance |
| 📄 **python-docx** | Report (DOCX) generation |
| 🖼️ **Pillow** | Image processing, resizing, validation |
| 👁️ **mammoth** | DOCX → HTML conversion for preview |
| 📤 **python-multipart** | File upload handling |
| 📦 **zipfile** (built-in) | ZIP bundle creation |
| 📝 **LibreOffice headless** | PDF conversion (server-side only) |
| 🪵 **python-dotenv** | Environment variables |

### 🧰 Dev / Deployment

| Tech | Purpose |
|------|---------|
| 🐳 **Docker** | Containerization (planned) |
| 🧪 **pytest** | Backend testing |
| 📝 **SKILL.md** | Single source of truth for AI agents working on the project |

---

## 🧩 Project Architecture

### 🏗️ System Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                                │
│                                                                       │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │  TanStack Start Frontend (http://localhost:3000)             │   │
│   │                                                               │   │
│   │  /              → Landing Page                               │   │
│   │  /generate      → Feature Hub (PPT or Report choice)         │   │
│   │  /generate/ppt  → 6-step PPT Wizard ← CURRENT FOCUS          │   │
│   │  /generate/report → 8-step Report Wizard (coming soon)        │   │
│   │  /about         → About Page                                  │   │
│   │                                                               │   │
│   │  State: useState in components                                │   │
│   │  HTTP:  src/api/apiClient.ts (all Axios calls here)           │   │
│   └──────────────────────────────┬──────────────────────────────┘   │
└──────────────────────────────────┼────────────────────────────────────┘
                                   │ multipart/form-data
                                   ▼
┌──────────────────────────────────────────────────────────────────────┐
│                  FastAPI Backend (http://localhost:8000)              │
│                                                                       │
│   ┌─────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│   │   Routers   │→ │  Generators  │→ │      Outputs/            │  │
│   │             │  │              │  │   (temp .pptx files)     │  │
│   │ /generate   │  │ ppt_gen.py   │  └──────────────────────────┘  │
│   │ /convert    │  │ slide_build  │                                  │
│   │ /download   │  │ report_gen   │  ┌──────────────────────────┐  │
│   │ /upload     │  │ section_build│  │      Uploads/            │  │
│   │ /preview    │  └──────────────┘  │   (temp user images)     │  │
│   └─────────────┘                     └──────────────────────────┘  │
│                                                                       │
│   ┌───────────────────────────────────────────────────────────────┐ │
│   │                    Templates/                                   │ │
│   │  ppt/college_template.pptx   (manual PowerPoint template)    │ │
│   │  report/college_template.docx (manual Word template)          │ │
│   └───────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

### 🔄 Data Flow (PPT Generation)

```
User fills wizard  →  apiClient.ts builds FormData
                          │
                          ▼
                   POST /api/generate/ppt
                          │
                          ▼
                  FastAPI parses form, validates
                  Pydantic schemas (PPTRequest)
                          │
                          ▼
                  save_uploaded_images() → uploads/{session_id}/
                          │
                          ▼
                  generate_ppt(data, images, section_image_map)
                          │
                          ▼
                  python-pptx opens college_template.pptx
                          │
                          ▼
                  For each enabled section:
                    → build_dynamic_slide()
                    → Place text (paragraph OR bullets)
                    → Place images
                    → Apply styles from template
                          │
                          ▼
                  Save to outputs/{file_id}.pptx
                          │
                          ▼
                  Return { file_id, filename, created_at }
                          │
                          ▼
                  Frontend triggers GET /api/download/{file_id}
                          │
                          ▼
                  FileResponse streams .pptx to browser
                          │
                          ▼
                  📥 User downloads → Opens in PowerPoint → Submits!
```

---

## 📂 Folder Structure

```
reportcraft/
├── SKILL.md                      ← AI agent instruction file (READ FIRST)
├── README.md                     ← You are here
├── .gitignore
├── .env.example
│
├── frontend/                     ← TanStack Start app
│   ├── package.json
│   ├── app.config.ts
│   ├── routes/
│   │   ├── index.tsx             ← / landing
│   │   ├── generate.tsx          ← /generate hub
│   │   ├── generate_.ppt.tsx     ← /generate/ppt wizard
│   │   ├── generate_.report.tsx  ← /generate/report wizard
│   │   └── about.tsx             ← /about
│   └── src/
│       ├── api/apiClient.ts      ← All backend calls here only
│       ├── components/rc/        ← ReportCraft components
│       │   ├── SectionCard.tsx
│       │   ├── EditableSectionTitle.tsx
│       │   ├── SectionImageUploader.tsx
│       │   ├── AddCustomSectionButton.tsx
│       │   ├── WizardShell.tsx
│       │   ├── Nav.tsx
│       │   └── Orbs.tsx
│       ├── constants/
│       └── styles.css            ← Glass morphism + animations
│
└── backend/
    ├── main.py                   ← FastAPI entry point
    ├── requirements.txt
    ├── routers/
    │   ├── generate.py           ← POST /api/generate/ppt & /report
    │   ├── convert.py            ← POST /api/convert/pdf + /download + /bundle
    │   ├── upload.py             ← POST /api/upload/images
    │   └── preview.py            ← POST /api/preview/report & /ppt
    ├── generators/
    │   ├── ppt_generator.py      ← Main PPT orchestration
    │   ├── slide_builder.py      ← Per-slide builder functions
    │   ├── report_generator.py   ← Main report orchestration (coming)
    │   └── section_builder.py    ← Per-section builders (coming)
    ├── utils/
    │   ├── image_processor.py    ← Save, sort, resize, validate images
    │   ├── file_manager.py       ← UUID gen, paths, cleanup
    │   ├── text_formatter.py     ← Bullet point extraction
    │   ├── style_applier.py      ← Apply fonts/styles to PPT/DOCX
    │   └── logger.py             ← Structured logging
    ├── models/
    │   └── schemas.py            ← Pydantic request/response models
    ├── templates/
    │   ├── ppt/college_template.pptx
    │   └── report/college_template.docx
    ├── uploads/                  ← Temp, auto-cleaned
    └── outputs/                  ← Temp, auto-cleaned
```

---

## 🧭 My Approach — How I'm Building This

I'm building ReportCraft in **strict phases**, where each phase must pass its test criteria before moving to the next. This prevents feature creep and keeps the project shippable at every stage.

### 📍 Phase 1 — Prove the Concept ✅ (DONE)
> "Can I generate ONE correct Review 1 PPT from form data?"

Built the minimum: schemas → one slide builder per slide type → one route → download endpoint.  
**Result:** A working end-to-end pipeline. Confirmed the approach works.

### 📍 Phase 2 — All Review Types + Image Handling ✅ (DONE)
> "Can all 6 review types generate correct slides with images?"

Expanded to handle Review 0 through Final, added image upload/sort/resize.  
**Result:** Students can now generate any review type with images in correct order.

### 📍 Phase 3 — Report (DOCX) Generation 🔨 (IN PROGRESS)
> "Can I generate a complete 35+ page report with all sections in the right order?"

This is the current focus. The report has a **fixed section order** (title page → bonafide → acknowledgement → abstract → LOF → TOC → chapters). Each section starts on a new page. Literature survey is a 4-column table.

### 📍 Phase 4 — PDF Conversion + ZIP Bundle 📋 (PLANNED)
> "Can students download both .pptx and .docx as .pdf, bundled together?"

Uses LibreOffice headless (the ONLY acceptable PDF method — no jsPDF, no browser print). ZIP bundle uses Python's built-in `zipfile` module.

### 📍 Phase 5 — Live Preview 📋 (PLANNED)
> "Can students see an HTML preview before downloading?"

Uses `mammoth` to convert DOCX to HTML. PPT preview extracts slide titles + summaries.

### 📍 Phase 6 — Full Frontend-Backend Integration 📋 (PLANNED)
> "Replace every mock in apiClient.ts with a real API call."

One file change, but requires the backend to be rock solid first.

### 📍 Phase 7 — Extract from Uploaded Files 📋 (PLANNED, OPTIONAL)
> "Can students upload an old .pptx and have the wizard pre-filled?"

Nice-to-have. Uses python-pptx + python-docx to read uploaded files and extract text.

---

## 🚀 Getting Started

### 📋 Prerequisites

Before you start, make sure you have:

| Requirement | Version | Check with |
|-------------|---------|-----------|
| Node.js | 18+ | `node --version` |
| Python | 3.11+ | `python --version` |
| npm | Latest | `npm --version` |
| pip | Latest | `pip --version` |
| LibreOffice | 7.x+ | `libreoffice --version` (required for PDF conversion) |
| Git | Latest | `git --version` |

### 📥 Installation from the Repo ZIP

#### Step 1 — Unzip the project

```bash
unzip reportcraft.zip
cd reportcraft
```

#### Step 2 — Frontend setup

```bash
cd frontend
npm install

# Create environment file
cp .env.example .env
# Edit .env and set: VITE_API_BASE_URL=http://localhost:8000
```

#### Step 3 — Backend setup

```bash
cd ../backend

# Create Python virtual environment
python -m venv venv

# Activate it
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
# Edit .env with:
#   UPLOAD_DIR=./uploads
#   OUTPUT_DIR=./outputs
#   MAX_IMAGE_MB=10
#   FILE_EXPIRY_MINUTES=60
#   FRONTEND_ORIGIN=http://localhost:3000
#   LOG_LEVEL=INFO
```

#### Step 4 — Install LibreOffice (for PDF conversion)

```bash
# Ubuntu / Debian / WSL
sudo apt-get update
sudo apt-get install -y libreoffice --no-install-recommends

# macOS (via Homebrew)
brew install --cask libreoffice

# Verify installation
libreoffice --version
```

#### Step 5 — Create the template files (IMPORTANT!)

You need to **manually create** two template files:

1. **`backend/templates/ppt/college_template.pptx`**
   - Open PowerPoint → Design → Slide Size → Widescreen 16:9
   - View → Slide Master → insert your college logo + colors
   - Create 3 layouts: Title, Content (title+body), Image (title+placeholders)
   - Save as `college_template.pptx`

2. **`backend/templates/report/college_template.docx`**
   - Open Word → Layout → Margins → 1 inch all sides
   - Set styles: Normal (Times New Roman 12pt, 1.5 spacing), Heading 1 (14pt Bold)
   - Add college name header, page number footer
   - Delete all body content (keep header/footer only)
   - Save as `college_template.docx`

### ▶️ Running the Project

Open **two terminals**:

**Terminal 1 — Backend**
```bash
cd backend
source venv/bin/activate   # or venv\Scripts\activate on Windows
uvicorn main:app --reload --port 8000
```
Backend running at → **http://localhost:8000**

**Terminal 2 — Frontend**
```bash
cd frontend
npm run dev
```
Frontend running at → **http://localhost:3000**

### ✅ Verify Everything Works

```bash
# Health check
curl http://localhost:8000/health
# → {"status":"ok"}

# Python imports
python -c "import pptx, docx, mammoth; print('All imports OK')"
```

### 🧪 Testing the Flow

1. Open `http://localhost:3000` in your browser
2. Click **Generate PPT**
3. Select your project year (e.g., Mini Project 1)
4. Select review type (e.g., Review 1)
5. Fill in title slide details (project name, students, guide info)
6. Fill content for Abstract, Problem Statement, etc.
7. (Optional) Attach images to any section
8. (Optional) Check "Format as bullet points" on any section
9. Click **Generate Now**
10. Download your `.pptx` → Open in PowerPoint → 🎉

---

## 🌐 API Endpoints

### PPT Generation
```
POST /api/generate/ppt        → Generate PPT from form data + images
GET  /api/download/{file_id}  → Download generated file (.pptx/.docx/.pdf)
GET  /api/bundle/{file_id}    → Download ZIP bundle of all formats
```

### Report Generation (Coming Soon)
```
POST /api/generate/report     → Generate DOCX report from form data + images
```

### Utilities
```
POST /api/upload/images       → Upload and sort images
POST /api/convert/pdf         → Convert .pptx/.docx to PDF
POST /api/preview/report      → Get HTML preview of report
POST /api/preview/ppt         → Get slide summaries
POST /api/extract/ppt         → Extract text from uploaded PPT (Phase 7)
POST /api/extract/report      → Extract text from uploaded DOCX (Phase 7)
GET  /health                  → Health check
```

---

## 🤝 Contributing

This is a **college-internal project** with a fixed feature set, but suggestions are welcome!

### How to suggest changes

1. Read `SKILL.md` first — it's the single source of truth
2. Check the [Roadmap](#️-roadmap--whats-coming-next) to see if your idea is already planned
3. Open a GitHub Issue describing your idea
4. Wait for discussion before coding

### Hard boundaries (please respect these)

- ❌ No user authentication
- ❌ No database
- ❌ No AI content generation
- ❌ No new npm/pip packages without discussion
- ❌ No hardcoded fonts/colors in generators (use templates)
- ❌ No `print()` in backend — use `logger` only
- ❌ PDF must use LibreOffice headless — no other method accepted

---

## 📜 License

This project is licensed under the **MIT License** — free to use, modify, and distribute for educational purposes.

See the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgements

- 🎨 UI designed with [Lovable AI](https://lovable.dev/) — frontend exported and extended
- 🧠 Architecture guided by the principle of **SKILL.md as single source of truth**
- 📚 Inspired by the countless hours engineering students spend on formatting
- 🏛️ Built for Indian engineering colleges — with love for students who just want to focus on their projects

---

<div align="center">

### 🎓 Built with ❤️ for engineering students who deserve better tools

**Star ⭐ this repo if it helped you!**

</div>
