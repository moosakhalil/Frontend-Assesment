"use client";

import { useEffect, useMemo, useRef } from "react";
import { ChevronLeftIcon } from "@/components/icons";
import {
  BotFigmaIcon,
  KebabFigmaIcon,
  MoonFigmaIcon,
  PanelRightFigmaIcon,
} from "@/components/icons/figma";
import { IconButton } from "@/components/ui/IconButton";
import { EmptyState, ErrorState } from "@/components/ui/StateViews";
import { formatDayDivider } from "@/lib/format";
import { MessageBubble } from "./MessageBubble";
import { Composer } from "./Composer";
import { ThreadSkeleton } from "./skeletons";
import type { AsyncState, Conversation, Message } from "@/types";

interface MessageThreadProps {
  conversation: Conversation | null;
  state: AsyncState<Message[]>;
  onRetry: () => void;
  onSend: (body: string) => void;
  onBack: () => void;
  onToggleDetails: () => void;
}

/** Groups consecutive messages by calendar day for the centred date pills. */
function groupByDay(messages: Message[]) {
  const groups: { day: string; items: Message[] }[] = [];
  for (const message of messages) {
    const day = message.sentAt.slice(0, 10);
    const last = groups.at(-1);
    if (last?.day === day) last.items.push(message);
    else groups.push({ day, items: [message] });
  }
  return groups;
}

/** Column 3: the conversation itself. */
export function MessageThread({
  conversation,
  state,
  onRetry,
  onSend,
  onBack,
  onToggleDetails,
}: MessageThreadProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const messages = useMemo(
    () => (state.status === "success" ? state.data : []),
    [state],
  );
  const groups = useMemo(() => groupByDay(messages), [messages]);

  useEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages.length, conversation?.id]);

  if (!conversation) {
    return (
      <section className="hidden min-w-0 flex-1 items-center justify-center rounded-shell bg-surface md:flex">
        <EmptyState
          title="No conversation selected"
          description="Pick a conversation from the list to read the thread."
        />
      </section>
    );
  }

  return (
    <section
      aria-label={`Conversation with ${conversation.fullName}`}
      className="flex h-full min-w-0 flex-1 flex-col rounded-shell bg-surface shadow-card"
    >
      {/* 42.11 tall, 11.23 side padding; title 12.63px w400. */}
      <div className="flex h-[56.15px] shrink-0 items-center gap-[11.23px] px-[14.97px]">
        <IconButton label="Back to conversations" onClick={onBack} className="md:hidden">
          <ChevronLeftIcon className="size-[18.72px]" />
        </IconButton>
        <h2 className="truncate text-title text-ink">{conversation.fullName}</h2>

        {/* Three 22.46 buttons, 5.61 gap, 5.61 radius — two #EBEBEB, one black. */}
        <div className="ml-auto flex items-center gap-[7.48px]">
          <IconButton label="More actions" variant="soft">
            <KebabFigmaIcon className="size-[18.72px]" />
          </IconButton>
          <IconButton label="Snooze conversation" variant="soft">
            <MoonFigmaIcon className="size-[18.72px]" />
          </IconButton>
          <IconButton label="Toggle AI assistant" variant="solid">
            <BotFigmaIcon className="size-[18.72px]" />
          </IconButton>
          <IconButton
            label="Toggle details panel"
            onClick={onToggleDetails}
            className="xl:hidden"
          >
            <PanelRightFigmaIcon className="size-[18.72px]" />
          </IconButton>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="scroll-thin min-h-0 flex-1 overflow-y-auto px-[14.97px] pt-[14.97px]"
      >
        {state.status === "loading" && <ThreadSkeleton />}

        {state.status === "error" && (
          <ErrorState error={state.error} onRetry={onRetry} />
        )}

        {state.status === "success" &&
          (messages.length === 0 ? (
            <EmptyState
              title="No messages yet"
              description="Start the conversation using the box below."
            />
          ) : (
            groups.map((group) => (
              <div key={group.day}>
                {/* Divider pill: 8.42/11.23 padding, 5.61 radius, #EFF2F2. */}
                <div className="mb-[12.16px] flex justify-center">
                  <span className="rounded-chip bg-hover px-[14.97px] py-[11.23px] text-meta font-semibold text-ink">
                    {formatDayDivider(group.items[0].sentAt)}
                  </span>
                </div>
                <ul className="flex flex-col gap-[13.09px]">
                  {group.items.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                </ul>
              </div>
            ))
          ))}
      </div>

      <Composer onSend={onSend} />
    </section>
  );
}
