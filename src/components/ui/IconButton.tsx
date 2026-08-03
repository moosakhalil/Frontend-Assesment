import type { ButtonHTMLAttributes, ReactNode } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Icons carry no text, so a label is required rather than optional. */
  label: string;
  children: ReactNode;
  variant?: "ghost" | "soft" | "solid";
}

/* Soft is the thread header's #EBEBEB chip; solid is its black one. */
const VARIANTS = {
  ghost: "text-ink hover:bg-hover",
  soft: "bg-icon-chip text-ink hover:bg-line",
  solid: "bg-ink text-white hover:bg-ink/90",
} as const;

export function IconButton({
  label,
  children,
  variant = "ghost",
  className = "",
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      /* 22.46 square with 5.61 radius in the frame. */
      className={`inline-flex size-[29.95px] shrink-0 items-center justify-center rounded-chip transition-colors focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 focus-visible:outline-none disabled:opacity-40 ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
