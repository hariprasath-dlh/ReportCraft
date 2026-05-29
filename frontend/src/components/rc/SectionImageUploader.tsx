import { useState, useRef, useEffect } from "react";
import { Upload, X, GripVertical, Paperclip } from "lucide-react";
import type { SectionImage } from "@/routes/generate_.ppt";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_IMAGES = 3;

interface SectionImageUploaderProps {
  sectionKey: string;
  images: SectionImage[];
  onAddImage: (file: File) => void;
  onRemoveImage: (imageId: string) => void;
  onUpdateCaption: (imageId: string, caption: string) => void;
  onReorder: (newOrder: SectionImage[]) => void;
}

export function SectionImageUploader({
  sectionKey,
  images,
  onAddImage,
  onRemoveImage,
  onUpdateCaption,
  onReorder,
}: SectionImageUploaderProps) {
  const [expanded, setExpanded] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        try { URL.revokeObjectURL(img.previewUrl); } catch {}
      });
    };
  }, []); // eslint-disable-line

  const processFiles = (files: FileList | null) => {
    if (!files) return;
    setFileError(null);
    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) return;

    let addedCount = 0;
    for (let i = 0; i < files.length && addedCount < remaining; i++) {
      const file = files[i];
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setFileError("Only image files are accepted (JPG, PNG, WEBP, GIF)");
        continue;
      }
      onAddImage(file);
      addedCount++;
    }
  };

  const handleReorder = (from: number, to: number) => {
    if (from === to) return;
    const arr = [...images];
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
    onReorder(arr);
  };

  return (
    <div className="mt-3 border-t border-white/8 pt-3">
      {/* Collapse toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="inline-flex items-center gap-1.5 text-xs text-white/45 hover:text-white/70 transition py-1"
      >
        <Paperclip className="h-3.5 w-3.5" />
        Attach Images to this Slide (optional)
        {images.length > 0 && (
          <span className="ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium bg-violet-500/20 text-violet-300 border border-violet-400/30">
            {images.length}/{MAX_IMAGES}
          </span>
        )}
      </button>

      {/* Expandable area with smooth transition */}
      <div
        className="image-upload-expand"
        style={{
          maxHeight: expanded ? "500px" : "0px",
          opacity: expanded ? 1 : 0,
        }}
      >
        <div className="pt-3 space-y-3">
          {/* Drop zone */}
          {images.length < MAX_IMAGES ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                processFiles(e.dataTransfer.files);
              }}
              onClick={() => inputRef.current?.click()}
              className={`cursor-pointer rounded-xl p-6 text-center transition-all border border-dashed ${
                dragOver
                  ? "border-violet-400/60 bg-violet-500/10"
                  : "border-white/15 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]"
              }`}
            >
              <Upload className="mx-auto h-6 w-6 text-white/30 mb-1.5" />
              <div className="text-xs text-white/50">Drop images here or click to browse</div>
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                className="hidden"
                onChange={(e) => {
                  processFiles(e.target.files);
                  e.target.value = "";
                }}
              />
            </div>
          ) : (
            <div className="rounded-xl border border-amber-400/20 bg-amber-500/5 px-4 py-3 text-xs text-amber-300/80 text-center">
              Maximum {MAX_IMAGES} images per section reached
            </div>
          )}

          {/* File error */}
          {fileError && (
            <div className="text-xs text-rose-300 bg-rose-500/10 border border-rose-400/20 rounded-lg px-3 py-2">
              {fileError}
            </div>
          )}

          {/* Thumbnails */}
          {images.length > 0 && (
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin">
              {images.map((img, i) => (
                <div
                  key={img.id}
                  draggable
                  onDragStart={() => setDragIdx(i)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (dragIdx !== null && dragIdx !== i) handleReorder(dragIdx, i);
                    setDragIdx(null);
                  }}
                  className="shrink-0 relative group/thumb rounded-xl border border-white/10 bg-white/[0.03] p-2 transition hover:border-white/20"
                  style={{ width: "110px" }}
                >
                  {/* Remove button */}
                  <button
                    onClick={() => onRemoveImage(img.id)}
                    className="absolute -right-1.5 -top-1.5 z-10 grid h-5 w-5 place-items-center rounded-full bg-black/70 text-white/60 opacity-0 group-hover/thumb:opacity-100 hover:bg-rose-500 hover:text-white transition-all"
                  >
                    <X className="h-3 w-3" />
                  </button>

                  {/* Thumbnail */}
                  <div className="w-20 h-20 mx-auto rounded-lg overflow-hidden bg-white/5">
                    <img
                      src={img.previewUrl}
                      alt={img.caption || "Section image"}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Caption */}
                  <input
                    className="mt-1.5 w-full bg-transparent text-[10px] text-white/60 border-b border-white/10 pb-0.5 focus:outline-none focus:text-white focus:border-violet-400/40 placeholder:text-white/30"
                    placeholder="Caption (optional)"
                    value={img.caption}
                    onChange={(e) => onUpdateCaption(img.id, e.target.value)}
                  />

                  {/* Drag handle */}
                  <div className="mt-1 flex items-center justify-center gap-0.5 text-[9px] text-white/25">
                    <GripVertical className="h-2.5 w-2.5" /> drag
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
