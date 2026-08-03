"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Dashboard regions a honeycomb can hand its data to. */
export type SectionId = "rail" | "list" | "thread" | "details";

/** Left to right, which is the order the icons peel off in. */
export const SECTION_ORDER: readonly SectionId[] = [
  "rail",
  "list",
  "thread",
  "details",
];

export interface Flight {
  id: SectionId;
  from: { x: number; y: number; size: number };
  to: { x: number; y: number };
}

/*
 * Timings. Sections overlap deliberately: the next honeycomb lights up while
 * the previous one is still travelling, so the hand-off reads as one motion
 * rather than four separate ones.
 */
const HIGHLIGHT_MS = 320;
const STAGGER_MS = 300;
export const FLIGHT_MS = 680;

type Flags = Record<SectionId, boolean>;

const NONE: Flags = { rail: false, list: false, thread: false, details: false };
const ALL: Flags = { rail: true, list: true, thread: true, details: true };

export interface LoadSequence {
  /** Per-section gate: false keeps that column on its skeleton. */
  ready: Flags;
  /** Honeycombs currently highlighted, just before they launch. */
  armed: Flags;
  /** Icons mid-flight, drawn above everything by `FlightLayer`. */
  flights: Flight[];
  /** Drops once the first icon leaves, fading the frame out behind it. */
  overlayVisible: boolean;
  registerHex: (id: SectionId) => (el: HTMLDivElement | null) => void;
  registerSection: (id: SectionId) => (el: HTMLElement | null) => void;
}

/**
 * Drives the load choreography.
 *
 * While `dataReady` is false everything stays in its skeleton state behind the
 * extraction frame. When it flips, each honeycomb lights up, flies to the
 * region it belongs to, and unlocks that region on arrival.
 *
 * `animate` is the escape hatch for reduced motion: the whole sequence
 * collapses to a single state change.
 */
export function useLoadSequence(
  dataReady: boolean,
  animate = true,
): LoadSequence {
  const hexes = useRef<Partial<Record<SectionId, HTMLDivElement>>>({});
  const sections = useRef<Partial<Record<SectionId, HTMLElement>>>({});
  const timers = useRef<number[]>([]);

  const [ready, setReady] = useState<Flags>(NONE);
  const [armed, setArmed] = useState<Flags>(NONE);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [overlayVisible, setOverlayVisible] = useState(true);

  /*
   * Curried so callers can write `ref={registerHex("rail")}` without a new
   * closure on every render — the id is the only thing that varies.
   */
  const registerHex = useCallback(
    (id: SectionId) => (el: HTMLDivElement | null) => {
      if (el) hexes.current[id] = el;
      else delete hexes.current[id];
    },
    [],
  );

  const registerSection = useCallback(
    (id: SectionId) => (el: HTMLElement | null) => {
      if (el) sections.current[id] = el;
      else delete sections.current[id];
    },
    [],
  );

  useEffect(() => {
    // Reduced motion skips the sequence entirely — see the derived
    // values below, which need no effect at all.
    if (!dataReady || !animate) return;

    const at = (ms: number, run: () => void) => {
      timers.current.push(window.setTimeout(run, ms));
    };

    SECTION_ORDER.forEach((id, index) => {
      const base = index * STAGGER_MS;

      at(base, () => setArmed((flags) => ({ ...flags, [id]: true })));

      at(base + HIGHLIGHT_MS, () => {
        setArmed((flags) => ({ ...flags, [id]: false }));

        // Measure at launch, not at mount: columns can be resized or
        // collapsed while the fetch is still in flight.
        const hex = hexes.current[id];
        const target = sections.current[id];

        if (hex && target) {
          const h = hex.getBoundingClientRect();
          const t = target.getBoundingClientRect();

          // Collapsed or off-screen columns have no meaningful target.
          if (t.width > 0 && t.height > 0) {
            setFlights((current) => [
              ...current,
              {
                id,
                from: {
                  x: h.left + h.width / 2,
                  y: h.top + h.height / 2,
                  size: h.width,
                },
                to: {
                  x: t.left + Math.min(t.width / 2, 130),
                  y: t.top + Math.min(t.height / 2, 96),
                },
              },
            ]);
          }
        }

        // The frame starts clearing as soon as the first icon is away.
        if (index === 0) setOverlayVisible(false);
      });

      at(base + HIGHLIGHT_MS + FLIGHT_MS, () => {
        setFlights((current) => current.filter((f) => f.id !== id));
        setReady((flags) => ({ ...flags, [id]: true }));
      });
    });

    const scheduled = timers.current;
    return () => {
      scheduled.forEach(window.clearTimeout);
      timers.current = [];
    };
  }, [dataReady, animate]);

  /*
   * With motion reduced there is nothing to schedule: the frame and the
   * columns flip straight off the fetch, derived rather than stored.
   */
  if (!animate) {
    return {
      ready: dataReady ? ALL : NONE,
      armed: NONE,
      flights: [],
      overlayVisible: !dataReady,
      registerHex,
      registerSection,
    };
  }

  return {
    ready,
    armed,
    flights,
    overlayVisible,
    registerHex,
    registerSection,
  };
}
