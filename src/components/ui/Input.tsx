import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/format";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "glass w-full rounded-2xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/25",
        className,
      )}
      {...props}
    />
  );
}
