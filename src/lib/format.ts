import type { Conversation, InboxCounts } from "@/types";

const ONE_DAY = 86_400_000;

/** "23:23" for today, "Yesterday", then a short date — as in the Figma list. */
export function formatListTimestamp(iso: string, now: Date): string {
  const date = new Date(iso);
  const startOfToday = new Date(now).setHours(0, 0, 0, 0);
  const startOfDate = new Date(date).setHours(0, 0, 0, 0);
  const dayDiff = Math.round((startOfToday - startOfDate) / ONE_DAY);

  if (dayDiff <= 0) return formatClock(date);
  if (dayDiff === 1) return "Yesterday";
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" });
}

export function formatClock(date: Date): string {
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/** The centred pill above the first message of a day: "28 August 2025". */
export function formatDayDivider(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

/** Rail counts are derived from the loaded set, never hardcoded. */
export function deriveCounts(conversations: Conversation[]): InboxCounts {
  const byDepartment = new Map<string, number>();

  for (const conversation of conversations) {
    byDepartment.set(
      conversation.department,
      (byDepartment.get(conversation.department) ?? 0) + 1,
    );
  }

  return {
    all: conversations.length,
    unassigned: conversations.filter((c) => c.unreadCount === 0).length,
    teams: [...byDepartment.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4),
    users: conversations.slice(0, 10).map((c) => ({
      id: c.id,
      name: c.fullName,
      count: c.unreadCount,
    })),
  };
}

/** Rotates the four Figma avatar colours deterministically. */
export function avatarColor(id: number): string {
  return `var(--color-av-${(id % 4) + 1})`;
}

export function initialsOf(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}
