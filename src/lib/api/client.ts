import type { ApiError } from "@/types";

/** Overridable so the app can be pointed at a mock during development. */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://dummyjson.com";

/** Thrown by `request`; carries the HTTP status when one exists. */
export class HttpError extends Error implements ApiError {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

/** Narrow an unknown catch value into the ApiError shape the UI renders. */
export function toApiError(error: unknown): ApiError {
  if (error instanceof HttpError) {
    return { message: error.message, status: error.status };
  }
  if (error instanceof DOMException && error.name === "AbortError") {
    return { message: "Request cancelled." };
  }
  if (error instanceof Error) {
    return { message: error.message };
  }
  return { message: "Something went wrong." };
}

interface RequestOptions {
  signal?: AbortSignal;
}

/**
 * Single entry point for every network call: builds the URL, checks the
 * status, and normalises failures so callers never touch `fetch` directly.
 */
export async function request<T>(
  path: string,
  { signal }: RequestOptions = {},
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      signal,
      headers: { Accept: "application/json" },
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new HttpError(
      "Could not reach the server. Check your connection and try again.",
    );
  }

  if (!response.ok) {
    throw new HttpError(
      `Request failed with status ${response.status}.`,
      response.status,
    );
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new HttpError("The server returned an unreadable response.");
  }
}
