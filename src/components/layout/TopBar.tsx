"use client";

import {
  AiNavIcon,
  CampaignNavIcon,
  ContactsNavIcon,
  InboxNavIcon,
  SettingsNavIcon,
  WorkflowNavIcon,
} from "@/components/icons/figma";
import { IconButton } from "@/components/ui/IconButton";
import { BrandMark } from "./BrandMark";

const TABS = [
  { id: "inbox", label: "Inbox", Icon: InboxNavIcon },
  { id: "contacts", label: "Contacts", Icon: ContactsNavIcon },
  { id: "ai-employees", label: "AI Employees", Icon: AiNavIcon },
  { id: "workflows", label: "Workflows", Icon: WorkflowNavIcon },
  { id: "campaigns", label: "Campaigns", Icon: CampaignNavIcon },
] as const;

/*
 * Frame 1 of the inbox dashboard. Figma hands its values over from a 1200-wide
 * export of a 1600-wide design, so every measurement below is the specced
 * number divided by 0.75:
 *
 *   frame    39.30 tall, 11.23 radius, 11.23/7.02 padding, 5.61 gap
 *   chip     23.86 tall, 5.61 radius, 7.02 side padding, 0.7 border
 *   icon     14.04 box, 10.53 glyph
 *   wordmark Poppins 700 @ 12.63
 */
export function TopBar({ currentUser }: { currentUser: string }) {
  return (
    <header className="flex h-[52.4px] shrink-0 items-center gap-[7.48px] rounded-shell-lg bg-surface px-[14.97px] py-[9.36px] shadow-card">
      <BrandMark />

      <nav aria-label="Primary" className="flex items-center gap-0.5 overflow-x-auto">
        {TABS.map(({ id, label, Icon }, index) => {
          const active = index === 0;

          // The 0.7 stroke sits inside the frame in Figma, so it must not grow
          // the chip — an inset ring, not a border.
          return (
            <button
              key={id}
              type="button"
              aria-current={active ? "page" : undefined}
              className={`flex h-[31.81px] shrink-0 items-center gap-[7.48px] rounded-chip px-[9.36px] text-[13.09px] leading-none font-medium tracking-normal text-black transition-colors focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none ${
                active
                  ? "bg-bubble-in ring-[0.93px] ring-line ring-inset"
                  : "hover:bg-hover"
              }`}
            >
              {/* 14.04 frame, glyph centred inside it — the frame is what the
                  chip's flex row measures, not the glyph. The label stays
                  black on every tab; only the glyph greys out when inactive. */}
              <span className="grid size-[18.71px] shrink-0 place-items-center">
                <Icon
                  className={`size-[14.04px] ${active ? "text-black" : "text-icon-nav"}`}
                />
              </span>
              <span className="hidden sm:inline">{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <IconButton label="Settings">
          <SettingsNavIcon className="size-[14.04px] text-icon-nav" />
        </IconButton>
        <span className="flex items-center gap-2 pl-1">
          <span className="flex size-7 items-center justify-center rounded-full bg-(--color-av-me) text-xs font-semibold text-white">
            {currentUser.charAt(0)}
          </span>
          <span className="hidden text-[13px] font-medium md:inline">
            {currentUser}
          </span>
        </span>
      </div>
    </header>
  );
}
