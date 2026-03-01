import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

function Card({ hover = false, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-surface-white border-2 border-border shadow-[4px_4px_0_#000]",
        hover &&
          "transition-all duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Card, type CardProps };
