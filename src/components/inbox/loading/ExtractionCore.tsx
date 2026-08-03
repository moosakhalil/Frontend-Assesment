"use client";

/**
 * The centre of the extraction frame: a bright orbiting ring with the stacked
 * avatar group floating at its middle.
 *
 * `gifSrc` fills the centre with an animated asset instead of the avatar
 * stack — the frame is specced with a GIF there. Nothing ships in `public/`
 * yet, so the avatar stack is the fallback and stays the default.
 */
const AVATARS = [
  "radial-gradient(circle at 35% 30%, #34d1c4 0%, #0f6f7d 55%, #062b33 100%)",
  "radial-gradient(circle at 40% 35%, #d8b48a 0%, #8a6b52 50%, #4a3a2c 100%)",
  "radial-gradient(circle at 40% 35%, #ff7a4d 0%, #d93a16 60%, #92230a 100%)",
];

const RING_MASK =
  "radial-gradient(closest-side, transparent calc(100% - 2px), #000 calc(100% - 2px), #000 100%, transparent 100%)";

export function ExtractionCore({ gifSrc }: { gifSrc?: string }) {
  return (
    <div className="relative grid aspect-square h-full place-items-center justify-self-center">
      {/*
        The artwork behind is at its brightest right here, so the ring needs a
        darker bed to read against — without it the whole core washes out.
      */}
      <div
        aria-hidden="true"
        className="absolute -inset-10 rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(circle, rgba(3,10,30,0.72) 0%, rgba(4,14,44,0.45) 55%, transparent 78%)",
        }}
      />

      {/* Dim full circle so the track never disappears entirely. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-full"
        style={{
          background: "rgba(200, 228, 255, 0.8)",
          WebkitMask: RING_MASK,
          mask: RING_MASK,
          filter: "drop-shadow(0 0 5px rgba(120,185,255,0.8))",
        }}
      />

      {/* Bright arc sweeping the track. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, transparent 120deg, rgba(124,196,255,0.5) 240deg, var(--color-arc) 320deg, #ffffff 352deg, rgba(255,255,255,0.25) 358deg, transparent 360deg)",
          WebkitMask: RING_MASK,
          mask: RING_MASK,
          animation: "orbit 2.6s linear infinite",
          filter: "drop-shadow(0 0 8px rgba(140,205,255,0.95))",
        }}
      />

      {/* Soft wide ring under the crisp one — the halo in the Figma frame. */}
      <div
        aria-hidden="true"
        className="absolute -inset-2 rounded-full blur-[6px]"
        style={{
          background: "rgba(90, 165, 255, 0.4)",
          WebkitMask: RING_MASK,
          mask: RING_MASK,
        }}
      />

      {/* Outer bloom. */}
      <div
        aria-hidden="true"
        className="absolute -inset-6 rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(circle, rgba(60,140,255,0.35) 0%, transparent 65%)",
        }}
      />

      {gifSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={gifSrc}
          alt=""
          className="relative size-24 rounded-2xl object-cover shadow-lg"
          style={{ animation: "pill-bob 3s ease-in-out infinite" }}
        />
      ) : (
        // A white card, not a pill — the avatars sit slightly proud of it on
        // both edges, as in the frame.
        <span
          className="relative flex h-10 items-center rounded-[3px] bg-white px-2 shadow-[0_10px_28px_rgba(0,0,0,0.4)]"
          style={{ animation: "pill-bob 3s ease-in-out infinite" }}
        >
          {AVATARS.map((background, index) => (
            <span
              key={index}
              aria-hidden="true"
              className="size-11 rounded-full"
              style={{
                background,
                marginLeft: index === 0 ? 0 : "-0.75rem",
                zIndex: AVATARS.length - index,
              }}
            />
          ))}
        </span>
      )}
    </div>
  );
}
