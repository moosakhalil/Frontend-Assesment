"use client";

import { useCallback } from "react";
import { fetchConversations } from "@/lib/api/conversations";
import { useAsync } from "./useAsync";
import type { AsyncState, Conversation } from "@/types";

export function useConversations(): {
  state: AsyncState<Conversation[]>;
  retry: () => void;
} {
  const fetcher = useCallback(
    (signal: AbortSignal) => fetchConversations(signal),
    [],
  );
  return useAsync(fetcher, []);
}
