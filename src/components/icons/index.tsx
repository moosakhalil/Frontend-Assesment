import type { SVGProps } from "react";

/**
 * Hand-rolled 24px stroke icons. A library would pull in a dependency for
 * ~25 glyphs, and the brief asks to avoid unnecessary packages.
 */
type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export const InboxIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 12h4l2 3h6l2-3h4" />
    <path d="M5.5 5h13l2.5 7v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Z" />
  </Icon>
);

export const UserIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
  </Icon>
);

export const UsersIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
    <path d="M16 5.2a3.2 3.2 0 0 1 0 5.6" />
    <path d="M17.5 14.2A6.5 6.5 0 0 1 21.5 20" />
  </Icon>
);

export const UserQuestionIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="10" r="2.6" />
    <path d="M6.6 18.2a6 6 0 0 1 10.8 0" />
  </Icon>
);

export const GlobeIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17" />
    <path d="M12 3.5c2.2 2.4 3.3 5.3 3.3 8.5S14.2 18.1 12 20.5c-2.2-2.4-3.3-5.3-3.3-8.5S9.8 5.9 12 3.5Z" />
  </Icon>
);

export const ChevronDownIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m6 9 6 6 6-6" />
  </Icon>
);

export const ChevronLeftIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m15 6-6 6 6 6" />
  </Icon>
);

export const SearchIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.2-4.2" />
  </Icon>
);

export const SlidersIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 8h11" />
    <path d="M20 8h-2" />
    <path d="M4 16h3" />
    <path d="M20 16H11" />
    <circle cx="16.5" cy="8" r="1.8" />
    <circle cx="8.5" cy="16" r="1.8" />
  </Icon>
);

export const ComposeIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12.5 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-6.5" />
    <path d="M17.6 3.9a1.9 1.9 0 0 1 2.7 2.7L13.4 13.5l-3.4.8.8-3.4Z" />
  </Icon>
);

export const PanelLeftIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="2.2" />
    <path d="M10 4.5v15" />
  </Icon>
);

export const PanelRightIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="2.2" />
    <path d="M14 4.5v15" />
  </Icon>
);

export const KebabIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="5.5" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="12" cy="18.5" r="1.4" fill="currentColor" stroke="none" />
  </Icon>
);

export const MoonIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M20 14.2A8.4 8.4 0 0 1 9.8 4 8.4 8.4 0 1 0 20 14.2Z" />
  </Icon>
);

export const BotIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="4" y="7.5" width="16" height="12" rx="3" />
    <path d="M12 4v3.5" />
    <circle cx="9" cy="13" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="15" cy="13" r="1.2" fill="currentColor" stroke="none" />
  </Icon>
);

export const SparkleIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m12 4 1.7 4.6L18 10.3l-4.3 1.7L12 16.6l-1.7-4.6L6 10.3l4.3-1.7Z" />
    <path d="M18 16.5 18.8 18.6 21 19.4 18.8 20.2 18 22.3 17.2 20.2 15 19.4 17.2 18.6Z" />
  </Icon>
);

export const WorkflowIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="9" y="3.5" width="6" height="5" rx="1.5" />
    <rect x="3" y="15.5" width="6" height="5" rx="1.5" />
    <rect x="15" y="15.5" width="6" height="5" rx="1.5" />
    <path d="M12 8.5v3.5M6 15.5V12h12v3.5" />
  </Icon>
);

export const TargetIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
  </Icon>
);

export const SettingsIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="m12 3 7.5 4.3v9.4L12 21l-7.5-4.3V7.3Z" />
    <circle cx="12" cy="12" r="3" />
  </Icon>
);

export const ImageIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="2.4" />
    <circle cx="8.8" cy="9.5" r="1.6" />
    <path d="m4.5 17 4.6-4.4a2 2 0 0 1 2.7 0l4.4 4.2" />
  </Icon>
);

export const VideoIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3.5" y="5.5" width="17" height="13" rx="2.4" />
    <path d="m10.5 9.8 4.4 2.7-4.4 2.7Z" />
  </Icon>
);

export const NoteIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="2.4" />
    <path d="M7.5 9.5h9M7.5 13h6" />
  </Icon>
);

export const EmojiIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M8.8 14.2a4 4 0 0 0 6.4 0" />
    <circle cx="9.3" cy="10" r="1" fill="currentColor" stroke="none" />
    <circle cx="14.7" cy="10" r="1" fill="currentColor" stroke="none" />
  </Icon>
);

export const ReplyIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M9 7 4 11.5 9 16" />
    <path d="M4 11.5h8.5a6 6 0 0 1 6 6V19" />
  </Icon>
);

export const BoltIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M13.5 3 5.5 13.4h5.4L10 21l8.2-10.6h-5.5Z" />
  </Icon>
);

export const MicIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="9.2" y="3" width="5.6" height="11" rx="2.8" />
    <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0" />
    <path d="M12 18v3" />
  </Icon>
);

export const PlusIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 6v12M6 12h12" />
  </Icon>
);

export const TagIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3.8 11.3V4.5a.7.7 0 0 1 .7-.7h6.8a1 1 0 0 1 .7.3l8 8a1 1 0 0 1 0 1.4l-6.1 6.1a1 1 0 0 1-1.4 0l-8-8a1 1 0 0 1-.7-.3Z" />
    <circle cx="7.8" cy="7.8" r="1.3" fill="currentColor" stroke="none" />
  </Icon>
);

export const CheckDoubleIcon = (p: IconProps) => (
  <Icon {...p} strokeWidth={2.1}>
    <path d="m2.5 12.8 3.6 3.6L14.4 8" />
    <path d="m10.2 16.4 1 1 8.3-8.4" />
  </Icon>
);

export const RefreshIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M20 11a8 8 0 1 0-.6 4" />
    <path d="M20 4.5V11h-6.5" />
  </Icon>
);

export const AlertIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.8v5" />
    <circle cx="12" cy="16" r="1" fill="currentColor" stroke="none" />
  </Icon>
);

export const WhatsAppIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2s-1.2.3-3.9-.9-4.2-3.9-4.3-4.1c-.2-.2-1-1.3-1-2.5s.6-1.8.9-2c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .6l-.4.5c-.1.2-.3.3-.1.6.2.3.7 1.2 1.6 2 1.1.9 1.6 1.1 1.9 1.3.2.1.4.1.5-.1l.7-.9c.2-.2.3-.2.6-.1l1.9.9c.3.1.4.2.5.3.1.2.1.6-.1 1.1Z" />
  </svg>
);

export const InstagramIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="3.8" />
    <circle cx="17" cy="7" r="1.1" fill="currentColor" stroke="none" />
  </Icon>
);
