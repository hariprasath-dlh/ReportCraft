# Deployment Guide

## Option 1: Render.com

### Backend (FastAPI)
1. Create a new **Web Service** on Render
2. Connect your GitHub repo
3. Set **Root Directory** to `backend`
4. **Build Command**: `pip install -r requirements.txt`
5. **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables from `.env.example`
7. Note: LibreOffice may need a custom Docker deployment

### Frontend (React)
1. Create a new **Static Site** on Render
2. Connect your GitHub repo
3. Set **Root Directory** to `frontend`
4. **Build Command**: `npm install && npm run build`
5. **Publish Directory**: `dist`
6. Set `VITE_API_BASE_URL` to your backend URL

---

## Option 2: Railway.app

### Backend
1. Create a new project on Railway
2. Deploy from GitHub, set root to `backend`
3. Railway auto-detects Python
4. Add environment variables
5. For LibreOffice, use the Dockerfile: Railway supports Docker deployments

### Frontend
1. Add a new service in the same project
2. Set root to `frontend`
3. Railway auto-detects Node.js

---

## Option 3: Docker (Self-hosted)

```bash
# From the project root
docker-compose up --build -d

# Frontend: http://localhost:5173
# Backend: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

---

## Environment Variables (Production)

| Variable | Description | Example |
|----------|-------------|---------|
| `UPLOAD_DIR` | Temp upload directory | `uploads` |
| `OUTPUT_DIR` | Temp output directory | `outputs` |
| `MAX_IMAGE_MB` | Max image upload size | `10` |
| `FILE_EXPIRY_MINUTES` | Auto-cleanup after N minutes | `60` |
| `FRONTEND_ORIGIN` | CORS allowed origin | `https://your-frontend.com` |

---

## Important Notes

1. **LibreOffice** is required for PDF conversion. Ensure it's installed:
   - Linux: `sudo apt-get install -y libreoffice`
   - macOS: `brew install --cask libreoffice`
   - Docker: Already included in the Dockerfile

2. **Template files** must be uploaded separately — they are not included in the repo

3. **File cleanup**: Set up a cron job or background task to run `cleanup_old_files()` periodically
