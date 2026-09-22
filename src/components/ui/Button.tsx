import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils/format";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-foreground shadow-[0_1px_0_0_rgba(255,255,255,0.5)_inset,0_6px_18px_-4px_var(--accent)] hover:brightness-110 active:brightness-95",
  secondary: "glass text-foreground hover:bg-white/10 active:brightness-95",
  ghost: "text-foreground hover:bg-white/10 dark:hover:bg-white/5",
  danger:
    "bg-danger text-white shadow-[0_1px_0_0_rgba(255,255,255,0.4)_inset,0_6px_18px_-4px_var(--danger)] hover:brightness-110",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3.5 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export function Button({ className, variant = "primary", size = "md", disabled, ...props }: ButtonProps) {
  return (
    <motion.button
      whileTap={disabled ? undefined : { scale: 0.96 }}
      whileHover={disabled ? undefined : { scale: 1.015 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-[background,box-shadow,filter] duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:brightness-100",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={disabled}
      {...props}
    />
  );
}
