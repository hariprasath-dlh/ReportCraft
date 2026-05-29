# ReportCraft API Reference

All endpoints use the base URL: `http://localhost:8000`

---

## Generate

### POST /api/generate/ppt
Generate a PowerPoint presentation.

**Request Body:**
```json
{
  "project_type": "main_project",
  "review_type": "review_0",
  "title_slide": {
    "project_title": "My Project",
    "course_code": "CS3401",
    "department": "Computer Science and Engineering",
    "guide_name": "Dr. Smith",
    "guide_designation": "Associate Professor",
    "students": [
      { "name": "Student 1", "reg_no": "21CS001" }
    ]
  },
  "sections": {
    "abstract": "Project abstract...",
    "problem_statement": "Problem...",
    "existing_system": "Existing...",
    "proposed_system": "Proposed..."
  },
  "literature_entries": [
    { "sno": 1, "title": "Paper", "author": "Author", "year": "2024", "summary": "..." }
  ],
  "style_instructions": {
    "font_family": "Calibri",
    "font_size": "14",
    "title_color": "#1a1a2e",
    "line_spacing": "1.5"
  }
}
```

**Response:**
```json
{ "file_id": "uuid-string", "format": "pptx", "message": "PPT generated successfully" }
```

**curl:**
```bash
curl -X POST http://localhost:8000/api/generate/ppt \
  -H "Content-Type: application/json" \
  -d '{"project_type":"main_project","review_type":"review_0","title_slide":{"project_title":"Test"}}'
```

---

### POST /api/generate/report
Generate a Word report.

**Request Body:** Same structure as PPT + `front_matter`, `chapters` fields.

**Response:**
```json
{ "file_id": "uuid-string", "format": "docx", "message": "Report generated successfully" }
```

---

## Convert

### POST /api/convert/pdf
Convert a generated file to PDF.

**Request Body:**
```json
{ "file_id": "uuid-string" }
```

**Response:**
```json
{ "file_id": "uuid-string", "format": "pdf", "message": "Converted to PDF successfully" }
```

---

### GET /api/download/{file_id}
Download a generated file.

**Response:** Binary file download (PPTX, DOCX, or PDF).

---

## Preview

### POST /api/preview/report
Preview report as HTML.

**Request Body:**
```json
{ "title": "Project Title", "sections": { "abstract": "..." }, "review_type": "" }
```

**Response:**
```json
{ "html": "<h1>...</h1>", "message": "Preview generated" }
```

---

### POST /api/preview/ppt
Preview PPT as slide summaries.

**Response:**
```json
{ "slides": [{ "title": "...", "content": "..." }], "message": "Preview generated" }
```

---

## Upload

### POST /api/upload/images
Upload images for use in generation.

**Request:** `multipart/form-data` with `images` (files) and `session_id` (string).

**Response:**
```json
{ "uploaded": 3, "session_id": "...", "paths": [...], "message": "3 images uploaded successfully" }
```

---

## Extract (Phase 6)

### POST /api/extract/ppt
Extract content from an existing PowerPoint file.

### POST /api/extract/report
Extract content from an existing Word report.
