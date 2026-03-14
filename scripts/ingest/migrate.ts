import { closeDb, getPool } from "@/server/db/client";

async function main() {
  const pool = getPool();
  const statements = [
    `DO $$ BEGIN
      CREATE TYPE source_family AS ENUM ('x', 'reddit', 'youtube', 'rss');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;`,
    `DO $$ BEGIN
      CREATE TYPE content_type AS ENUM ('news', 'workflow', 'tutorial', 'launch', 'discussion', 'official_announcement');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;`,
    `DO $$ BEGIN
      CREATE TYPE processing_state AS ENUM ('normalized', 'classified', 'clustered', 'explained', 'published', 'failed');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;`,
    `DO $$ BEGIN
      CREATE TYPE fetch_status AS ENUM ('pending', 'fetched', 'failed');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;`,
    `DO $$ BEGIN
      CREATE TYPE explanation_quality AS ENUM ('generated', 'publishable', 'needs_review', 'reprocess_required');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;`,
    `DO $$ BEGIN
      CREATE TYPE digest_delivery AS ENUM ('pending', 'generated', 'delivered', 'failed');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;`,
    `CREATE TABLE IF NOT EXISTS source_items (
      id text PRIMARY KEY,
      source source_family NOT NULL,
      source_item_id text NOT NULL,
      source_url text NOT NULL,
      author_name text,
      author_handle text,
      published_at timestamptz,
      fetched_at timestamptz NOT NULL,
      title text,
      raw_text text,
      raw_payload jsonb NOT NULL,
      media_refs jsonb NOT NULL DEFAULT '[]'::jsonb,
      engagement_signals jsonb NOT NULL DEFAULT '{}'::jsonb,
      fetch_status fetch_status NOT NULL DEFAULT 'pending'
    );`,
    `CREATE UNIQUE INDEX IF NOT EXISTS source_items_source_item_unique
      ON source_items (source, source_item_id);`,
    `CREATE TABLE IF NOT EXISTS feed_items (
      id text PRIMARY KEY,
      primary_source_item_id text NOT NULL REFERENCES source_items(id),
      canonical_url text NOT NULL,
      title text NOT NULL,
      summary_excerpt text,
      normalized_text text NOT NULL,
      content_type content_type NOT NULL,
      topic_tags jsonb NOT NULL DEFAULT '[]'::jsonb,
      published_at timestamptz,
      source_attribution jsonb NOT NULL,
      processing_state processing_state NOT NULL DEFAULT 'normalized',
      is_publishable boolean NOT NULL DEFAULT false
    );`,
    `CREATE INDEX IF NOT EXISTS feed_items_published_at_idx ON feed_items (published_at DESC);`,
    `CREATE TABLE IF NOT EXISTS explanation_blocks (
      id text PRIMARY KEY,
      feed_item_id text NOT NULL REFERENCES feed_items(id),
      simple_explanation text NOT NULL,
      why_it_matters text NOT NULL,
      example text,
      use_cases jsonb NOT NULL DEFAULT '[]'::jsonb,
      who_should_care jsonb NOT NULL DEFAULT '[]'::jsonb,
      try_it_next text NOT NULL,
      credibility_notes text,
      generation_version text NOT NULL,
      quality_status explanation_quality NOT NULL DEFAULT 'generated',
      generated_at timestamptz NOT NULL
    );`,
    `CREATE UNIQUE INDEX IF NOT EXISTS explanation_blocks_feed_item_id_idx
      ON explanation_blocks (feed_item_id);`,
    `CREATE TABLE IF NOT EXISTS detailed_explanations (
      id text PRIMARY KEY,
      feed_item_id text NOT NULL REFERENCES feed_items(id),
      what_happened text NOT NULL,
      key_points jsonb NOT NULL DEFAULT '[]'::jsonb,
      why_it_matters text NOT NULL,
      practical_takeaways jsonb NOT NULL DEFAULT '[]'::jsonb,
      risks_and_unknowns jsonb NOT NULL DEFAULT '[]'::jsonb,
      next_steps jsonb NOT NULL DEFAULT '[]'::jsonb,
      source_limits text,
      generation_version text NOT NULL,
      quality_status explanation_quality NOT NULL DEFAULT 'generated',
      generated_at timestamptz NOT NULL
    );`,
    `CREATE UNIQUE INDEX IF NOT EXISTS detailed_explanations_feed_item_id_idx
      ON detailed_explanations (feed_item_id);`,
    `CREATE TABLE IF NOT EXISTS daily_digests (
      id text PRIMARY KEY,
      user_id text NOT NULL,
      digest_date timestamptz NOT NULL,
      title text NOT NULL,
      summary_intro text,
      entry_count integer NOT NULL DEFAULT 0,
      delivery_status digest_delivery NOT NULL DEFAULT 'pending',
      generated_at timestamptz NOT NULL
    );`,
    `CREATE TABLE IF NOT EXISTS digest_entries (
      id text PRIMARY KEY,
      daily_digest_id text NOT NULL REFERENCES daily_digests(id),
      feed_item_id text NOT NULL REFERENCES feed_items(id),
      position integer NOT NULL,
      short_summary text NOT NULL,
      reason_selected text
    );`,
    `CREATE TABLE IF NOT EXISTS saved_items (
      user_id text NOT NULL,
      feed_item_id text NOT NULL REFERENCES feed_items(id),
      saved_at timestamptz NOT NULL,
      PRIMARY KEY (user_id, feed_item_id)
    );`,
    `CREATE INDEX IF NOT EXISTS saved_items_saved_at_idx ON saved_items (saved_at DESC);`,
    `CREATE TABLE IF NOT EXISTS app_settings (
      key text PRIMARY KEY,
      value text,
      updated_at timestamptz NOT NULL
    );`
  ];

  for (const statement of statements) {
    await pool.query(statement);
  }

  console.log("Database schema is up to date.");
  await closeDb();
}

main().catch(async (error) => {
  console.error("Migration bootstrap failed", error);
  await closeDb();
  process.exit(1);
});
