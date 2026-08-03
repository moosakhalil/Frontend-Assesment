"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * SSR-safe media query hook. `useSyncExternalStore` is the right primitive
 * here: matchMedia is an external store, so no effect or extra state is needed.
 * Returns `false` during server render and the first client paint.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
