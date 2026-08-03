import { CheckDoubleIcon } from "@/components/icons";
import { formatClock } from "@/lib/format";
import type { Message } from "@/types";

/** Renders bare URLs in a message body as links, as in the Figma thread. */
function withLinks(body: string) {
  return body.split(/(\bhttps?:\/\/\S+|\bwww\.\S+)/gi).map((part, index) => {
    if (!/^(https?:\/\/|www\.)/i.test(part)) return part;
    const href = part.startsWith("http") ? part : `https://${part}`;
    return (
      <a
        key={index}
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className="underline underline-offset-2"
      >
        {part}
      </a>
    );
  });
}

export function MessageBubble({ message }: { message: Message }) {
  const outbound = message.direction === "outbound";

  /*
   * Frame values divided by the 0.75 export scale:
   *   bubble  5.61 padding, 8.42 radius, 9.82px w457 #000000, 143% leading
   *   time    7.02px w457 #000000, 5.61 from the bubble, outside it
   *   width   210.53 of the 442.11 column
   */
  return (
    <li
      className={`flex items-start gap-[7.48px] ${
        outbound ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <p
        className={`max-w-[47.6%] rounded-shell p-[7.48px] text-body leading-[143%] wrap-break-word text-ink ${
          outbound ? "bg-bubble-out" : "bg-bubble-in"
        }`}
      >
        {withLinks(message.body)}
      </p>

      {/* Timestamp sits outside the bubble in the design. */}
      <span className="flex flex-col items-center gap-0.5 pt-[7.48px]">
        <time
          dateTime={message.sentAt}
          className="text-micro whitespace-nowrap text-ink tabular-nums"
        >
          {formatClock(new Date(message.sentAt))}
        </time>
        {outbound && message.read && (
          <CheckDoubleIcon className="size-3 text-tick" />
        )}
      </span>
    </li>
  );
}
