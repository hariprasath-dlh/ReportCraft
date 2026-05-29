# Template Setup Guide

ReportCraft uses college-specific template files for PPT and Report generation. These must be created manually in PowerPoint and Word.

---

## PowerPoint Template (`college_template.pptx`)

**Location:** `backend/templates/ppt/college_template.pptx`

### Requirements:
1. **Slide Master** — Set up your college branding (logo, colors, fonts)
2. **Layout[0]** — Title Slide layout (title + subtitle placeholders)
3. **Layout[1]** — Content Slide layout (title + body text placeholders)
4. **Layout[2]** — Image Slide layout (title + image/content placeholders)

### Steps to Create:
1. Open PowerPoint
2. Go to **View → Slide Master**
3. Set your college logo in the master slide
4. Define the color scheme to match your college
5. Create at least 3 slide layouts:
   - **Title Slide**: Large title, subtitle area
   - **Content Slide**: Title bar + body text area
   - **Image Slide**: Title bar + image placeholder
6. Save as `.pptx` to `backend/templates/ppt/college_template.pptx`

---

## Word Template (`college_template.docx`)

**Location:** `backend/templates/report/college_template.docx`

### Requirements:
1. **Margins**: 1 inch all sides
2. **Font**: Times New Roman 12pt (body), 14pt bold (headings)
3. **Heading styles**: Heading 1, Heading 2 must be defined
4. **Line spacing**: 1.5
5. **Header**: College name (optional)
6. **Footer**: Page numbers (optional)

### Steps to Create:
1. Open Word
2. Set margins: **Layout → Margins → Normal (1 inch)**
3. Set default font: Times New Roman, 12pt
4. Define heading styles:
   - **Heading 1**: Times New Roman, 14pt, Bold, centered
   - **Heading 2**: Times New Roman, 13pt, Bold
5. Set line spacing: 1.5
6. Add college name to header (optional)
7. Save as `.docx` to `backend/templates/report/college_template.docx`

---

## Testing Templates

After creating templates, test them:

```bash
cd backend
python -c "
from pptx import Presentation
prs = Presentation('templates/ppt/college_template.pptx')
print(f'PPT layouts: {len(prs.slide_layouts)}')
for i, layout in enumerate(prs.slide_layouts):
    print(f'  Layout[{i}]: {layout.name}')
"
```

```bash
python -c "
from docx import Document
doc = Document('templates/report/college_template.docx')
print(f'Styles: {[s.name for s in doc.styles if s.type is not None][:10]}')
"
```
