"use client";

import { useState } from "react";

/**
 * The wordmark, switchable between the two brands the Figma file carries.
 *
 * The canonical frame (`5:443`) is branded **heyy** — a #FE3265 rounded badge
 * plus an outlined "heyy" logotype. The two older frames (`2:491`, `2:1358`),
 * which are also the ones with stray rotations, say **BOXpad**. Rather than
 * pick for you, clicking the mark toggles between them.
 *
 * Geometry is straight from `logo-horiz` (5:446): a 22.46 badge, 5.61 gap and
 * a 36.49x16.84 logotype, divided by the 0.75 export scale.
 */
export type Brand = "boxpad" | "heyy";

export function BrandMark({ initial = "boxpad" }: { initial?: Brand }) {
  const [brand, setBrand] = useState<Brand>(initial);
  const next = brand === "boxpad" ? "heyy" : "boxpad";

  return (
    <button
      type="button"
      onClick={() => setBrand(next)}
      aria-label={`Brand: ${brand}. Switch to ${next}.`}
      title={`Switch to ${next}`}
      className="flex shrink-0 items-center gap-[7.48px] rounded-chip focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
    >
      {brand === "heyy" ? (
        <>
          <span
            aria-hidden="true"
            className="grid size-[29.95px] place-items-center rounded-[9px] bg-(--color-av-me)"
          >
            {/* The badge glyph, 14.04 white on the pink square. */}
            <svg viewBox="0 0 12 15" className="h-[18.7px] w-[15.2px]" fill="none">
              <path
                d="M1.6 1.2v12.6M10.4 1.2v12.6M1.6 7.5h8.8"
                stroke="#FFFFFF"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="font-display text-[22.45px] leading-none font-bold tracking-tight text-(--color-av-me) select-none">
            heyy
          </span>
        </>
      ) : (
        <span className="font-display text-[16.84px] leading-none font-bold tracking-normal text-brand select-none">
          BOXpad
        </span>
      )}
    </button>
  );
}
