"use client";

import { useCallback } from "react";
import { fetchMessages } from "@/lib/api/conversations";
import { useAsync } from "./useAsync";
import type { AsyncState, Message } from "@/types";

export function useMessages(conversationId: number | null): {
  state: AsyncState<Message[]>;
  retry: () => void;
} {
  const fetcher = useCallback(
    (signal: AbortSignal) =>
      conversationId === null
        ? Promise.resolve<Message[]>([])
        : fetchMessages(conversationId, signal),
    [conversationId],
  );
  return useAsync(fetcher, [conversationId]);
}
