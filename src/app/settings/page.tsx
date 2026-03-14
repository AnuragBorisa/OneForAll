import Link from "next/link";
import { getSettingsForDisplay, getRuntimeSettings } from "@/server/settings/settings";
import { isAdminAuthenticated, isAdminProtectionEnabled } from "@/server/auth/admin";
import { getContentPreset } from "@/server/settings/presets";

export const dynamic = "force-dynamic";

function getValue(
  settings: Array<{ key: string; value: string; source: string }>,
  key: string
): string {
  return settings.find((item) => item.key === key)?.value ?? "";
}

function Field({
  label,
  name,
  value,
  type = "text",
  placeholder
}: {
  label: string;
  name: string;
  value: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="settings-field" style={{ display: "grid", gap: 8 }}>
      <span style={{ fontWeight: 600 }}>{label}</span>
      <input
        name={name}
        defaultValue={value}
        type={type}
        placeholder={placeholder}
        style={{
          padding: "12px 14px",
          borderRadius: 14,
          border: "1px solid var(--border)",
          background: "rgba(var(--surface-rgb), 0.28)",
          font: "inherit"
        }}
      />
    </label>
  );
}

export default async function SettingsPage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedParams = (await searchParams) ?? {};
  const saved = resolvedParams.saved === "1";
  const authError = resolvedParams.auth === "1";
  const isProtected = isAdminProtectionEnabled();
  const isAuthorized = await isAdminAuthenticated();

  if (isProtected && !isAuthorized) {
    return (
      <main style={{ minHeight: "100vh", padding: "48px 24px 80px" }}>
        <section style={{ maxWidth: 560, margin: "0 auto", display: "grid", gap: 20 }}>
          <div className="page-hero" style={{ display: "grid", gap: 10, padding: 32, borderRadius: 32 }}>
            <h1 style={{ margin: 0, fontSize: "clamp(2.1rem, 6vw, 4rem)" }}>Admin access</h1>
            <p style={{ margin: 0, color: "var(--muted)" }}>
              Settings are protected on this deployment. Enter the admin password to manage
              sources, provider keys, and product configuration.
            </p>
          </div>

          <form
            action="/api/admin/login"
            method="post"
            className="page-section"
            style={{ display: "grid", gap: 18, padding: 24, borderRadius: 24 }}
          >
            <input type="hidden" name="next" value="/settings" />
            <Field label="Admin password" name="password" type="password" value="" />
            {authError ? (
              <p style={{ margin: 0, color: "#ff8f8f" }}>Incorrect password. Try again.</p>
            ) : null}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button className="primary-button" type="submit" style={{ cursor: "pointer" }}>
                Unlock settings
              </button>
              <Link className="secondary-button" href="/" style={{ textDecoration: "none" }}>
                Back home
              </Link>
            </div>
          </form>
        </section>
      </main>
    );
  }

  const settings = await getSettingsForDisplay();
  const runtimeSettings = await getRuntimeSettings();
  const activePreset = getContentPreset(runtimeSettings.contentPreset);

  return (
    <main style={{ minHeight: "100vh", padding: "48px 24px 80px" }}>
      <section style={{ maxWidth: 960, margin: "0 auto", display: "grid", gap: 20 }}>
        <div
          className="page-hero"
          style={{
            display: "grid",
            gap: 10,
            padding: 32,
            borderRadius: 32
          }}
        >
          <h1 style={{ margin: 0, fontSize: "clamp(2.1rem, 6vw, 4rem)" }}>Settings</h1>
            <p style={{ margin: 0, color: "var(--muted)", maxWidth: 760 }}>
              Configure live sources and explanation models from the product UI. OpenAI-compatible
              endpoints work here too, including local or open-source-hosted providers.
            </p>
            {saved ? <strong style={{ color: "var(--accent)" }}>Settings saved.</strong> : null}
            {isProtected ? (
              <form action="/api/admin/logout" method="post">
                <button className="secondary-button" type="submit" style={{ cursor: "pointer" }}>
                  Log out
                </button>
              </form>
            ) : null}
          </div>

        <form
          action="/api/settings/preset"
          method="post"
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap"
          }}
        >
          <input type="hidden" name="preset" value="ai" />
          <button
            className="secondary-button"
            type="submit"
            style={{
              padding: "12px 18px",
              background: activePreset.id === "ai" ? "var(--accent-soft)" : "var(--surface-plain)",
              color: "var(--accent-strong)",
              font: "inherit",
              cursor: "pointer"
            }}
          >
            Use AI preset
          </button>
        </form>

        <form
          action="/api/settings/preset"
          method="post"
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap"
          }}
        >
          <input type="hidden" name="preset" value="quantum" />
          <button
            className="secondary-button"
            type="submit"
            style={{
              padding: "12px 18px",
              background:
                activePreset.id === "quantum" ? "var(--accent-soft)" : "var(--surface-plain)",
              color: "var(--accent-strong)",
              font: "inherit",
              cursor: "pointer"
            }}
          >
            Use Quantum preset
          </button>
        </form>

        <form
          action="/api/settings"
          method="post"
          className="page-section"
          style={{
            display: "grid",
            gap: 20,
            padding: 24,
            borderRadius: 24,
            background: "var(--surface-soft)"
          }}
        >
          <section style={{ display: "grid", gap: 14 }}>
            <h2 style={{ margin: 0 }}>Content preset</h2>
            <p style={{ margin: 0, color: "var(--muted)" }}>
              Active preset: <strong>{activePreset.label}</strong>. Presets set sensible defaults for
              feeds, Reddit sources, and the X query. You can still edit any field below afterward.
            </p>
            {activePreset.id === "quantum" ? (
              <p style={{ margin: 0, color: "var(--muted)" }}>
                Quantum preset defaults now emphasize research, hardware, software stacks, industry
                updates, and error-correction signals. Reapply the preset if you want to overwrite
                older Quantum source values with the newer pack.
              </p>
            ) : null}
          </section>

          <section style={{ display: "grid", gap: 14 }}>
            <h2 style={{ margin: 0 }}>Explanation Model</h2>
            <Field
              label="API base URL"
              name="openaiApiBaseUrl"
              value={getValue(settings, "openaiApiBaseUrl")}
              placeholder="https://api.openai.com/v1 or http://localhost:11434/v1"
            />
            <Field
              label="API key"
              name="openaiApiKey"
              type="password"
              value={getValue(settings, "openaiApiKey")}
            />
            <Field
              label="Model"
              name="openaiModel"
              value={getValue(settings, "openaiModel")}
              placeholder="gpt-4.1-mini, qwen2.5:14b-instruct, llama3.1:8b"
            />
            <p style={{ margin: 0, color: "var(--muted)" }}>
              Open-source alternatives that work well through OpenAI-compatible endpoints: `Qwen
              2.5/3 Instruct`, `Llama 3.1 Instruct`, and `Mistral Small/Nemo`.
            </p>
          </section>

          <section style={{ display: "grid", gap: 14 }}>
            <h2 style={{ margin: 0 }}>Sources</h2>
            <Field
              label="RSS feed URLs"
              name="rssFeedUrls"
              value={getValue(settings, "rssFeedUrls")}
              placeholder="https://example.com/feed.xml,https://another.com/rss"
            />
            <Field
              label="Reddit subreddits"
              name="redditSubreddits"
              value={getValue(settings, "redditSubreddits")}
              placeholder="singularity,artificial,LocalLLaMA"
            />
            <Field
              label="Reddit user agent"
              name="redditUserAgent"
              value={getValue(settings, "redditUserAgent")}
              placeholder="ai-feed-dev"
            />
            <Field
              label="YouTube channel IDs"
              name="youtubeChannelIds"
              value={getValue(settings, "youtubeChannelIds")}
              placeholder="UC...,UC..."
            />
            <Field
              label="YouTube feed URLs"
              name="youtubeFeedUrls"
              value={getValue(settings, "youtubeFeedUrls")}
              placeholder="https://www.youtube.com/feeds/videos.xml?channel_id=..."
            />
            <Field
              label="X bearer token"
              name="xBearerToken"
              type="password"
              value={getValue(settings, "xBearerToken")}
            />
            <Field
              label="X search query"
              name="xSearchQuery"
              value={getValue(settings, "xSearchQuery")}
              placeholder="AI OR quantum query"
            />
            <Field
              label="X max results"
              name="xMaxResults"
              value={getValue(settings, "xMaxResults")}
              placeholder="25"
            />
          </section>

          <section style={{ display: "grid", gap: 14 }}>
            <h2 style={{ margin: 0 }}>Ops</h2>
            <Field
              label="Refresh job token"
              name="refreshJobToken"
              type="password"
              value={getValue(settings, "refreshJobToken")}
            />
          </section>

          <button
            type="submit"
            style={{
              width: "fit-content",
              padding: "12px 18px",
              borderRadius: 999,
              border: "1px solid var(--border)",
              background: "var(--accent-gradient)",
              color: "var(--accent-contrast)",
              font: "inherit",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 14px 30px rgba(var(--accent-rgb), 0.18)"
            }}
          >
            Save settings
          </button>
        </form>
      </section>
    </main>
  );
}
