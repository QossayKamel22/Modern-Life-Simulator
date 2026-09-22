import { cn } from "@/lib/utils/format";

interface StatBarProps {
  label: string;
  value: number;
  max?: number;
  colorClassName?: string;
}

export function StatBar({ label, value, max = 100, colorClassName = "bg-accent" }: StatBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted">{label}</span>
        <span className="font-medium text-foreground">{Math.round(value)}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10 shadow-[0_1px_2px_rgba(0,0,0,0.15)_inset]">
        <div
          className={cn("h-full rounded-full shadow-[0_0_8px_-1px_currentColor] transition-all duration-500", colorClassName)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
