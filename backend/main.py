"""
ReportCraft Backend — FastAPI Application Entry Point.
Run: uvicorn main:app --reload --port 8000
"""

import os
from pathlib import Path

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routers import generate, convert, preview, upload, extract
from utils.logger import logger

# Load environment variables
load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create required directories on startup."""
    upload_dir = Path(os.getenv("UPLOAD_DIR", "uploads"))
    output_dir = Path(os.getenv("OUTPUT_DIR", "outputs"))
    upload_dir.mkdir(parents=True, exist_ok=True)
    output_dir.mkdir(parents=True, exist_ok=True)
    # Ensure template dir exists
    Path("templates/ppt").mkdir(parents=True, exist_ok=True)
    Path("templates/report").mkdir(parents=True, exist_ok=True)
    logger.info("ReportCraft API started successfully")
    logger.info(f"Upload dir: {upload_dir.resolve()}")
    logger.info(f"Output dir: {output_dir.resolve()}")
    yield

# Create app
app = FastAPI(
    title="ReportCraft API",
    description="College Report & PPT Generator API",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS setup — allow frontend origins
frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")
origins = [
    frontend_origin,
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:8080",
    "http://localhost:4321",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:8080",
    "http://127.0.0.1:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(generate.router, prefix="/api/generate", tags=["Generate"])
app.include_router(convert.router, prefix="/api", tags=["Convert"])
app.include_router(preview.router, prefix="/api/preview", tags=["Preview"])
app.include_router(upload.router, prefix="/api/upload", tags=["Upload"])
app.include_router(extract.router, prefix="/api/extract", tags=["Extract"])


# Lifespan managed startup above


@app.get("/")
async def root():
    return {"message": "ReportCraft API is running", "docs": "/docs"}


@app.get("/health")
async def health_check():
    return {"status": "ok"}
