import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function Nav() {
  return (
    <header className="relative z-30 mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: "var(--grad-vc)" }}>
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight">ReportCraft</span>
      </Link>
      <nav className="flex items-center gap-1 text-sm">
        <Link to="/" className="rounded-full px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 transition">Home</Link>
        <Link to="/generate" className="rounded-full px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 transition">Generate</Link>
        <Link to="/about" className="rounded-full px-4 py-2 text-white/70 hover:text-white hover:bg-white/5 transition">About</Link>
      </nav>
    </header>
  );
}