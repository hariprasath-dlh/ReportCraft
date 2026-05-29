import { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";

export function CarryForwardBanner({
  storageKey,
  contextLabel,
  onApply,
  onDismiss,
}: {
  storageKey: string | null;
  contextLabel: string;
  onApply: (data: any) => void;
  onDismiss?: () => void;
}) {
  const [data, setData] = useState<any>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!storageKey) return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setData(JSON.parse(raw));
    } catch {}
  }, [storageKey]);

  if (!data || dismissed) return null;

  return (
    <div className="glass glass-amber p-4 md:p-5 animate-fade-up" style={{ borderLeft: "3px solid #f59e0b" }}>
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-400/20">
            <Sparkles className="h-4 w-4 text-amber-300" />
          </div>
          <div>
            <div className="font-semibold">Previous session found</div>
            <div className="text-sm text-white/70">
              We found your <b className="text-amber-200">{contextLabel}</b> data. Load it to skip re-entering shared content.
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => { onApply(data); setDismissed(true); }}
            className="rounded-full px-4 py-2 text-sm font-semibold text-white transition hover:scale-[1.03]"
            style={{ background: "var(--grad-vc)" }}
          >
            Load Previous Data
          </button>
          <button
            onClick={() => { setDismissed(true); onDismiss?.(); }}
            className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition inline-flex items-center gap-1"
          >
            <X className="h-3.5 w-3.5" /> Start Fresh
          </button>
        </div>
      </div>
    </div>
  );
}