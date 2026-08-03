import { Skeleton } from "@/components/ui/Skeleton";

/** Matches the Figma loading frame: avatar circle plus two text lines. */
export function ConversationListSkeleton({ rows = 9 }: { rows?: number }) {
  return (
    <ul className="px-2 pb-3" aria-busy="true" aria-label="Loading conversations">
      {Array.from({ length: rows }, (_, index) => (
        <li
          key={index}
          className="flex items-start gap-2.5 border-b border-line px-1 py-3.5"
        >
          <Skeleton className="size-9" rounded="full" />
          <div className="flex-1 space-y-2 pt-0.5">
            <Skeleton className="h-2.5 w-1/3" />
            <Skeleton className="h-2.5 w-4/5" />
          </div>
          <Skeleton className="mt-0.5 h-2.5 w-8" />
        </li>
      ))}
    </ul>
  );
}

/** Alternating left/right blocks of varying width, as in the Figma frame. */
export function ThreadSkeleton() {
  const bubbles = [
    { side: "left", w: "w-2/5", h: "h-14" },
    { side: "right", w: "w-3/5", h: "h-10" },
    { side: "left", w: "w-1/3", h: "h-7" },
    { side: "right", w: "w-1/2", h: "h-12" },
    { side: "left", w: "w-2/5", h: "h-7" },
    { side: "left", w: "w-1/4", h: "h-7" },
    { side: "right", w: "w-3/5", h: "h-16" },
    { side: "left", w: "w-1/2", h: "h-8" },
  ] as const;

  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading messages">
      <div className="flex justify-center">
        <Skeleton className="h-5 w-24" rounded="md" />
      </div>
      {bubbles.map((bubble, index) => (
        <div
          key={index}
          className={`flex ${bubble.side === "right" ? "justify-end" : "justify-start"}`}
        >
          <Skeleton className={`${bubble.w} ${bubble.h}`} rounded="md" />
        </div>
      ))}
    </div>
  );
}

export function DetailsSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading details">
      {[3, 4, 2, 2].map((rows, section) => (
        <div key={section} className="space-y-3 border-b border-line px-4 py-4">
          <Skeleton className="h-3 w-24" />
          {Array.from({ length: rows }, (_, row) => (
            <div key={row} className="flex items-center justify-between gap-4">
              <Skeleton className="h-2.5 w-20" />
              <Skeleton className="h-2.5 w-24" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function NavRailSkeleton() {
  return (
    <div className="space-y-2.5 px-5 py-4" aria-busy="true">
      {Array.from({ length: 12 }, (_, index) => (
        <Skeleton key={index} className="h-3 w-full" />
      ))}
    </div>
  );
}
