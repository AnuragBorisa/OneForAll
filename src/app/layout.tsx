import type { Metadata } from "next";
import { getActivePreset } from "@/server/settings/settings";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const preset = await getActivePreset();

  return {
    title: preset.appTitle,
    description: preset.homeDescription,
    icons: {
      icon: [
        { url: "/icon.svg", type: "image/svg+xml" }
      ],
      shortcut: ["/icon.svg"],
      apple: ["/icon.svg"]
    }
  };
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const preset = await getActivePreset();

  return (
    <html lang="en">
      <body className="app-shell">
        <div className="app-noise" />
        <header
          className="app-header"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid var(--border)"
          }}
        >
          <nav
            className="app-nav"
            style={{
              maxWidth: 1080,
              margin: "0 auto",
              padding: "14px 24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap"
            }}
          >
            <a
              href="/"
              style={{ fontWeight: 700, textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase" }}
            >
              {preset.appTitle}
            </a>
            <div className="app-nav-links" style={{ display: "flex", gap: 14, flexWrap: "wrap", color: "var(--muted)" }}>
              <a href="/feed">Feed</a>
              <a href="/saved">Saved</a>
              <a href="/feed/digest">Digest</a>
              <a href="/settings">Settings</a>
            </div>
          </nav>
        </header>
        <div className="page-transition">{children}</div>
      </body>
    </html>
  );
}
