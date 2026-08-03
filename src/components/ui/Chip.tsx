import type { ReactNode } from "react";
import { TagIcon } from "@/components/icons";

/*
 * Blue outline label pill from Contact Labels. 19.65 tall with 5.61/4.21
 * padding, 11.23 radius, #E5F1FC over a 1.4 #007AEC stroke, and an 8.42px
 * w656 label — all divided by the 0.75 export scale.
 */
export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-[26.2px] items-center gap-[7.48px] rounded-[14.97px] bg-chip px-[7.48px] text-meta font-semibold text-brand ring-[1.87px] ring-brand ring-inset">
      <TagIcon className="size-[14.97px]" />
      {children}
    </span>
  );
}
