import { Plus } from "lucide-react";

interface AddCustomSectionButtonProps {
  onClick: () => void;
}

export function AddCustomSectionButton({ onClick }: AddCustomSectionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-2xl border-2 border-dashed border-white/12 bg-transparent px-6 py-5 text-sm font-medium text-white/50 transition-all duration-200 hover:border-white/30 hover:bg-white/[0.04] hover:text-white/80 hover:shadow-[0_0_24px_rgba(139,92,246,0.08)] flex items-center justify-center gap-2"
    >
      <Plus className="h-4 w-4" />
      Add Custom Section
    </button>
  );
}
