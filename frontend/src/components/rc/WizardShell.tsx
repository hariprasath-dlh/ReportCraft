import { Link } from "@tanstack/react-router";
import { Check, ArrowLeft } from "lucide-react";
import { Orbs } from "./Orbs";

export type Step = { id: number; name: string; skipped?: boolean };

export function WizardShell({
  title,
  steps,
  current,
  goTo,
  children,
}: {
  title: string;
  steps: Step[];
  current: number;
  goTo: (id: number) => void;
  children: React.ReactNode;
}) {
  const visible = steps.filter((s) => !s.skipped);
  const completed = visible.filter((s) => s.id < current).length;
  const progress = Math.round((completed / visible.length) * 100);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Orbs subtle />
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 md:flex-row md:px-6 md:py-8">
        {/* Sidebar (desktop) */}
        <aside className="glass hidden md:block md:w-[260px] md:shrink-0 self-start p-6 sticky top-6">
          <Link to="/generate" className="mb-6 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <div className="label-caps mb-2">Wizard</div>
          <h2 className="text-xl font-bold mb-5">{title}</h2>
          <ol className="space-y-3">
            {steps.map((s) => {
              const done = s.id < current;
              const active = s.id === current;
              return (
                <li key={s.id}>
                  <button
                    onClick={() => (done || active) && goTo(s.id)}
                    disabled={s.skipped}
                    className={`flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition ${
                      active ? "bg-white/10" : "hover:bg-white/5"
                    } ${s.skipped ? "opacity-30" : ""}`}
                  >
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-semibold transition ${
                        active
                          ? "text-white"
                          : done
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40"
                          : "border border-white/15 text-white/50"
                      }`}
                      style={active ? { background: "var(--grad-vc)", boxShadow: "0 0 0 4px rgba(139,92,246,0.18)" } : {}}
                    >
                      {done ? <Check className="h-4 w-4 animate-spring" /> : s.id}
                    </span>
                    <span className={`text-sm ${active ? "font-semibold text-white" : "text-white/70"}`}>{s.name}</span>
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="mt-8">
            <div className="mb-2 flex justify-between text-xs text-white/50">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, background: "var(--grad-vc)" }}
              />
            </div>
            <p className="mt-3 text-[11px] text-white/40">Your progress is auto-saved</p>
          </div>
        </aside>

        {/* Mobile step indicator */}
        <div className="md:hidden glass p-4 flex gap-2 overflow-x-auto scrollbar-thin">
          {steps.map((s) => {
            const done = s.id < current;
            const active = s.id === current;
            return (
              <button
                key={s.id}
                onClick={() => (done || active) && goTo(s.id)}
                disabled={s.skipped}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium border transition ${
                  active ? "text-white border-transparent" : done ? "text-emerald-300 border-emerald-400/30" : "text-white/50 border-white/10"
                } ${s.skipped ? "opacity-30" : ""}`}
                style={active ? { background: "var(--grad-vc)" } : {}}
              >
                {s.id}. {s.name}
              </button>
            );
          })}
        </div>

        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}

export function StepNav({
  onBack,
  onNext,
  nextDisabled,
  nextLabel = "Next Step",
  nextTooltip,
  finalStep,
}: {
  onBack?: () => void;
  onNext?: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  nextTooltip?: string;
  finalStep?: boolean;
}) {
  return (
    <div className="mt-8 flex items-center justify-between">
      {onBack ? (
        <button onClick={onBack} className="btn-glass">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
      ) : <span />}
      {onNext && !finalStep && (
        <div className="relative group">
          <button onClick={onNext} disabled={nextDisabled} className="btn-primary">
            {nextLabel} →
          </button>
          {nextDisabled && nextTooltip && (
            <div className="pointer-events-none absolute -top-10 right-0 whitespace-nowrap rounded-lg bg-black/80 px-3 py-1.5 text-xs text-white opacity-0 transition group-hover:opacity-100">
              {nextTooltip}
            </div>
          )}
        </div>
      )}
    </div>
  );
}