import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/format";

type Tone = "neutral" | "success" | "danger" | "warning" | "accent";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-white/15 text-foreground border-white/20",
  success: "bg-success/15 text-success border-success/25",
  danger: "bg-danger/15 text-danger border-danger/25",
  warning: "bg-warning/15 text-warning border-warning/25",
  accent: "bg-accent/15 text-accent border-accent/25",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ className, tone = "neutral", children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium backdrop-blur-md",
        toneClasses[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
