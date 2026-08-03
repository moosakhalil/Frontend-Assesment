"use client";

/**
 * The animated rings over the extraction artwork.
 *
 * Each ring is a conic gradient masked down to a hairline band, so a single
 * bright arc travels round a circular track as the element rotates. Speeds and
 * directions alternate to keep the field from reading as one rigid wheel.
 *
 * These are deliberately faint: the artwork behind already carries the glow,
 * so the rings are here for motion, not for brightness.
 */
const RINGS: { size: number; duration: number; reverse?: boolean; opacity: number }[] = [
  { size: 210, duration: 6, opacity: 0.45 },
  { size: 340, duration: 11, reverse: true, opacity: 0.34 },
  { size: 520, duration: 16, opacity: 0.26 },
  { size: 760, duration: 24, reverse: true, opacity: 0.18 },
  { size: 1060, duration: 34, opacity: 0.12 },
];

/** Hairline band cut out of the conic gradient, `w` px wide. */
function ringMask(w: number) {
  return `radial-gradient(closest-side, transparent calc(100% - ${w}px), #000 calc(100% - ${w}px), #000 100%, transparent 100%)`;
}

export function OrbitField() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      {RINGS.map((ring, index) => {
        const mask = ringMask(index < 3 ? 1.5 : 1);

        return (
          <div
            key={ring.size}
            className="absolute top-[42%] left-1/2 rounded-full"
            style={{
              width: ring.size,
              height: ring.size,
              marginLeft: -ring.size / 2,
              marginTop: -ring.size / 2,
              opacity: ring.opacity,
              animation: `ring-breathe ${ring.duration / 2}s ease-in-out ${index * 0.4}s infinite`,
            }}
          >
            {/* Static track — keeps the circle readable between arc passes. */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: "rgba(150, 195, 255, 0.1)",
                WebkitMask: mask,
                mask,
              }}
            />

            {/* Travelling arc. */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0deg, transparent 190deg, rgba(124,196,255,0.15) 260deg, var(--color-arc) 340deg, rgba(255,255,255,0.9) 356deg, transparent 360deg)",
                WebkitMask: mask,
                mask,
                animation: `${ring.reverse ? "orbit-reverse" : "orbit"} ${ring.duration}s linear infinite`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
