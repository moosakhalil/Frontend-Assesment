"use client";

import {
  InstagramBrandIcon,
  MyInboxIcon,
  PeopleIcon,
  TeamIcon,
  UnassignedIcon,
  UserRowIcon,
  WhatsAppBrandIcon,
} from "@/components/icons/figma";
import { CollapsibleSection } from "@/components/ui/CollapsibleSection";
import { Skeleton } from "@/components/ui/Skeleton";
import type { InboxCounts } from "@/types";
import type { ComponentType, SVGProps } from "react";

export type RailFilter =
  | { kind: "my-inbox" }
  | { kind: "all" }
  | { kind: "unassigned" }
  | { kind: "team"; name: string }
  | { kind: "user"; id: number };

interface NavRailProps {
  counts: InboxCounts | null;
  /** Distinguishes "still fetching" from "fetch failed" so skeletons stop. */
  loading: boolean;
  active: RailFilter;
  onSelect: (filter: RailFilter) => void;
}

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

function isSame(a: RailFilter, b: RailFilter): boolean {
  if (a.kind !== b.kind) return false;
  if (a.kind === "team" && b.kind === "team") return a.name === b.name;
  if (a.kind === "user" && b.kind === "user") return a.id === b.id;
  return true;
}

/*
 * Every measurement below is the frame value divided by the 0.75 export scale:
 *
 *   row      25.26 tall, 8.42/5.61 padding, 8.42 gap, 5.61 radius
 *   icon     14.04 frame — 10.53 glyph on scopes, 11.70 on rows
 *   scope    10.73px label #222222, 8.42px count
 *   row      9.82px label #000000, 8.42px count, #AFBFC0 glyph
 */
const ROW =
  "flex w-full items-center rounded-chip px-[11.23px] py-[7.48px] text-left transition-colors focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none";

/* Scopes are a shade taller than rows (26.67 vs 25.26) and sit tighter. */
const SCOPE_ROW = `${ROW} h-[35.56px] gap-[7.48px]`;
const ENTRY_ROW = `${ROW} h-[33.68px] gap-[11.23px]`;

/** The three inbox scopes. Larger label, black glyph, shadow when selected. */
function ScopeItem({
  label,
  count,
  active,
  onClick,
  Icon,
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
  Icon: Icon;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "true" : undefined}
      className={`${SCOPE_ROW} ${active ? "shadow-scope" : "hover:bg-hover"}`}
    >
      <span className="grid size-[18.72px] shrink-0 place-items-center">
        <Icon className="size-[14.04px] text-ink" />
      </span>
      <span className="truncate text-scope text-ink-soft">{label}</span>
      {count ? (
        <span className="ml-auto shrink-0 text-meta text-ink-soft tabular-nums">
          {count}
        </span>
      ) : null}
    </button>
  );
}

/** Team, user and channel entries. Grey glyph, white card when selected. */
function RailRow({
  label,
  count,
  active,
  onClick,
  Icon,
  iconClassName = "text-icon",
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick?: () => void;
  Icon: Icon;
  iconClassName?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "true" : undefined}
      className={`${ENTRY_ROW} ${
        active
          ? "bg-surface shadow-row ring-[0.93px] ring-line ring-inset"
          : "hover:bg-hover"
      }`}
    >
      <span className="grid size-[18.72px] shrink-0 place-items-center">
        <Icon className={`size-[15.6px] ${iconClassName}`} />
      </span>
      <span className="truncate text-body text-ink">{label}</span>
      {count ? (
        <span className="ml-auto shrink-0 text-meta text-ink tabular-nums">
          {count}
        </span>
      ) : null}
    </button>
  );
}

/** Column 1: inbox scopes, teams, users and channels. */
export function NavRail({ counts, loading, active, onSelect }: NavRailProps) {
  return (
    <aside
      aria-label="Inbox navigation"
      className="scroll-thin flex h-full w-full flex-col overflow-y-auto bg-rail shadow-card md:w-rail md:shrink-0 md:rounded-l-shell-lg"
    >
      <div className="flex h-[56.15px] shrink-0 items-center px-[14.97px]">
        <h2 className="text-title font-bold text-ink">Inbox</h2>
      </div>

      <div className="flex flex-col gap-[7.48px] px-[9.36px] pb-[9.36px]">
        <div className="flex flex-col gap-[3.75px]">
          <ScopeItem
            label="My Inbox"
            Icon={MyInboxIcon}
            active={isSame(active, { kind: "my-inbox" })}
            onClick={() => onSelect({ kind: "my-inbox" })}
          />
          <ScopeItem
            label="All"
            Icon={PeopleIcon}
            count={counts?.all}
            active={isSame(active, { kind: "all" })}
            onClick={() => onSelect({ kind: "all" })}
          />
          <ScopeItem
            label="Unassigned"
            Icon={UnassignedIcon}
            count={counts?.unassigned}
            active={isSame(active, { kind: "unassigned" })}
            onClick={() => onSelect({ kind: "unassigned" })}
          />
        </div>

        <CollapsibleSection title="Teams" tone="rail">
          <div className="flex flex-col gap-[3.75px]">
            {counts
              ? counts.teams.map((team) => (
                  <RailRow
                    key={team.name}
                    label={team.name}
                    Icon={TeamIcon}
                    count={team.count}
                    active={isSame(active, { kind: "team", name: team.name })}
                    onClick={() => onSelect({ kind: "team", name: team.name })}
                  />
                ))
              : loading &&
                Array.from({ length: 2 }, (_, i) => (
                  <Skeleton key={i} className="mx-[11.23px] my-2 h-3 w-28" />
                ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Users" tone="rail">
          <div className="flex flex-col gap-[3.75px]">
            {counts
              ? counts.users.map((user) => (
                  <RailRow
                    key={user.id}
                    label={user.name}
                    Icon={UserRowIcon}
                    count={user.count}
                    active={isSame(active, { kind: "user", id: user.id })}
                    onClick={() => onSelect({ kind: "user", id: user.id })}
                  />
                ))
              : loading &&
                Array.from({ length: 8 }, (_, i) => (
                  <Skeleton key={i} className="mx-[11.23px] my-2.5 h-3 w-32" />
                ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Channels" tone="rail">
          <div className="flex flex-col gap-[3.75px] pb-[7.48px]">
            <RailRow
              label="Fit4Life"
              Icon={WhatsAppBrandIcon}
              iconClassName=""
              active
            />
            <RailRow
              label="Fit4Life"
              Icon={InstagramBrandIcon}
              iconClassName=""
              active={false}
            />
          </div>
        </CollapsibleSection>
      </div>
    </aside>
  );
}
