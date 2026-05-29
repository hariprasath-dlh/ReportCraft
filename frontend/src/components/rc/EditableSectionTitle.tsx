import { useState, useRef, useEffect } from "react";
import { Pencil, Check, X } from "lucide-react";

interface EditableSectionTitleProps {
  title: string;
  isPredefined: boolean;
  startInEditMode?: boolean;
  onSave: (newTitle: string) => void;
}

export function EditableSectionTitle({
  title,
  isPredefined,
  startInEditMode = false,
  onSave,
}: EditableSectionTitleProps) {
  const [editing, setEditing] = useState(startInEditMode);
  const [draft, setDraft] = useState(title);
  const [shakeError, setShakeError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  // Sync draft when title prop changes externally
  useEffect(() => {
    if (!editing) setDraft(title);
  }, [title, editing]);

  const save = () => {
    const trimmed = draft.trim();
    if (!trimmed) {
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
      return;
    }
    onSave(trimmed);
    setEditing(false);
  };

  const cancel = () => {
    setDraft(title);
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      save();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancel();
    }
  };

  if (editing) {
    return (
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <input
          ref={inputRef}
          type="text"
          className={`input-field text-lg font-semibold flex-1 min-w-0 py-1.5 ${shakeError ? "shake-error" : ""}`}
          style={shakeError ? { borderColor: "rgba(244,63,94,0.7)", boxShadow: "0 0 0 3px rgba(244,63,94,0.2)" } : {}}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter section title..."
        />
        <button
          onClick={save}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-500/30 transition"
          title="Save title"
        >
          <Check className="h-4 w-4" />
        </button>
        <button
          onClick={cancel}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 transition"
          title="Cancel"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      className="group/title flex items-center gap-2 cursor-pointer min-w-0 flex-1"
      onDoubleClick={() => setEditing(true)}
    >
      <h3 className="font-semibold text-lg truncate">{title || "Untitled Section"}</h3>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setEditing(true);
        }}
        className="shrink-0 opacity-0 group-hover/title:opacity-100 transition-opacity duration-200 grid h-7 w-7 place-items-center rounded-lg text-white/40 hover:text-violet-300 hover:bg-white/10"
        title="Edit title"
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
