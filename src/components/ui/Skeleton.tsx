import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse border-2 border-border bg-surface-muted",
        className
      )}
    />
  );
}

export { Skeleton, type SkeletonProps };
