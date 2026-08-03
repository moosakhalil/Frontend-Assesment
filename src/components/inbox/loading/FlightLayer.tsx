"use client";

import { useEffect, useState } from "react";
import { Honeycomb } from "./Honeycomb";
import { FLIGHT_MS, type Flight, type SectionId } from "./useLoadSequence";
import type { ComponentType, SVGProps } from "react";

type IconFor = Record<SectionId, ComponentType<SVGProps<SVGSVGElement>>>;

/**
 * One icon travelling from its honeycomb to its column.
 *
 * Both ends are viewport coordinates, so the flyer is `position: fixed` and
 * moves purely on `transform` — no layout is touched mid-flight.
 */
function Flyer({
  flight,
  Icon,
}: {
  flight: Flight;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}) {
  const [landed, setLanded] = useState(false);

  // Two frames: one to commit the start transform, one to change it. A single
  // rAF can be batched with the initial paint and the transition never runs.
  useEffect(() => {
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setLanded(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, []);

  const { from, to } = flight;
  const half = from.size / 2;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0"
      style={{
        width: from.size,
        height: from.size,
        transform: landed
          ? `translate3d(${to.x - half}px, ${to.y - half}px, 0) scale(0.4)`
          : `translate3d(${from.x - half}px, ${from.y - half}px, 0) scale(1)`,
        opacity: landed ? 0 : 1,
        // Holds full opacity for most of the trip, then dissolves into place.
        transition: `transform ${FLIGHT_MS}ms cubic-bezier(0.65, 0, 0.2, 1),
                     opacity 240ms ease-out ${FLIGHT_MS - 260}ms`,
        willChange: "transform, opacity",
      }}
    >
      <Honeycomb Icon={Icon} state="armed" className="size-full" />
    </div>
  );
}

/** Fixed layer above the frame and the dashboard, holding icons in transit. */
export function FlightLayer({
  flights,
  icons,
}: {
  flights: Flight[];
  icons: IconFor;
}) {
  if (flights.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-60">
      {flights.map((flight) => (
        <Flyer key={flight.id} flight={flight} Icon={icons[flight.id]} />
      ))}
    </div>
  );
}
