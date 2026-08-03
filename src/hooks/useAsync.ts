"use client";

import { useCallback, useEffect, useState } from "react";
import { toApiError } from "@/lib/api/client";
import type { AsyncState } from "@/types";

interface Settled<T> {
  key: string;
  state: AsyncState<T>;
}

/**
 * Loading / error / success for a single fetch, with abort on unmount and a
 * `retry` for the error UI. Deliberately small — the app reads two endpoints,
 * which does not justify a query library.
 *
 * The result is stored against the key it was fetched for, so "loading" is
 * derived during render rather than written from inside the effect.
 */
export function useAsync<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  deps: readonly unknown[],
): { state: AsyncState<T>; retry: () => void } {
  const [attempt, setAttempt] = useState(0);
  const [settled, setSettled] = useState<Settled<T> | null>(null);

  const key = JSON.stringify([deps, attempt]);
  const state: AsyncState<T> =
    settled?.key === key ? settled.state : { status: "loading" };

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    fetcher(controller.signal)
      .then((data) => {
        if (active) setSettled({ key, state: { status: "success", data } });
      })
      .catch((error: unknown) => {
        if (!active || controller.signal.aborted) return;
        setSettled({ key, state: { status: "error", error: toApiError(error) } });
      });

    return () => {
      active = false;
      controller.abort();
    };
    // `key` encodes the caller's deps plus the retry counter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { state, retry };
}
