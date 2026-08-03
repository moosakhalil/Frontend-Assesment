"use client";

import { useState, type FormEvent } from "react";
import {
  ComposerBoltIcon,
  ComposerEmojiIcon,
  ComposerImageIcon,
  ComposerMicIcon,
  ComposerNoteIcon,
  ComposerReplyIcon,
  ComposerVideoIcon,
} from "@/components/icons/figma";
import { IconButton } from "@/components/ui/IconButton";

/**
 * Sending is local-only: dummyjson has no chat resource to POST to, so the
 * message is appended optimistically and the limitation is noted in the README.
 */
export function Composer({ onSend }: { onSend: (body: string) => void }) {
  const [value, setValue] = useState("");
  const trimmed = value.trim();

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!trimmed) return;
    onSend(trimmed);
    setValue("");
  }

  return (
    /*
     * Frame values divided by the 0.75 export scale: the outer block is
     * 92.63 tall with 11.23 padding, wrapping an 81.40 card at 5.61 padding
     * and 5.61 radius. Input row 33.68 tall with 11.23/8.42 padding; the
     * icon row is a second 33.68 row of 22.46 buttons at 2.81 gap.
     */
    <form
      onSubmit={handleSubmit}
      className="mx-[14.97px] mb-[14.97px] flex shrink-0 flex-col gap-[3.75px] rounded-chip border-[0.93px] border-line bg-surface p-[7.48px] focus-within:border-line-strong"
    >
      <label className="sr-only" htmlFor="composer-input">
        Message
      </label>
      <textarea
        id="composer-input"
        rows={1}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) handleSubmit(event);
        }}
        placeholder="Type something...."
        className="scroll-thin w-full resize-none bg-transparent px-[14.97px] py-[11.23px] text-body text-ink placeholder:text-ink-subtle focus:outline-none"
      />

      <div className="flex items-center gap-[3.75px]">
        <IconButton label="Attach image">
          <ComposerImageIcon className="size-[18.72px]" />
        </IconButton>
        <IconButton label="Attach video">
          <ComposerVideoIcon className="size-[18.72px]" />
        </IconButton>
        <IconButton label="Insert saved reply">
          <ComposerNoteIcon className="size-[18.72px]" />
        </IconButton>
        <IconButton label="Insert emoji">
          <ComposerEmojiIcon className="size-[18.72px]" />
        </IconButton>
        <IconButton label="Reply">
          <ComposerReplyIcon className="size-[18.72px]" />
        </IconButton>

        <div className="ml-auto flex items-center gap-[3.75px]">
          <IconButton label="Generate with AI">
            <ComposerBoltIcon className="size-[18.72px]" />
          </IconButton>
          <IconButton
            label="Send message"
            type="submit"
            disabled={!trimmed}
            variant={trimmed ? "solid" : "ghost"}
          >
            <ComposerMicIcon className="size-[18.72px]" />
          </IconButton>
        </div>
      </div>
    </form>
  );
}
