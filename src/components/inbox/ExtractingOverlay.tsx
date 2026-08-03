"use client";

import Image from "next/image";
import {
  InboxIcon,
  NoteIcon,
  SettingsIcon,
  TargetIcon,
  UsersIcon,
  WorkflowIcon,
} from "@/components/icons";
import { ExtractionCore } from "./loading/ExtractionCore";
import { Honeycomb } from "./loading/Honeycomb";
import { OrbitField } from "./loading/OrbitField";
import type { LoadSequence, SectionId } from "./loading/useLoadSequence";
import type { ComponentType, CSSProperties, SVGProps } from "react";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

/**
 * Honeycombs that own a dashboard region. Each is placed on the side of the
 * frame its column sits on, so the hand-off flight reads as a short hop
 * outward rather than a jump across the screen.
 */
export const SECTION_ICONS: Record<SectionId, IconType> = {
  rail: InboxIcon,
  list: UsersIcon,
  thread: NoteIcon,
  details: SettingsIcon,
};

/*
 * Positions come from the 1440x869 loading frame at 1:1 (this frame is NOT
 * exported at 0.75 like the dashboard ones), expressed as percentages so the
 * composition holds at any viewport:
 *
 *   90 @260,87    80 @141,247   80 @305,319
 *   90 @1018,192  80 @1235,87   60 @1213,337
 */
const SECTION_HEXES: { id: SectionId; style: CSSProperties }[] = [
  { id: "rail", style: { left: "9.79%", top: "28.42%", width: 80, height: 80 } },
  { id: "list", style: { left: "21.18%", top: "36.71%", width: 80, height: 80 } },
  { id: "thread", style: { left: "70.69%", top: "22.09%", width: 90, height: 90 } },
  { id: "details", style: { left: "84.24%", top: "38.78%", width: 60, height: 60 } },
];

/** Decorative tiles — they fill the frame out but carry no data. */
const IDLE_HEXES: { Icon: IconType; style: CSSProperties; delay: string }[] = [
  {
    Icon: WorkflowIcon,
    style: { left: "18.06%", top: "10.01%", width: 90, height: 90 },
    delay: "0s",
  },
  {
    Icon: TargetIcon,
    style: { left: "85.76%", top: "10.01%", width: 80, height: 80 },
    delay: "1.1s",
  },
];

interface ExtractingOverlayProps {
  visible: boolean;
  armed: LoadSequence["armed"];
  registerHex: LoadSequence["registerHex"];
}

/**
 * The dark "Extracting Information..." frame.
 *
 * It masks out toward the bottom rather than covering the viewport flat, so
 * the dashboard skeleton stays visible underneath while the fetch is in
 * flight — the loading state is part of the composition, not hidden by it.
 */
export function ExtractingOverlay({
  visible,
  armed,
  registerHex,
}: ExtractingOverlayProps) {
  const fade =
    "linear-gradient(to bottom, #000 0%, #000 58%, rgba(0,0,0,0.78) 74%, rgba(0,0,0,0.32) 90%, transparent 100%)";

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={visible ? "Extracting information" : undefined}
      aria-hidden={!visible}
      className={`fixed inset-0 z-50 transition-opacity duration-500 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div
        className="relative size-full overflow-hidden"
        style={{ WebkitMaskImage: fade, maskImage: fade }}
      >
        {/*
          The frame artwork. Near-black underneath so the frame is already the
          right colour on the first paint, before the image decodes.
          `next/image` re-encodes the 1878px PNG to AVIF/WebP — as a CSS
          background it would ship the full 726KB original.
        */}
        <div className="absolute inset-0 bg-(--color-deep)">
          <Image
            src="/loading-glow.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        <OrbitField />

        {IDLE_HEXES.map(({ Icon, style, delay }, index) => (
          <div key={index} className="absolute hidden sm:block" style={style}>
            <Honeycomb
              Icon={Icon}
              className="size-full"
              style={{
                animation: `float-soft 5s ease-in-out ${delay} infinite`,
              }}
            />
          </div>
        ))}

        {SECTION_HEXES.map(({ id, style }, index) => (
          <div
            key={id}
            ref={registerHex(id)}
            className="absolute hidden sm:block"
            style={style}
          >
            <Honeycomb
              className="size-full"
              Icon={SECTION_ICONS[id]}
              state={armed[id] ? "armed" : "idle"}
              badge={armed[id]}
              style={{
                animation: armed[id]
                  ? undefined
                  : `float-soft 5s ease-in-out ${index * 0.55}s infinite`,
              }}
            />
          </div>
        ))}

        {/* Sits above centre, leaving the lower third for the dashboard. */}
        {/* Ring: 288x273 @576,88 — centred, 10.13% down. */}
        <div className="absolute top-[10.13%] left-1/2 h-[31.4%] w-[20%] -translate-x-1/2">
          <ExtractionCore />
        </div>

        {/* Text block: 530x98 @455,381. Roboto 700 38 over 18. */}
        <div className="absolute top-[43.8%] left-1/2 w-132.5 max-w-[86%] -translate-x-1/2 text-center">
          <h2 className="font-loading text-[38px] leading-11.5 font-bold text-white">
            Extracting Information...
          </h2>
          <p className="mt-2 text-[18px] leading-5.5 text-white">
            We are extracting information from the above honey combs to your
            system
          </p>
        </div>
      </div>
    </div>
  );
}
