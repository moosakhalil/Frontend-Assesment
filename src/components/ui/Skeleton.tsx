interface SkeletonProps {
  className?: string;
  rounded?: "sm" | "md" | "full";
}

const ROUNDED = {
  sm: "rounded",
  md: "rounded-md",
  full: "rounded-full",
} as const;

/** Grey placeholder bar with a shimmer sweep, matching the Figma loading frame. */
export function Skeleton({ className = "", rounded = "sm" }: SkeletonProps) {
  return (
    <div
      className={`relative overflow-hidden bg-skeleton ${ROUNDED[rounded]} ${className}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-linear-to-r from-transparent via-white/70 to-transparent" />
    </div>
  );
}
