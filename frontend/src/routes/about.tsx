import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, ArrowLeft } from "lucide-react";
import { Nav } from "@/components/rc/Nav";
import { Orbs } from "@/components/rc/Orbs";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — ReportCraft" },
      { name: "description", content: "ReportCraft is an internal college tool that automates project review PPTs and reports." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Orbs subtle />
      <Nav />
      <div className="relative z-10 mx-auto max-w-3xl px-6 pt-8 pb-24">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"><ArrowLeft className="h-4 w-4" /> Back</Link>
        <div className="mt-10 animate-fade-up">
          <div className="inline-flex items-center gap-2 mb-6 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" /> About
          </div>
          <h1 className="text-5xl font-extrabold">Built by students, <span className="gradient-text">for students</span>.</h1>
          <p className="mt-6 text-lg text-white/70 leading-relaxed">
            ReportCraft is an internal college tool that takes the pain out of formatting review presentations and project reports.
            It is not a commercial product — it exists to save your evenings, your weekends, and your sanity before submission day.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <div className="glass glass-violet p-6">
              <h3 className="font-bold mb-2">Six reviews. One workflow.</h3>
              <p className="text-sm text-white/60">Review 0 through Final Review — every template is pre-built and matches the official college format.</p>
            </div>
            <div className="glass glass-cyan p-6">
              <h3 className="font-bold mb-2">No installs. No accounts.</h3>
              <p className="text-sm text-white/60">Open it, fill it, download it. Works entirely in your browser.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}