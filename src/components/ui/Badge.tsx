import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "muted";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-primary/15 text-primary border-primary",
  success: "bg-success/15 text-success border-success",
  warning: "bg-warning/15 text-warning border-warning",
  danger: "bg-danger/15 text-danger border-danger",
  muted: "bg-surface-muted text-text-muted border-border",
};

function Badge({
  variant = "default",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center border-2 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge, type BadgeProps, type BadgeVariant };
