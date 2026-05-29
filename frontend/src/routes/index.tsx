import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, ArrowRight, ChevronDown, Layers, LayoutGrid, Eye, FileText, Presentation, Check } from "lucide-react";
import { Nav } from "@/components/rc/Nav";
import { Orbs } from "@/components/rc/Orbs";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ReportCraft — Smart PPT & Report Generator for College" },
      { name: "description", content: "Auto-generate review presentations and project reports in your college template. Built for STEM, Mini Project, and Final Year students." },
      { property: "og:title", content: "ReportCraft — Smart PPT & Report Generator" },
      { property: "og:description", content: "Generate perfectly formatted college review PPTs and reports in seconds." },
    ],
  }),
  component: Home,
});

function useCountUp(target: number, trigger: boolean, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let raf = 0; const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setVal(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [trigger, target, duration]);
  return val;
}

function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.3 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const a = useCountUp(6, visible);
  const b = useCountUp(55, visible);
  const c = useCountUp(4, visible);
  const d = useCountUp(0, visible);
  const stats = [
    { v: a, label: "Review Types", suffix: "" },
    { v: b, label: "Pages auto-formatted", suffix: "", prefix: "35–" },
    { v: c, label: "Project Types", suffix: "" },
    { v: d, label: "Manual Formatting", suffix: "" },
  ];
  return (
    <section ref={ref} className="relative z-10 mx-auto max-w-7xl px-6 -mt-10">
      <div className="glass grid grid-cols-2 gap-6 p-8 md:grid-cols-4">
        {stats.map((s, i) => (
          <div key={i} className="text-center">
            <div className="text-4xl md:text-5xl font-bold gradient-text">{s.prefix || ""}{s.v}</div>
            <div className="mt-2 text-xs label-caps">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeatureCard({ tone, icon, title, desc, tags, badge }: any) {
  return (
    <div className={`glass glass-hover ${tone} p-7 flex flex-col`}>
      <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-white/10">{icon}</div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-white/70 leading-relaxed flex-1">{desc}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {tags.map((t: string) => <span key={t} className="pill">{t}</span>)}
      </div>
      <div className="mt-4 text-[11px] label-caps text-white/40 self-end">{badge}</div>
    </div>
  );
}

const steps = [
  { t: "Select", d: "Choose project type & review number" },
  { t: "Fill", d: "Paste content section by section" },
  { t: "Upload", d: "Add images, name them 01_, 02_" },
  { t: "Style", d: "Set fonts, size, spacing" },
  { t: "Preview", d: "See it before downloading" },
  { t: "Download", d: "Get PPTX, DOCX and PDF" },
];

const reviews = [
  { name: "Review 0", tone: "var(--grad-warm)", slides: ["Title", "Abstract", "Problem statement", "Existing system", "Proposed system"] },
  { name: "Review 1", tone: "var(--grad-vc)", slides: ["Title", "Abstract", "Problem statement", "Lit. survey (5+)", "Existing", "Proposed", "Architecture"] },
  { name: "Review 2", tone: "var(--grad-teal)", slides: ["+ 25% progress", "Module 1 results", "Screenshots"], extra: "25% progress" },
  { name: "Review 3", tone: "var(--grad-mint)", slides: ["+ 50% progress", "Module 2 results", "Testing"], extra: "50% progress" },
  { name: "Review 4", tone: "var(--grad-coral)", slides: ["+ 75% progress", "Integration", "Validation"], extra: "75% progress" },
  { name: "Final Review", tone: "var(--grad-violet-deep)", slides: ["Full demo", "Results", "Conclusion", "Future work"], extra: "100% complete" },
  { name: "Report Defense", tone: "var(--grad-warm)", slides: ["All sections", "Q&A ready"] },
];

function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Orbs />
      <Nav />

      {/* HERO */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-10 pb-32 text-center">
        <div className="inline-flex items-center gap-2 mb-8 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs backdrop-blur-xl animate-fade-up">
          <Sparkles className="h-3.5 w-3.5 text-amber-300" />
          <span className="text-white/80">Built for College Students</span>
          <span className="gradient-text font-semibold">✦</span>
        </div>
        <h1 className="mx-auto max-w-4xl text-5xl md:text-7xl lg:text-[80px] font-extrabold leading-[1.05] animate-fade-up" style={{ animationDelay: "0.05s" }}>
          Generate Perfect Project<br />
          <span className="gradient-text">Presentations</span> &amp; <span className="gradient-text-warm">Reports</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-white/65 leading-relaxed animate-fade-up" style={{ animationDelay: "0.1s" }}>
          Stop wasting hours on formatting. ReportCraft auto-generates your review PPTs and project reports in seconds — exactly in your college template.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: "0.15s" }}>
          <Link to="/generate/ppt" className="btn-primary pulse-glow">Generate PPT <ArrowRight className="h-4 w-4" /></Link>
          <Link to="/generate/report" className="btn-glass">Generate Report <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <p className="mt-8 text-xs text-white/45 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          ✦ Trusted by students preparing STEM · Mini Project · Final Year projects
        </p>
        <div className="mt-16 flex justify-center animate-bounce-down">
          <ChevronDown className="h-6 w-6 text-white/30" />
        </div>
      </section>

      <StatsBar />

      {/* FEATURES */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-32">
        <div className="text-center mb-16">
          <div className="label-caps text-violet-300 mb-3">Features</div>
          <h2 className="text-4xl md:text-5xl font-bold">Everything you need.<br/>Nothing you don't.</h2>
          <p className="mt-4 text-white/60">Three powerful features, one simple workflow.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <FeatureCard
            tone="glass-violet"
            icon={<Layers className="h-7 w-7 text-violet-300" />}
            title="Smart Template Engine"
            desc="Upload your old PPT or Word file. We analyse the format, extract your content, and rebuild it perfectly in your college template — every margin, every heading, every alignment."
            tags={["python-pptx", "python-docx", "Template analysis"]}
            badge="Phase 1 + 6"
          />
          <FeatureCard
            tone="glass-cyan"
            icon={<LayoutGrid className="h-7 w-7 text-cyan-300" />}
            title="Predefined College Templates"
            desc="Review 0, 1, 2, 3, 4, Final Review — all ready. Select your review type, paste your content, and download a perfectly formatted PPT in under 60 seconds."
            tags={["6 Review types", "All project years", "Instant download"]}
            badge="Core Feature"
          />
          <FeatureCard
            tone="glass-rose"
            icon={<Eye className="h-7 w-7 text-rose-300" />}
            title="Preview, Edit & Export"
            desc="See your generated file before downloading. Edit text inline, reorder images with drag and drop, then convert to PDF with one click — no formatting breaks."
            tags={["Live preview", "Drag & drop", "PDF conversion"]}
            badge="Phase 5 + 4"
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-32">
        <div className="text-center mb-20">
          <div className="label-caps text-cyan-300 mb-3">How it works</div>
          <h2 className="text-4xl md:text-5xl font-bold">From content to submission-ready.<br/>In minutes.</h2>
        </div>
        <div className="relative grid gap-8 md:grid-cols-6">
          <div aria-hidden className="absolute left-0 right-0 top-7 hidden md:block">
            <svg className="w-full" height="2"><line x1="0" y1="1" x2="100%" y2="1" stroke="rgba(255,255,255,0.15)" strokeDasharray="6 8" /></svg>
          </div>
          {steps.map((s, i) => (
            <div key={i} className="relative text-center animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full text-lg font-bold relative z-10" style={{ background: "var(--grad-vc)", boxShadow: "0 0 0 6px #0a0a0f" }}>
                {i + 1}
              </div>
              <div className="mt-4 text-sm font-semibold gradient-text">✦ {s.t}</div>
              <p className="mt-1 text-xs text-white/55 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TEMPLATES */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-32">
        <div className="text-center mb-14">
          <div className="label-caps text-amber-300 mb-3">Templates</div>
          <h2 className="text-4xl md:text-5xl font-bold">All your reviews.<br/>All your reports.</h2>
        </div>
        <div className="mb-8 label-caps text-white/50">Presentations</div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin md:grid md:grid-cols-4 md:gap-5 md:overflow-visible">
          {reviews.map((r) => (
            <div key={r.name} className="glass glass-hover w-72 shrink-0 p-5 md:w-auto relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1" style={{ background: r.tone }} />
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold">{r.name}</h3>
                {r.extra && <span className="pill" style={{ background: r.tone, color: "#0a0a0f", borderColor: "transparent", fontWeight: 600 }}>{r.extra}</span>}
              </div>
              <ul className="space-y-1.5 text-xs text-white/65">
                {r.slides.map((sl) => (
                  <li key={sl} className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-white/40" /> {sl}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 label-caps text-white/50">Report</div>
        <div className="glass glass-emerald glass-hover mt-4 p-8 md:flex md:items-center md:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="h-6 w-6 text-emerald-300" />
              <h3 className="text-2xl font-bold">Full Project Report</h3>
              <span className="pill" style={{ background: "rgba(16,185,129,0.25)", borderColor: "transparent" }}>Common for all project years</span>
            </div>
            <ol className="grid gap-1.5 text-sm text-white/75 md:grid-cols-2">
              {["1. Title & Bonafide", "2. Acknowledgement", "3. Abstract", "4. Table of contents", "5. Introduction", "6. Literature survey", "7. Existing system", "8. Proposed system", "9. System architecture", "10. Modules & implementation", "11. Results & discussion", "12. Conclusion & references"].map((s) => (
                <li key={s} className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-emerald-300" /> {s}</li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 py-32 text-center">
        <div className="absolute inset-0 -z-10 mx-auto h-96 w-96 rounded-full blur-[120px] opacity-40" style={{ background: "var(--grad-vc)" }} />
        <h2 className="text-4xl md:text-5xl font-bold">Ready to stop formatting<br/>and start <span className="gradient-text">building</span>?</h2>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/generate/ppt" className="btn-primary"><Presentation className="h-4 w-4" /> Generate PPT Now</Link>
          <Link to="/generate/report" className="btn-glass"><FileText className="h-4 w-4" /> Generate Report Now</Link>
        </div>
        <p className="mt-6 text-xs text-white/45">No account needed. No installation. Works in your browser.</p>
      </section>

      <footer className="relative z-10 border-t border-white/8 px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-white/50 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-lg" style={{ background: "var(--grad-vc)" }}>
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-white">ReportCraft</span>
          </div>
          <div className="text-center text-xs">Built specifically for college students · Not a commercial product</div>
          <nav className="flex gap-4">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <Link to="/generate" className="hover:text-white transition">Generate</Link>
            <Link to="/about" className="hover:text-white transition">About</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
