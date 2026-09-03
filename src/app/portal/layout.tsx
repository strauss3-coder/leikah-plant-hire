import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leikah Portal",
  // The portal has nothing worth indexing and everything worth keeping out of
  // a search result, so this is belt and braces alongside robots.txt.
  robots: { index: false, follow: false, nocache: true },
};

export default function PortalRootLayout({ children }: LayoutProps<"/portal">) {
  return <div className="min-h-svh bg-ink-950">{children}</div>;
}
