import type { CommentDto, UserDto } from "./dto";
import type { Conversation, Message } from "@/types";

/**
 * The Figma thread is dated 28 August 2025, so timestamps are anchored there.
 * dummyjson has no dates of its own, and deriving them deterministically from
 * ids keeps ordering stable across reloads (and avoids hydration mismatches).
 */
export const ANCHOR_DATE = "2025-08-28T00:00:00.000Z";

/** Small deterministic hash so derived values are stable per id. */
function seed(n: number): number {
  let h = n * 2654435761;
  h ^= h >>> 15;
  h = Math.imul(h, 2246822507);
  h ^= h >>> 13;
  return Math.abs(h);
}

function atMinutes(dayOffset: number, minuteOfDay: number): string {
  const base = new Date(ANCHOR_DATE).getTime();
  const ms = base - dayOffset * 86_400_000 + minuteOfDay * 60_000;
  return new Date(ms).toISOString();
}

export function toConversation(
  user: UserDto,
  comment: CommentDto | undefined,
  index: number,
): Conversation {
  const s = seed(user.id);
  // Newer conversations first, mirroring the Figma list order.
  const dayOffset = index < 8 ? 0 : Math.floor(index / 8);
  const minuteOfDay = Math.max(0, 1403 - index * 71 - (s % 23));

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: `${user.firstName} ${user.lastName}`,
    email: user.email,
    phone: user.phone,
    avatarUrl: user.image,
    initial: user.firstName.charAt(0).toUpperCase(),
    city: user.address.city,
    department: user.company.department,
    companyName: user.company.name,
    jobTitle: user.company.title,
    status: s % 5 === 0 ? "closed" : "open",
    unreadCount: s % 4 === 0 ? 0 : s % 17,
    preview: comment?.body ?? "No messages yet.",
    lastMessageAt: atMinutes(dayOffset, minuteOfDay),
  };
}

/**
 * A conversation thread. dummyjson has no chat endpoint, so a deterministic
 * slice of /comments stands in for messages; even indexes are the customer,
 * odd indexes the agent, matching the left/right split in Figma.
 */
export function toMessages(comments: CommentDto[]): Message[] {
  return comments.map((comment, index) => ({
    id: comment.id,
    body: comment.body,
    direction: index % 2 === 0 ? "inbound" : "outbound",
    sentAt: atMinutes(0, 1148 + index * 13),
    read: index % 2 === 1,
  }));
}
