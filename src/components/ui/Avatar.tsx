"use client";

import { useState } from "react";
import { avatarColor } from "@/lib/format";

/* `lg` is the list row's 19.65 circle; the initial is 9.82px w556. */
const SIZES = {
  sm: "size-6 text-[10px]",
  md: "size-8 text-xs",
  lg: "size-[26.2px] text-body",
} as const;

interface AvatarProps {
  id: number;
  name: string;
  initial: string;
  src?: string;
  size?: keyof typeof SIZES;
}

/**
 * Coloured initial by default — the dummyjson avatars are generic SVG icons,
 * whereas Figma shows lettered circles. The photo is used only if it loads.
 */
export function Avatar({ id, name, initial, src, size = "md" }: AvatarProps) {
  const [failed, setFailed] = useState(false);

  return (
    <span
      /* The initial is black in the frame, not white. */
      className={`${SIZES[size]} relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-medium text-ink select-none`}
      style={{ backgroundColor: avatarColor(id) }}
      title={name}
    >
      {src && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          className="size-full object-cover"
          onError={() => setFailed(true)}
          loading="lazy"
        />
      ) : (
        initial
      )}
    </span>
  );
}
