/** Domain types. These are ours — raw API shapes live in `lib/api/dto.ts`. */

export type ConversationStatus = "open" | "closed";

export interface Conversation {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  /** Fallback initial when the avatar image fails to load. */
  initial: string;
  city: string;
  department: string;
  companyName: string;
  jobTitle: string;
  status: ConversationStatus;
  unreadCount: number;
  preview: string;
  /** ISO string. Derived — see `lib/api/mappers.ts`. */
  lastMessageAt: string;
}

export type MessageDirection = "inbound" | "outbound";

export interface Message {
  id: number;
  body: string;
  direction: MessageDirection;
  /** ISO string. */
  sentAt: string;
  read: boolean;
}

export interface ContactNote {
  id: string;
  body: string;
}

export interface OtherChat {
  id: number;
  channel: string;
  preview: string;
  date: string;
}

/** Left-rail counts, derived from the conversation set rather than hardcoded. */
export interface InboxCounts {
  all: number;
  unassigned: number;
  teams: { name: string; count: number }[];
  users: { id: number; name: string; count: number }[];
}

export type SortOrder = "newest" | "oldest";

/** Discriminated union used by every async view in the app. */
export type AsyncState<T> =
  | { status: "loading" }
  | { status: "error"; error: ApiError }
  | { status: "success"; data: T };

export interface ApiError {
  message: string;
  /** HTTP status when the failure came from a response, undefined for network errors. */
  status?: number;
}
