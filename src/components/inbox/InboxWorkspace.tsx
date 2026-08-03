"use client";

import { useMemo, useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { useConversations } from "@/hooks/useConversations";
import { useMessages } from "@/hooks/useMessages";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { deriveCounts } from "@/lib/format";
import { ConversationList } from "./ConversationList";
import { DetailsPanel } from "./DetailsPanel";
import { ExtractingOverlay, SECTION_ICONS } from "./ExtractingOverlay";
import { FlightLayer } from "./loading/FlightLayer";
import { useLoadSequence } from "./loading/useLoadSequence";
import { MessageThread } from "./MessageThread";
import { NavRail, type RailFilter } from "./NavRail";
import type {
  AsyncState,
  Conversation,
  ConversationStatus,
  Message,
  SortOrder,
} from "@/types";

const CURRENT_USER = "Michael Johnson";

function matchesRail(conversation: Conversation, filter: RailFilter): boolean {
  switch (filter.kind) {
    case "all":
    case "my-inbox":
      return true;
    case "unassigned":
      return conversation.unreadCount === 0;
    case "team":
      return conversation.department === filter.name;
    case "user":
      return conversation.id === filter.id;
  }
}

/**
 * Applied to a column the moment its honeycomb lands. No fill mode, so the
 * element returns to its natural styles once the reveal finishes and no
 * lingering `filter` layer is left behind.
 */
const REVEAL = "animate-[populate-in_560ms_cubic-bezier(0.2,0.7,0.2,1)]";

/** Shared "not yet handed over" state — the shape carries no payload. */
const LOADING = { status: "loading" } as const;

/** Dimmer behind the mobile drawers. */
function Scrim({ onClick, hideAt }: { onClick: () => void; hideAt: string }) {
  return (
    <div
      onClick={onClick}
      aria-hidden="true"
      data-scrim
      className={`fixed inset-0 z-30 bg-black/30 ${hideAt}`}
    />
  );
}

export function InboxWorkspace() {
  const { state: conversationsState, retry: retryConversations } = useConversations();

  const [railFilter, setRailFilter] = useState<RailFilter>({ kind: "my-inbox" });
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ConversationStatus | "all">("open");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Locally-sent messages, keyed by conversation — see Composer for why.
  const [sent, setSent] = useState<Record<number, Message[]>>({});

  /*
   * Panel visibility is tracked separately per breakpoint: on desktop the rail
   * and details are columns that can be collapsed, on smaller screens they are
   * drawers that start closed. Separate state avoids a flash on first paint.
   */
  const [railOpen, setRailOpen] = useState(true);
  const [drawerRailOpen, setDrawerRailOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [drawerDetailsOpen, setDrawerDetailsOpen] = useState(false);
  const [mobilePane, setMobilePane] = useState<"list" | "thread">("list");

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const isWide = useMediaQuery("(min-width: 1280px)");
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  /*
   * The extraction frame is driven by the conversations fetch settling either
   * way — an error still has to reach the column that renders it, so the
   * hand-off runs on "no longer loading" rather than on success.
   */
  const settled = conversationsState.status !== "loading";
  const { ready, armed, flights, overlayVisible, registerHex, registerSection } =
    useLoadSequence(settled, !reduceMotion);

  const conversations = useMemo(
    () => (conversationsState.status === "success" ? conversationsState.data : []),
    [conversationsState],
  );

  /**
   * The dataset has no real dates, so "now" is the most recent message in the
   * set. That makes the newest day render as clock times and the day before it
   * as "Yesterday", matching the Figma list.
   */
  const now = useMemo(() => {
    const latest = conversations.reduce<number>(
      (max, c) => Math.max(max, new Date(c.lastMessageAt).getTime()),
      0,
    );
    return latest ? new Date(latest) : new Date();
  }, [conversations]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return conversations
      .filter((c) => matchesRail(c, railFilter))
      .filter((c) => statusFilter === "all" || c.status === statusFilter)
      .filter(
        (c) =>
          !needle ||
          c.fullName.toLowerCase().includes(needle) ||
          c.email.toLowerCase().includes(needle) ||
          c.preview.toLowerCase().includes(needle),
      )
      .sort((a, b) => {
        const delta =
          new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
        return sortOrder === "newest" ? delta : -delta;
      });
  }, [conversations, railFilter, statusFilter, query, sortOrder]);

  /**
   * Selection is derived, not synced: if the explicit pick falls out of the
   * filtered set the first row takes over. No effect, so no extra render pass.
   */
  const selected = useMemo(
    () => visible.find((c) => c.id === selectedId) ?? visible[0] ?? null,
    [visible, selectedId],
  );

  const { state: messagesState, retry: retryMessages } = useMessages(
    selected?.id ?? null,
  );

  /** Merge fetched messages with anything sent locally in this session. */
  const threadState: AsyncState<Message[]> = useMemo(() => {
    if (messagesState.status !== "success") return messagesState;
    const local = selected ? (sent[selected.id] ?? []) : [];
    return { status: "success", data: [...messagesState.data, ...local] };
  }, [messagesState, sent, selected]);

  function handleSend(body: string) {
    if (!selected) return;
    const conversationId = selected.id;
    setSent((current) => {
      const existing = current[conversationId] ?? [];
      const message: Message = {
        id: -(existing.length + 1),
        body,
        direction: "outbound",
        sentAt: new Date().toISOString(),
        read: false,
      };
      return { ...current, [conversationId]: [...existing, message] };
    });
  }

  function handleSelect(id: number) {
    setSelectedId(id);
    setMobilePane("thread");
  }

  function handleRailSelect(filter: RailFilter) {
    setRailFilter(filter);
    setDrawerRailOpen(false);
  }

  /**
   * dummyjson has no assignment resource, so the assignee is another agent
   * from the same fetched set, picked deterministically per conversation.
   */
  const assignee = useMemo(() => {
    if (!selected || conversations.length === 0) return CURRENT_USER;
    const index = conversations.findIndex((c) => c.id === selected.id);
    return conversations[(index + 3) % conversations.length].fullName;
  }, [selected, conversations]);

  const counts = conversations.length ? deriveCounts(conversations) : null;

  /*
   * Each column is held on its skeleton until its own honeycomb has landed,
   * so the dashboard fills in section by section instead of all at once.
   */
  const listState: AsyncState<Conversation[]> = ready.list
    ? conversationsState
    : LOADING;
  const gatedThreadState: AsyncState<Message[]> = ready.thread
    ? threadState
    : LOADING;

  const railVisible = isDesktop ? railOpen : drawerRailOpen;
  const detailsVisible = isWide ? detailsOpen : drawerDetailsOpen;

  return (
    <>
      <ExtractingOverlay
        visible={overlayVisible}
        armed={armed}
        registerHex={registerHex}
      />
      <FlightLayer flights={flights} icons={SECTION_ICONS} />

      {/*
        The shell: cards floating on the canvas with a gutter around and
        between them, rather than columns sharing hard edges.
      */}
      <div className="flex h-dvh flex-col gap-gutter bg-canvas p-gutter">
        <TopBar currentUser={CURRENT_USER} />

        <div className="relative flex min-h-0 flex-1 gap-gutter">
          {/*
            Columns 1 and 2 read as a single card in the frame — no gutter
            between them, just the hairline the list carries on its left edge.
            Below md the rail is a drawer and leaves this group's flow, so the
            group collapses to the list alone.
          */}
          <div
            className={`${
              mobilePane === "thread" ? "hidden md:flex" : "flex"
            } min-w-0 flex-1 rounded-shell bg-rail-backing md:flex-initial md:shrink-0 md:grow-0 md:rounded-l-shell-lg`}
          >
            {railVisible && (
              <>
                {!isDesktop && (
                  <Scrim onClick={() => setDrawerRailOpen(false)} hideAt="md:hidden" />
                )}
                <div
                  ref={registerSection("rail")}
                  className={`fixed inset-y-0 left-0 z-40 w-64 pt-15 pb-gutter md:static md:z-auto md:w-auto md:shrink-0 md:p-0 ${
                    ready.rail ? REVEAL : ""
                  }`}
                >
                  <NavRail
                    counts={ready.rail ? counts : null}
                    loading={!ready.rail}
                    active={railFilter}
                    onSelect={handleRailSelect}
                  />
                </div>
              </>
            )}

            <div
              ref={registerSection("list")}
              className={`flex min-w-0 flex-1 md:flex-initial md:shrink-0 md:grow-0 ${
                ready.list ? REVEAL : ""
              }`}
            >
              <ConversationList
                title={CURRENT_USER}
                state={listState}
                visible={visible}
                selectedId={selected?.id ?? null}
                query={query}
                statusFilter={statusFilter}
                sortOrder={sortOrder}
                now={now}
                onQueryChange={setQuery}
                onStatusChange={setStatusFilter}
                onSortChange={setSortOrder}
                onSelect={handleSelect}
                onToggleRail={() =>
                  isDesktop
                    ? setRailOpen((value) => !value)
                    : setDrawerRailOpen((value) => !value)
                }
                onRetry={retryConversations}
              />
            </div>
          </div>

          {/* Column 3 — takes the remaining width. */}
          <div
            ref={registerSection("thread")}
            className={`${
              mobilePane === "thread" ? "flex" : "hidden md:flex"
            } min-w-0 flex-1 ${ready.thread ? REVEAL : ""}`}
          >
            <MessageThread
              conversation={selected}
              state={gatedThreadState}
              onRetry={retryMessages}
              onSend={handleSend}
              onBack={() => setMobilePane("list")}
              onToggleDetails={() =>
                isWide
                  ? setDetailsOpen((value) => !value)
                  : setDrawerDetailsOpen((value) => !value)
              }
            />
          </div>

          {/* Column 4 — drawer below xl, static column above it. */}
          {detailsVisible && (
            <>
              {!isWide && (
                <Scrim
                  onClick={() => setDrawerDetailsOpen(false)}
                  hideAt="xl:hidden"
                />
              )}
              <div
                ref={registerSection("details")}
                className={`fixed inset-y-0 right-0 z-40 w-80 max-w-[86vw] pt-15 pb-gutter xl:static xl:z-auto xl:w-auto xl:max-w-none xl:shrink-0 xl:p-0 ${
                  ready.details ? REVEAL : ""
                }`}
              >
                <DetailsPanel
                  conversation={ready.details ? selected : null}
                  assignee={assignee}
                  loading={!ready.details}
                  onClose={() =>
                    isWide ? setDetailsOpen(false) : setDrawerDetailsOpen(false)
                  }
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
