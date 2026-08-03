"use client";

import { useId, useState, type ReactNode } from "react";
import { ChevronIcon } from "@/components/icons/figma";

interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  /** Rail groups are smaller and unbordered; panel sections get a divider. */
  tone?: "rail" | "panel";
}

/** Used by both the left rail groups and the right details panel sections. */
export function CollapsibleSection({
  title,
  children,
  defaultOpen = true,
  tone = "panel",
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();

  const isPanel = tone === "panel";

  return (
    /*
     * Panel sections are 33.68-tall headers over an 11.23-inset body, closed
     * by a #D8DEE4 hairline. Rail groups are the same header at 25.26.
     */
    <section className={isPanel ? "border-b-[0.93px] border-line" : ""}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={contentId}
        className={`flex w-full items-center justify-between text-left text-body font-medium text-ink focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none ${
          isPanel
            ? "h-[44.9px] px-[14.97px]"
            : "px-[11.23px] py-[7.48px]"
        }`}
      >
        <span>{title}</span>
        <ChevronIcon
          className={`size-[18.72px] shrink-0 text-ink transition-transform duration-200 ${
            open ? "" : "-rotate-90"
          }`}
        />
      </button>

      <div
        id={contentId}
        hidden={!open}
        className={isPanel ? "px-[14.97px] pb-[7.48px]" : ""}
      >
        {children}
      </div>
    </section>
  );
}
