export function Orbs({ subtle = false }: { subtle?: boolean }) {
  const op = subtle ? 0.35 : 0.55;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="orb" style={{ width: 520, height: 520, top: "-120px", left: "-100px", background: "#8b5cf6", opacity: op, animationDelay: "0s" }} />
      <div className="orb" style={{ width: 460, height: 460, top: "20%", right: "-120px", background: "#06b6d4", opacity: op, animationDelay: "-3s" }} />
      <div className="orb" style={{ width: 380, height: 380, bottom: "-100px", left: "30%", background: "#f43f5e", opacity: op * 0.8, animationDelay: "-6s" }} />
      <div className="orb" style={{ width: 320, height: 320, top: "55%", left: "10%", background: "#f59e0b", opacity: op * 0.6, animationDelay: "-9s" }} />
    </div>
  );
}