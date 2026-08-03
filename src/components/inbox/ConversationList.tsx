"use client";

import {
  ComposeFigmaIcon,
  PanelLeftFigmaIcon,
  SearchFieldIcon,
  SlidersFigmaIcon,
} from "@/components/icons/figma";
import { IconButton } from "@/components/ui/IconButton";
import { Select } from "@/components/ui/Select";
import { EmptyState, ErrorState } from "@/components/ui/StateViews";
import { ConversationRow } from "./ConversationRow";
import { ConversationListSkeleton } from "./skeletons";
import type { AsyncState, Conversation, ConversationStatus, SortOrder } from "@/types";

interface ConversationListProps {
  title: string;
  state: AsyncState<Conversation[]>;
  visible: Conversation[];
  selectedId: number | null;
  query: string;
  statusFilter: ConversationStatus | "all";
  sortOrder: SortOrder;
  now: Date;
  onQueryChange: (value: string) => void;
  onStatusChange: (value: ConversationStatus | "all") => void;
  onSortChange: (value: SortOrder) => void;
  onSelect: (id: number) => void;
  onToggleRail: () => void;
  onRetry: () => void;
}

/** Column 2: search, filters and the conversation rows. */
export function ConversationList({
  title,
  state,
  visible,
  selectedId,
  query,
  statusFilter,
  sortOrder,
  now,
  onQueryChange,
  onStatusChange,
  onSortChange,
  onSelect,
  onToggleRail,
  onRetry,
}: ConversationListProps) {
  return (
    /*
     * Sits flush against the rail: rounded on its outer edge only, divided
     * from the rail by a hairline. Translucent white, so the canvas reads
     * through it — the rail beside it is opaque.
     */
    <section
      aria-label="Conversations"
      className="flex h-full w-full min-w-0 flex-col rounded-shell border-line-card bg-surface/70 shadow-card md:w-list md:shrink-0 md:rounded-l-none md:border-l"
    >
      {/* 42.11 tall, 11.23/5.61 padding, 8.42 gap; title 12.63px w656. */}
      <div className="flex h-[56.15px] shrink-0 items-center gap-[11.23px] px-[14.97px]">
        <IconButton label="Toggle navigation" onClick={onToggleRail}>
          <PanelLeftFigmaIcon className="size-[18.72px] text-ink" />
        </IconButton>
        <h2 className="truncate text-title font-semibold text-ink">{title}</h2>
        <IconButton label="New conversation" className="ml-auto">
          <ComposeFigmaIcon className="size-[18.72px] text-ink" />
        </IconButton>
      </div>

      {/* Search row: 42.11 tall, 8.42/5.61 padding; field radius 8.42. */}
      <div className="flex h-[56.15px] shrink-0 items-center px-[11.23px]">
        <label className="flex min-w-0 flex-1 items-center gap-[11.23px] rounded-[11.23px] px-[11.23px] focus-within:ring-2 focus-within:ring-brand">
          <SearchFieldIcon className="size-[17.72px] shrink-0 text-ink" />
          <span className="sr-only">Search chats</span>
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search Chat"
            className="min-w-0 flex-1 bg-transparent text-body font-medium text-ink placeholder:text-ink focus:outline-none"
          />
        </label>
        <IconButton label="Filter options">
          <SlidersFigmaIcon className="size-[18.72px] text-ink" />
        </IconButton>
      </div>

      {/* Filter row: 32.98 tall, 11.23/5.61 padding. */}
      <div className="flex h-[43.97px] shrink-0 items-center justify-between px-[14.97px]">
        <Select
          label="Filter by status"
          value={statusFilter}
          onChange={onStatusChange}
          options={[
            { value: "open", label: "Open" },
            { value: "closed", label: "Closed" },
            { value: "all", label: "All" },
          ]}
        />
        <Select
          label="Sort order"
          value={sortOrder}
          onChange={onSortChange}
          options={[
            { value: "newest", label: "Newest" },
            { value: "oldest", label: "Oldest" },
          ]}
        />
      </div>

      <div className="scroll-thin min-h-0 flex-1 overflow-y-auto">
        {state.status === "loading" && <ConversationListSkeleton />}

        {state.status === "error" && (
          <ErrorState error={state.error} onRetry={onRetry} compact />
        )}

        {state.status === "success" &&
          (visible.length === 0 ? (
            <EmptyState
              title="No conversations"
              description={
                query
                  ? `Nothing matches “${query}”. Try a different name or message.`
                  : "No conversations match the current filters."
              }
            />
          ) : (
            /* Rows container: 8.42/5.61 padding, 2.81 gap. */
            <ul className="flex flex-col gap-[3.75px] px-[11.23px] pb-[7.48px]">
              {visible.map((conversation) => (
                <ConversationRow
                  key={conversation.id}
                  conversation={conversation}
                  selected={conversation.id === selectedId}
                  now={now}
                  onSelect={onSelect}
                />
              ))}
            </ul>
          ))}
      </div>
    </section>
  );
}
