import { useRef, useEffect } from "react";
import { X, Info } from "lucide-react";
import { EditableSectionTitle } from "./EditableSectionTitle";
import { SectionImageUploader } from "./SectionImageUploader";
import type { PPTSection, SectionImage } from "@/routes/generate_.ppt";

interface SectionCardProps {
  section: PPTSection;
  index: number;
  reviewType: string;
  onTitleChange: (key: string, title: string) => void;
  onContentChange: (key: string, content: string) => void;
  onToggleEnabled: (key: string) => void;
  onRemove: (key: string) => void;
  onAddImage: (key: string, file: File) => void;
  onRemoveImage: (key: string, imageId: string) => void;
  onUpdateCaption: (key: string, imageId: string, caption: string) => void;
  onReorderImages: (key: string, newOrder: SectionImage[]) => void;
  onFormatChange: (key: string, formatAsBullets: boolean) => void;
}

const TONE_COLORS = ["#8b5cf6", "#06b6d4", "#f43f5e", "#f59e0b", "#10b981", "#fa709a"];

export function SectionCard({
  section,
  index,
  reviewType,
  onTitleChange,
  onContentChange,
  onToggleEnabled,
  onRemove,
  onAddImage,
  onRemoveImage,
  onUpdateCaption,
  onReorderImages,
  onFormatChange,
}: SectionCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isLitSurvey = section.key === "literature";
  const isHigherReview = ["r1", "r2", "r3", "r4", "final"].includes(reviewType);
  const showLitWarning = isLitSurvey && isHigherReview && !section.isEnabled;

  // Auto-focus for new custom sections (title starts empty, in edit mode)
  const isNewCustom = !section.isPredefined && !section.title;

  const wordCount = section.content.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div
      ref={cardRef}
      className="glass p-5 animate-fade-up relative transition-opacity duration-200"
      style={{
        animationDelay: `${index * 0.08}s`,
        borderLeft: `3px solid ${TONE_COLORS[index % TONE_COLORS.length]}`,
        opacity: section.isEnabled ? 1 : 0.4,
      }}
    >
      {/* Skipped banner */}
      {!section.isEnabled && (
        <div className="mb-3 flex items-center gap-2 rounded-lg bg-amber-500/10 border border-amber-400/20 px-3 py-2 text-xs text-amber-300/80">
          <span>⊘</span> This slide will be skipped
        </div>
      )}

      {/* Header row: Title + Toggle + Delete */}
      <div className="flex items-center gap-3 mb-2">
        <EditableSectionTitle
          title={section.title}
          isPredefined={section.isPredefined}
          startInEditMode={isNewCustom}
          onSave={(newTitle) => onTitleChange(section.key, newTitle)}
        />

        <div className="flex items-center gap-2 shrink-0">
          {/* Word count */}
          {section.isEnabled && section.words && (
            <div className="text-xs text-white/45 hidden md:block">
              {wordCount} words · {section.words}
            </div>
          )}

          {/* Lit survey warning tooltip */}
          {isLitSurvey && isHigherReview && (
            <div className="relative group/lit">
              <Info className="h-4 w-4 text-amber-400/60 cursor-help" />
              <div className="pointer-events-none absolute -top-12 right-0 whitespace-nowrap rounded-lg bg-black/90 px-3 py-2 text-[11px] text-amber-300 opacity-0 transition group-hover/lit:opacity-100 z-20 border border-amber-400/20">
                Recommended: Keep Literature Survey — required for higher reviews
              </div>
            </div>
          )}

          {/* Enable/Disable toggle */}
          <button
            onClick={() => onToggleEnabled(section.key)}
            className={`relative h-6 w-10 rounded-full transition shrink-0 ${
              section.isEnabled ? "" : "bg-white/15"
            }`}
            style={section.isEnabled ? { background: "var(--grad-vc)" } : {}}
            title={section.isEnabled ? "Exclude from PPT" : "Include in PPT"}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                section.isEnabled ? "left-[18px]" : "left-0.5"
              }`}
            />
          </button>

          {/* Delete button — custom sections only */}
          {!section.isPredefined && (
            <button
              onClick={() => onRemove(section.key)}
              className="grid h-8 w-8 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/60 hover:text-rose-300 hover:border-rose-400/30 transition"
              title="Remove custom section"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Show lit warning when toggled off */}
      {showLitWarning && (
        <div className="mb-2 text-xs text-amber-300/70 flex items-center gap-1.5">
          <Info className="h-3.5 w-3.5" />
          Literature survey is typically required for this review type
        </div>
      )}

      {/* Content textarea */}
      <textarea
        className={`input-field min-h-[120px] resize-y ${
          !section.isEnabled ? "cursor-not-allowed opacity-60" : ""
        }`}
        placeholder={section.hint || "Enter section content..."}
        value={section.content}
        onChange={(e) => onContentChange(section.key, e.target.value)}
        disabled={!section.isEnabled}
      />
      {section.isEnabled && section.hint && (
        <p className="mt-2 text-xs text-white/50">{section.hint}</p>
      )}

      {/* Format option */}
      <div className="flex items-center gap-2 mt-3 px-4 py-2 border-t border-white/10">
        <input
          id={`format-${section.key}`}
          type="checkbox"
          checked={section.formatAsBullets}
          disabled={!section.isEnabled}
          onChange={(e) => onFormatChange(section.key, e.target.checked)}
          className="h-4 w-4 rounded accent-indigo-500 cursor-pointer
                     disabled:opacity-40 disabled:cursor-not-allowed"
        />
        <label
          htmlFor={`format-${section.key}`}
          className={`text-sm select-none cursor-pointer
                     ${!section.isEnabled ? 'opacity-40 cursor-not-allowed' : 'text-white/80'}`}
        >
          Format as bullet points
        </label>
        <span
          className="group relative ml-1 text-white/40 cursor-help text-xs"
          title="Each line in your content will become one bullet point on the slide."
        >
          ⓘ
        </span>
      </div>

      {/* Per-section image uploader — hidden when disabled */}
      {section.isEnabled && (
        <SectionImageUploader
          sectionKey={section.key}
          images={section.images}
          onAddImage={(file) => onAddImage(section.key, file)}
          onRemoveImage={(imgId) => onRemoveImage(section.key, imgId)}
          onUpdateCaption={(imgId, cap) => onUpdateCaption(section.key, imgId, cap)}
          onReorder={(newOrder) => onReorderImages(section.key, newOrder)}
        />
      )}
    </div>
  );
}
