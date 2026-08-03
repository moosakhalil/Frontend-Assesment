import { AlertIcon, RefreshIcon, SearchIcon } from "@/components/icons";
import type { ApiError } from "@/types";

interface ErrorStateProps {
  error: ApiError;
  onRetry: () => void;
  /** Compact fits inside a column; full centres in the whole workspace. */
  compact?: boolean;
}

export function ErrorState({ error, onRetry, compact = false }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center gap-3 text-center ${
        compact ? "px-6 py-10" : "px-6 py-20"
      }`}
    >
      <span className="flex size-10 items-center justify-center rounded-full bg-red-50 text-red-500">
        <AlertIcon className="size-5" />
      </span>
      <div>
        <p className="text-sm font-semibold">Couldn&apos;t load this</p>
        <p className="mt-1 max-w-[34ch] text-xs text-ink-muted">
          {error.message}
          {error.status ? ` (HTTP ${error.status})` : ""}
        </p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-hover focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <RefreshIcon className="size-3.5" />
        Try again
      </button>
    </div>
  );
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2.5 px-6 py-14 text-center">
      <span className="flex size-10 items-center justify-center rounded-full bg-hover text-ink-muted">
        <SearchIcon className="size-5" />
      </span>
      <p className="text-sm font-semibold">{title}</p>
      <p className="max-w-[32ch] text-xs text-ink-muted">{description}</p>
    </div>
  );
}
