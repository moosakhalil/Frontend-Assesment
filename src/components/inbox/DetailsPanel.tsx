"use client";

import { useState, type FormEvent } from "react";
import { InstagramIcon } from "@/components/icons";
import {
  PanelRightFigmaIcon,
  PersonFigmaIcon,
  PlusFigmaIcon,
} from "@/components/icons/figma";
import { Chip } from "@/components/ui/Chip";
import { CollapsibleSection } from "@/components/ui/CollapsibleSection";
import { IconButton } from "@/components/ui/IconButton";
import { EmptyState } from "@/components/ui/StateViews";
import { formatShortDate } from "@/lib/format";
import { DetailsSkeleton } from "./skeletons";
import type { ContactNote, Conversation } from "@/types";

interface DetailsPanelProps {
  conversation: Conversation | null;
  /** dummyjson has no assignment resource — see InboxWorkspace for how this is derived. */
  assignee: string;
  loading: boolean;
  onClose: () => void;
}

/*
 * 26.67-tall rows with a fixed 108.77 label column — the values are left
 * aligned against it, not pushed to the right edge. Label 9.82px w457 #909090,
 * value 9.82px w556 #000000, and no divider between rows.
 */
function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex h-[35.56px] items-center gap-[7.48px]">
      <dt className="w-[145.03px] shrink-0 text-body text-ink-muted">{label}</dt>
      <dd className="min-w-0 truncate text-body font-medium text-ink" title={value}>
        {value}
      </dd>
    </div>
  );
}

/** Column 4: chat metadata, contact record, labels, notes and other chats. */
export function DetailsPanel({
  conversation,
  assignee,
  loading,
  onClose,
}: DetailsPanelProps) {
  const [showAll, setShowAll] = useState(false);
  const [notes, setNotes] = useState<ContactNote[]>([
    { id: "seed", body: "Strong potential for future upgrades" },
  ]);
  const [draft, setDraft] = useState("");

  function addNote(event: FormEvent) {
    event.preventDefault();
    const body = draft.trim();
    if (!body) return;
    setNotes((current) => [...current, { id: `${current.length}-${body}`, body }]);
    setDraft("");
  }

  return (
    <aside
      aria-label="Conversation details"
      className="scroll-thin flex h-full w-full flex-col overflow-y-auto rounded-shell bg-surface shadow-card xl:w-details xl:shrink-0"
    >
      <div className="flex h-[56.15px] shrink-0 items-center gap-[11.23px] border-b-[0.93px] border-line px-[14.97px]">
        <h2 className="text-title font-semibold text-ink">Details</h2>
        <IconButton label="Close details panel" onClick={onClose} className="ml-auto">
          <PanelRightFigmaIcon className="size-[18.72px]" />
        </IconButton>
      </div>

      {loading ? (
        <DetailsSkeleton />
      ) : !conversation ? (
        <EmptyState
          title="Nothing selected"
          description="Contact details appear here once a conversation is open."
        />
      ) : (
        <>
          <CollapsibleSection title="Chat Data">
            <dl>
              <div className="flex h-[35.56px] items-center gap-[7.48px]">
                <dt className="w-[145.03px] shrink-0 text-body text-ink-muted">Assignee</dt>
                <dd className="flex items-center gap-[7.48px] text-body font-medium text-ink">
                  <PersonFigmaIcon className="size-[18.72px] text-ink" />
                  {assignee}
                </dd>
              </div>
              <div className="flex h-[35.56px] items-center gap-[7.48px]">
                <dt className="w-[145.03px] shrink-0 text-body text-ink-muted">Team</dt>
                <dd className="flex items-center gap-[7.48px] text-body font-medium text-ink">
                  <PersonFigmaIcon className="size-[18.72px] text-ink" />
                  {conversation.department} Team
                </dd>
              </div>
            </dl>
          </CollapsibleSection>

          <CollapsibleSection title="Contact Data">
            <dl>
              <Field label="First Name" value={conversation.firstName} />
              <Field label="Last Name" value={conversation.lastName} />
              <Field label="Phone number" value={conversation.phone} />
              <Field label="Email" value={conversation.email} />
              {showAll && (
                <>
                  <Field label="Company" value={conversation.companyName} />
                  <Field label="City" value={conversation.city} />
                  <Field label="Job title" value={conversation.jobTitle} />
                </>
              )}
            </dl>
            <button
              type="button"
              onClick={() => setShowAll((value) => !value)}
              className="flex h-[35.56px] items-center text-body font-semibold text-ink focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
            >
              {showAll ? "Show less" : "See all"}
            </button>
          </CollapsibleSection>

          <CollapsibleSection title="Contact Labels">
            <div className="flex flex-wrap items-center gap-[5.61px] py-[7.48px]">
              <Chip>{conversation.department}</Chip>
              <Chip>{conversation.city}</Chip>
              <IconButton
                label="Add label"
                className="size-[25.45px] rounded-full bg-chip text-brand ring-[1.87px] ring-brand ring-inset"
              >
                <PlusFigmaIcon className="size-3" />
              </IconButton>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Notes">
            <form onSubmit={addNote}>
              <label className="sr-only" htmlFor="note-input">
                Add a note
              </label>
              <input
                id="note-input"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Add a note"
                className="h-[33.68px] w-full rounded-chip bg-note px-[9.36px] text-body text-ink placeholder:text-ink focus:ring-2 focus:ring-note focus:outline-none"
              />
            </form>
            <ul className="mt-[7.48px] flex flex-col gap-[7.48px]">
              {notes.map((note) => (
                <li
                  key={note.id}
                  className="flex min-h-[33.68px] items-center rounded-chip bg-note px-[9.36px] text-body text-ink"
                >
                  {note.body}
                </li>
              ))}
            </ul>
          </CollapsibleSection>

          <CollapsibleSection title="Other Chats">
            <div className="flex items-center gap-2">
              <InstagramIcon className="size-5 shrink-0 text-instagram" />
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold">Fit4Life</span>
                <span className="block truncate text-[11px] text-ink-muted">
                  {conversation.preview}
                </span>
              </span>
              <span className="shrink-0 text-[10px] text-ink-muted tabular-nums">
                {formatShortDate(conversation.lastMessageAt)}
              </span>
            </div>
          </CollapsibleSection>
        </>
      )}
    </aside>
  );
}
