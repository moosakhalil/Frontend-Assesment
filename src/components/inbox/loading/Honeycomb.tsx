"use client";

import { useId } from "react";
import type { ComponentType, CSSProperties, SVGProps } from "react";

/**
 * Pointy-top hexagon on a 100x100 viewBox. The path length below is the
 * perimeter of these points — `dash-drift` offsets by exactly that, so the
 * travelling outline segment loops without a seam.
 */
const HEX_POINTS = "50,2 93,26 93,74 50,98 7,74 7,26";
const HEX_PERIMETER = 293;

export type HexState = "idle" | "armed";

interface HoneycombProps {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  /** "armed" is the selected state: gradient outline plus a pulsing halo. */
  state?: HexState;
  /** Small avatar dot on the top-right corner, as in the hover spec. */
  badge?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * A honeycomb tile from the extraction frame.
 *
 * Drawn as an SVG rather than a CSS `clip-path` polygon so the outline can be
 * stroked and animated — a clipped div has no edge to draw on.
 *
 * The root is always `relative`, because everything inside it is positioned
 * against it. Callers that need the tile placed on the frame wrap it in their
 * own absolutely-positioned element rather than passing a `position` class —
 * two position utilities on one node resolve by stylesheet order, not by the
 * order they appear in `className`.
 */
export function Honeycomb({
  Icon,
  state = "idle",
  badge = false,
  className = "",
  style,
}: HoneycombProps) {
  const gradientId = useId();
  const armed = state === "armed";

  return (
    <div
      style={style}
      className={`group relative grid place-items-center transition-transform duration-300 hover:scale-110 ${className}`}
    >
      {/* Halo sits behind the tile and only shows once selected. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full blur-md transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(circle, var(--hex-grad-to) 0%, transparent 70%)",
          opacity: armed ? undefined : 0,
          animation: armed ? "hex-halo 1.6s ease-in-out infinite" : undefined,
        }}
      />

      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--hex-grad-from)" />
            <stop offset="50%" stopColor="var(--hex-grad-mid)" />
            <stop offset="100%" stopColor="var(--hex-grad-to)" />
          </linearGradient>
        </defs>

        <polygon
          points={HEX_POINTS}
          fill={armed ? "rgba(30,125,255,0.18)" : "var(--color-hex-fill)"}
          className="transition-[fill] duration-300 group-hover:fill-white/10"
        />

        {/* Static edge, so the tile still reads as a hexagon between dashes. */}
        <polygon
          points={HEX_POINTS}
          fill="none"
          stroke={armed ? `url(#${gradientId})` : "var(--color-hex-line)"}
          strokeWidth={armed ? 3 : 1.5}
          className="transition-[stroke-width] duration-300"
        />

        {/* Travelling segment — the "slightly animated" part of the outline. */}
        <polygon
          points={HEX_POINTS}
          fill="none"
          stroke={armed ? `url(#${gradientId})` : "rgba(255,255,255,0.75)"}
          strokeWidth={armed ? 3.5 : 2}
          strokeLinecap="round"
          strokeDasharray={`${HEX_PERIMETER * 0.2} ${HEX_PERIMETER * 0.8}`}
          style={{
            animation: `dash-drift ${armed ? 1.4 : 3.6}s linear infinite`,
          }}
        />
      </svg>

      <Icon
        className={`relative size-5 transition-colors duration-300 ${
          armed ? "text-white" : "text-white/70 group-hover:text-white"
        }`}
      />

      {badge ? (
        <span
          aria-hidden="true"
          className="absolute -top-0.5 -right-0.5 size-5 rounded-full bg-white p-0.75 shadow-md"
        >
          <span
            className="block size-full rounded-full"
            style={{
              background:
                "radial-gradient(circle at 35% 35%, #34d1c4 0%, #0f6f7d 60%, #062b33 100%)",
            }}
          />
        </span>
      ) : null}
    </div>
  );
}
