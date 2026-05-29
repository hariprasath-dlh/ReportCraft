import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Presentation, FileText } from "lucide-react";
import { Nav } from "@/components/rc/Nav";
import { Orbs } from "@/components/rc/Orbs";

export const Route = createFileRoute("/generate")({
  head: () => ({
    meta: [
      { title: "Choose what to generate — ReportCraft" },
      { name: "description", content: "Pick between a college review presentation or a full project report." },
    ],
  }),
  component: GenerateHub,
});

function GenerateHub() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Orbs subtle />
      <Nav />
      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-6 pb-24">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition">
          <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" /> Back to Home
        </Link>
        <div className="mt-12 text-center animate-fade-up">
          <div className="label-caps text-violet-300 mb-3">Step 1 of many</div>
          <h1 className="text-4xl md:text-6xl font-extrabold">What do you want to <span className="gradient-text">create</span> today?</h1>
          <p className="mt-4 text-white/60">Choose a template type to get started.</p>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <Link to="/generate/ppt" className="glass glass-violet glass-hover group block p-8 animate-fade-up" style={{ animationDelay: "0.1s", minHeight: 280 }}>
            <div className="flex h-full flex-col">
              <div className="mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-white/10">
                <Presentation className="h-8 w-8 text-violet-300" />
              </div>
              <h2 className="text-3xl font-bold mb-3">Review Presentation</h2>
              <p className="text-white/70 flex-1 leading-relaxed">Generate a perfectly formatted review PPT — Review 0 through Final Review. Just paste your content.</p>
              <div className="mt-6 inline-flex items-center gap-2 text-violet-300 font-semibold">
                Select Review Type <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
          <Link to="/generate/report" className="glass glass-cyan glass-hover group block p-8 animate-fade-up" style={{ animationDelay: "0.18s", minHeight: 280 }}>
            <div className="flex h-full flex-col">
              <div className="mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-white/10">
                <FileText className="h-8 w-8 text-cyan-300" />
              </div>
              <h2 className="text-3xl font-bold mb-3">Project Report (Word)</h2>
              <p className="text-white/70 flex-1 leading-relaxed">Generate your full 35–55 page project report in MS Word format, ready for submission and PDF conversion.</p>
              <div className="mt-6 inline-flex items-center gap-2 text-cyan-300 font-semibold">
                Start Report <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}