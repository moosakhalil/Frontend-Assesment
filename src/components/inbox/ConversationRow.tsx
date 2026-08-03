"use client";

import { Avatar } from "@/components/ui/Avatar";
import { formatListTimestamp } from "@/lib/format";
import type { Conversation } from "@/types";

interface ConversationRowProps {
  conversation: Conversation;
  selected: boolean;
  now: Date;
  onSelect: (id: number) => void;
}

/*
 * Frame values divided by the 0.75 export scale:
 *
 *   row       50.53 tall, 8.42/5.61 padding, 5.61 gap, 5.61 radius, #FFFFFF
 *   selected  + #0000001F hairline and 0 2.81 8.42 #0000000F
 *   avatar    19.65 round
 *   name      9.82px w556, time 7.72px w556, preview 9.82px w457 — all #000000
 *
 * Every row is a white card here, not just the selected one; selection is
 * carried by the hairline and shadow alone. The frame has no unread dot.
 */
export function ConversationRow({
  conversation,
  selected,
  now,
  onSelect,
}: ConversationRowProps) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(conversation.id)}
        aria-current={selected ? "true" : undefined}
        className={`flex h-[67.37px] w-full items-center gap-[7.48px] rounded-chip bg-surface px-[11.23px] py-[7.48px] text-left transition-shadow focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none focus-visible:-outline-offset-2 ${
          selected
            ? "shadow-scope ring-[0.93px] ring-[rgb(0_0_0/0.12)] ring-inset"
            : "hover:shadow-[0_1.87px_11.23px_0_rgb(0_0_0/0.04)]"
        }`}
      >
        <Avatar
          id={conversation.id}
          name={conversation.fullName}
          initial={conversation.initial}
          size="lg"
        />

        <span className="min-w-0 flex-1">
          <span className="flex items-baseline gap-[2.81px]">
            <span className="truncate text-body font-medium text-ink">
              {conversation.fullName}
            </span>
            <span className="ml-auto shrink-0 text-time font-medium text-ink tabular-nums">
              {formatListTimestamp(conversation.lastMessageAt, now)}
            </span>
          </span>
          <span className="mt-[2.81px] line-clamp-1 text-body text-ink">
            {conversation.preview}
          </span>
        </span>
      </button>
    </li>
  );
}
