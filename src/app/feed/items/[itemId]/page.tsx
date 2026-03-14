import { ExplanationBlock } from "@/components/explanation-block";
import { DetailedExplanationPanel } from "@/components/detailed-explanation-panel";
import { SourceBadge } from "@/components/source-badge";
import { getItemDetail } from "@/server/detail/get-item-detail";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ItemDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ itemId: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { itemId } = await params;
  const resolvedSearchParams = (await searchParams) ?? {};
  const view = typeof resolvedSearchParams.view === "string" ? resolvedSearchParams.view : null;
  const detail = await getItemDetail(itemId);

  if (!detail) {
    notFound();
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "48px 24px 80px"
      }}
    >
      <section
        style={{
          maxWidth: 900,
          margin: "0 auto",
          display: "grid",
          gap: 22
        }}
      >
        <div
          className="page-hero"
          style={{
            display: "grid",
            gap: 12,
            padding: 32,
            borderRadius: 32,
            background: "var(--surface)"
          }}
        >
          <SourceBadge source={detail.item.source} />
          <h1 style={{ margin: 0, fontSize: "clamp(2.2rem, 6vw, 4.2rem)", lineHeight: 0.96 }}>
            {detail.item.title}
          </h1>
          <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>
            {detail.item.author ? `By ${detail.item.author}` : "Author unavailable"} •{" "}
            <a href={detail.item.sourceUrl} target="_blank" rel="noreferrer">
              Open original source
            </a>
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <form action={`/api/items/${detail.item.id}/save`} method="post">
              <button
                className="secondary-button"
                type="submit"
                style={{
                  width: "fit-content",
                  padding: "10px 16px",
                  color: "var(--accent-strong)",
                  font: "inherit",
                  cursor: "pointer",
                  textDecoration: "none"
                }}
              >
                Save for later
              </button>
            </form>
            <a
              href={`/feed/items/${detail.item.id}?view=detailed`}
              className="secondary-button"
              style={{ fontWeight: 700, textDecoration: "none" }}
            >
              Open detailed explanation
            </a>
          </div>
        </div>

        <ExplanationBlock explanation={detail.explanation} />
        <DetailedExplanationPanel
          itemId={detail.item.id}
          initialExplanation={detail.detailedExplanation}
          autoLoad={view === "detailed"}
        />
      </section>
    </main>
  );
}
