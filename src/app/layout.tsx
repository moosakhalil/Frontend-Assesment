import type { Metadata } from "next";
/*
 * Self-hosted so the app makes no external font request and has no FOUT.
 *
 * The Figma file sets almost every label in SF Compact, which is Apple-
 * licensed and cannot be served on the web. Inter is the stand-in: measured
 * against the nav labels it tracks SF Compact's advance widths ~36% closer
 * than Plus Jakarta Sans did, and the file already uses Inter for 31 of its
 * own text nodes.
 */
import "@fontsource-variable/inter";
// Poppins 700 is the wordmark only — see --font-display.
import "@fontsource/poppins/700.css";
// The loading frame sets its heading in Roboto 700 @ 38px.
import "@fontsource/roboto/700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "BOXpad — Inbox",
  description: "Shared team inbox built for the Favlogix front-end assessment.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full font-sans antialiased">{children}</body>
    </html>
  );
}
