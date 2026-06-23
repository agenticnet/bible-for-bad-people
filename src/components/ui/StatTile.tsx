import { cn } from "@/lib/utils";
import { accentStyles, type Accent } from "./tokens";

interface StatTileProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent: Accent;
}

export default function StatTile({ icon: Icon, label, value, accent }: StatTileProps) {
  const a = accentStyles[accent];

  return (
    <div className={cn("rounded-lg border px-4 py-3", a.surfaceMuted)}>
      <div className="mb-1 flex items-center gap-1.5 opacity-70">
        <Icon className="h-3.5 w-3.5" />
        <span className="verse-ref text-[0.65rem]">{label}</span>
      </div>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
