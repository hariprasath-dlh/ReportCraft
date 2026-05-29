# ReportCraft

> 🎓 College Report & Presentation Generator — Automated PPT and Report creation for academic projects.

ReportCraft is a full-stack web application that helps students generate professional PowerPoint presentations and Word reports for their college project reviews. Just fill in your project details, upload images, and download polished documents instantly.

---

## ✨ Features

- **PPT Generator** — 6-step wizard to create review-specific presentations
- **Report Generator** — 8-step wizard to create complete project reports
- **Multiple Review Types** — Review 0 through Final Review, each with appropriate sections
- **Image Upload & Reorder** — Drag-and-drop image management with automatic ordering
- **Live Preview** — See your document before downloading
- **PDF Conversion** — Convert generated PPTX/DOCX to PDF via LibreOffice
- **Beautiful UI** — Glassmorphism design with smooth animations

---

## 🏗️ Project Structure

```
reportcraft/
├── frontend/          ← React + Vite + Tailwind CSS
├── backend/           ← FastAPI + python-pptx + python-docx
├── docker-compose.yml ← Run everything together
└── README.md          ← You are here
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **Python** ≥ 3.11
- **LibreOffice** (for PDF conversion)

### 1. Clone & Setup

```bash
git clone https://github.com/yourusername/reportcraft.git
cd reportcraft
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp ../.env.example .env   # Edit with your values
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 4. Template Setup

- Place `college_template.pptx` in `backend/templates/ppt/`
- Place `college_template.docx` in `backend/templates/report/`
- See `backend/docs/TEMPLATE_SETUP.md` for detailed instructions.

---

## 🐳 Docker (Optional)

```bash
docker-compose up --build
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:8000`
API Docs: `http://localhost:8000/docs`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/generate/ppt` | Generate PowerPoint |
| POST | `/api/generate/report` | Generate Word Report |
| POST | `/api/convert/pdf` | Convert to PDF |
| GET | `/api/download/{file_id}` | Download generated file |
| POST | `/api/preview/report` | Preview report as HTML |
| POST | `/api/preview/ppt` | Preview PPT slides |
| POST | `/api/upload/images` | Upload images |
| POST | `/api/extract/ppt` | Extract from PPT (Phase 6) |
| POST | `/api/extract/report` | Extract from Report (Phase 6) |

Full docs: `backend/docs/API_REFERENCE.md`

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Tailwind CSS, Zustand, dnd-kit |
| Backend | FastAPI, python-pptx, python-docx, Pillow |
| PDF | LibreOffice (headless subprocess) |
| Icons | Lucide React |

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.
