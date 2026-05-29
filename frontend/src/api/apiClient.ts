import axios from "axios";

// When running via Vite dev server, the proxy handles /api -> localhost:8000
// In production, set VITE_API_BASE_URL to the backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
});

// ── PPT Generation ───────────────────────────────────────────────────────
export const generatePPT = async (
  data: any,
  images: File[] = [],
  sectionImages: { key: string; order: number; file: File }[] = []
) => {
  const form = new FormData();
  form.append("data", JSON.stringify(data));
  images.forEach((img) => form.append("images", img, img.name));
  // Append per-section images with naming convention: section_image_{key}_{order}
  sectionImages.forEach((si) => {
    form.append(`section_image_${si.key}_${si.order}`, si.file, si.file.name);
  });
  const res = await api.post("/api/generate/ppt", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// ── Report Generation ────────────────────────────────────────────────────
export const generateReport = async (data: any, images: File[] = []) => {
  const form = new FormData();
  form.append("data", JSON.stringify(data));
  images.forEach((img) => form.append("images", img, img.name));
  const res = await api.post("/api/generate/report", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// ── PDF Conversion ───────────────────────────────────────────────────────
export const convertToPDF = async (fileId: string, fileType: string = "pptx") => {
  const res = await api.post("/api/convert/pdf", { file_id: fileId, file_type: fileType });
  return res.data;
};

// ── File Download ────────────────────────────────────────────────────────
export const downloadFile = async (fileId: string, filename?: string) => {
  const res = await api.get(`/api/download/${fileId}`, { responseType: "blob" });
  const url = URL.createObjectURL(new Blob([res.data]));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || `${fileId}.pptx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// ── Bundle Download ──────────────────────────────────────────────────────
export const downloadBundle = async (fileId: string) => {
  const res = await api.get(`/api/bundle/${fileId}`, { responseType: "blob" });
  const url = URL.createObjectURL(new Blob([res.data]));
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileId}_bundle.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// ── Report Preview ───────────────────────────────────────────────────────
export const previewReport = async (fileId: string) => {
  const res = await api.post("/api/preview/report", { file_id: fileId });
  return res.data;
};

// ── PPT Preview ──────────────────────────────────────────────────────────
export const previewPPT = async (fileId: string) => {
  const res = await api.post("/api/preview/ppt", { file_id: fileId });
  return res.data;
};

// ── Upload Images ────────────────────────────────────────────────────────
export const uploadImages = async (sessionId: string, files: File[]) => {
  const form = new FormData();
  form.append("session_id", sessionId);
  files.forEach((f) => form.append("files", f, f.name));
  const res = await api.post("/api/upload/images", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// ── Extract from PPT ─────────────────────────────────────────────────────
export const extractFromPPT = async (file: File) => {
  const form = new FormData();
  form.append("file", file, file.name);
  const res = await api.post("/api/extract/ppt", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// ── Extract from Report ──────────────────────────────────────────────────
export const extractFromReport = async (file: File) => {
  const form = new FormData();
  form.append("file", file, file.name);
  const res = await api.post("/api/extract/report", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export default api;
