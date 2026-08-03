import { request } from "./client";
import { toConversation, toMessages } from "./mappers";
import type {
  CommentsResponseDto,
  UsersResponseDto,
} from "./dto";
import type { Conversation, Message } from "@/types";

const USER_FIELDS = "firstName,lastName,email,phone,image,company,address";
export const CONVERSATION_LIMIT = 12;
const MESSAGES_PER_THREAD = 8;
/** dummyjson exposes 340 comments; keep slices inside that range. */
const COMMENT_POOL = 300;

/**
 * The conversation list. Users supply the contact record, a parallel page of
 * comments supplies message previews — dummyjson has no chat resource.
 */
export async function fetchConversations(
  signal?: AbortSignal,
): Promise<Conversation[]> {
  const [usersRes, commentsRes] = await Promise.all([
    request<UsersResponseDto>(
      `/users?limit=${CONVERSATION_LIMIT}&select=${USER_FIELDS}`,
      { signal },
    ),
    request<CommentsResponseDto>(`/comments?limit=${CONVERSATION_LIMIT}`, {
      signal,
    }),
  ]);

  return usersRes.users.map((user, index) =>
    toConversation(user, commentsRes.comments[index], index),
  );
}

/** Messages for one conversation — a stable per-conversation comment slice. */
export async function fetchMessages(
  conversationId: number,
  signal?: AbortSignal,
): Promise<Message[]> {
  const skip = (conversationId * 7) % (COMMENT_POOL - MESSAGES_PER_THREAD);
  const res = await request<CommentsResponseDto>(
    `/comments?limit=${MESSAGES_PER_THREAD}&skip=${skip}`,
    { signal },
  );
  return toMessages(res.comments);
}
