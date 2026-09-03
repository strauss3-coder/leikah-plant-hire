/**
 * Emits supabase/migrations/0004_seed.sql from the TypeScript seed graph, so
 * the database and the fallback content can never drift apart — regenerate
 * rather than hand-editing the SQL.
 *
 * Run: npm run seed:sql
 */
import { writeFileSync, readFileSync } from "node:fs";
import path from "node:path";
import { seedContent } from "../src/content/seed";

const OUT = path.resolve(process.cwd(), "supabase/migrations/0004_seed.sql");

/** Postgres string literal, using dollar quoting to survive any content. */
function lit(value: string) {
  return `$seed$${value}$seed$`;
}

function jsonb(value: unknown) {
  return `${lit(JSON.stringify(value))}::jsonb`;
}

interface CollectionSpec {
  table: string;
  /** Typed seed arrays widen to this; each row is narrowed on use. */
  rows: readonly object[];
  /** Field on the row that becomes the `slug` column, if any. */
  slugField?: string;
}

const COLLECTIONS: CollectionSpec[] = [
  { table: "content_divisions", rows: seedContent.divisions, slugField: "key" },
  { table: "content_services", rows: seedContent.services, slugField: "slug" },
  { table: "content_fleet", rows: seedContent.fleet, slugField: "slug" },
  { table: "content_industries", rows: seedContent.industries, slugField: "slug" },
  { table: "content_projects", rows: seedContent.projects, slugField: "slug" },
  { table: "content_testimonials", rows: seedContent.testimonials },
  { table: "content_faqs", rows: seedContent.faqs },
  { table: "content_gallery", rows: seedContent.gallery },
  { table: "content_clients", rows: seedContent.clients },
  { table: "content_documents", rows: seedContent.documents },
  { table: "content_news", rows: seedContent.news, slugField: "slug" },
  { table: "content_careers", rows: seedContent.careers, slugField: "slug" },
  { table: "content_departments", rows: seedContent.departments },
  { table: "content_staff", rows: seedContent.staff },
];

const lines: string[] = [];

lines.push(`-- ============================================================================
-- SEED CONTENT
--
-- GENERATED FILE — do not edit by hand.
-- Regenerate with:  npm run seed:sql
--
-- Source of truth is src/content/seed/*.ts, which is also what the site renders
-- when Supabase is not connected. Running this migration puts the database in
-- exactly that state.
--
-- Every statement is idempotent: rows are keyed on slug where one exists, so
-- re-running refreshes content rather than duplicating it. Rows edited in the
-- portal WILL be overwritten by a re-run — that is the intended behaviour for a
-- seed, and the reason it is a separate migration you choose to apply.
-- ============================================================================
`);

for (const { table, rows, slugField } of COLLECTIONS) {
  lines.push(`\n-- ---------------------------------------------------------------------------`);
  lines.push(`-- ${table} (${rows.length} row${rows.length === 1 ? "" : "s"})`);
  lines.push(`-- ---------------------------------------------------------------------------\n`);

  if (!rows.length) {
    lines.push(
      `-- Intentionally empty. See src/content/seed/editorial.ts for why this\n-- collection ships with no rows.\n`,
    );
    continue;
  }

  for (const entry of rows) {
    const row = entry as Record<string, unknown>;
    const slug = slugField ? String(row[slugField] ?? "") : null;
    const sort = typeof row.order === "number" ? row.order : 0;

    // `id`, `slug` and `order` live in columns; strip them from the payload so
    // there is exactly one place each value is stored.
    const payload: Record<string, unknown> = { ...row };
    delete payload.id;
    delete payload.order;
    if (slugField) delete payload[slugField];

    if (slug) {
      lines.push(
        `insert into ${table} (slug, sort, status, data)\nvalues (${lit(slug)}, ${sort}, 'published', ${jsonb(payload)})\non conflict (slug) where slug is not null and deleted_at is null\ndo update set sort = excluded.sort, status = excluded.status, data = excluded.data;\n`,
      );
    } else {
      // No natural key, so the seed stamps one into the payload. Re-running
      // then updates the same row instead of inserting a duplicate.
      const seedKey = String(row.id ?? `${table}-${sort}`);
      payload.seedKey = seedKey;
      lines.push(
        `insert into ${table} (sort, status, data)\nselect ${sort}, 'published', ${jsonb(payload)}\nwhere not exists (select 1 from ${table} where data->>'seedKey' = ${lit(seedKey)});\n`,
      );
      lines.push(
        `update ${table} set sort = ${sort}, data = ${jsonb(payload)}\nwhere data->>'seedKey' = ${lit(seedKey)} and deleted_at is null;\n`,
      );
    }
  }
}

/* --- Singletons ----------------------------------------------------------- */

lines.push(`\n-- ---------------------------------------------------------------------------`);
lines.push(`-- Singletons`);
lines.push(`-- ---------------------------------------------------------------------------\n`);

const singletons: Record<string, unknown> = {
  business: seedContent.business,
  home: seedContent.home,
  about: seedContent.about,
  safety: seedContent.safety,
  pages: seedContent.pages,
};

for (const [key, value] of Object.entries(singletons)) {
  lines.push(
    `insert into content_singletons (key, data)\nvalues (${lit(key)}, ${jsonb(value)})\non conflict (key) do update set data = excluded.data;\n`,
  );
}

/* --- Media library --------------------------------------------------------- */

lines.push(`\n-- ---------------------------------------------------------------------------`);
lines.push(`-- Media library — mirrors the generated manifest`);
lines.push(`-- ---------------------------------------------------------------------------\n`);

const manifest = JSON.parse(
  readFileSync(path.resolve(process.cwd(), "src/content/media-manifest.json"), "utf8"),
) as Record<
  string,
  { slug: string; title: string; alt: string; tags: string[]; width: number; height: number; blurDataURL: string }
>;

let mediaSort = 0;
for (const asset of Object.values(manifest)) {
  mediaSort += 1;
  lines.push(
    `insert into media_assets (slug, title, alt, tags, storage_path, mime_type, width, height, blur_data_url, sort)\nvalues (${lit(asset.slug)}, ${lit(asset.title)}, ${lit(asset.alt)}, ${lit(`{${asset.tags.join(",")}}`)}::text[], ${lit(`/media/${asset.slug}`)}, 'image/webp', ${asset.width}, ${asset.height}, ${lit(asset.blurDataURL)}, ${mediaSort})\non conflict (slug) do update set title = excluded.title, alt = excluded.alt, tags = excluded.tags, width = excluded.width, height = excluded.height, blur_data_url = excluded.blur_data_url;\n`,
  );
}

/* --- Settings -------------------------------------------------------------- */

lines.push(`\n-- ---------------------------------------------------------------------------`);
lines.push(`-- Default settings`);
lines.push(`-- ---------------------------------------------------------------------------\n`);

const settings: { key: string; value: unknown; description: string }[] = [
  {
    key: "seo.defaults",
    value: {
      titleTemplate: "%s — Leikah Plant Hire",
      defaultTitle: "Leikah Plant Hire — Plant Hire, Earthmoving & Heavy Mechanical | Middelburg",
      defaultDescription: seedContent.business.summary,
    },
    description: "Fallback title and description for pages with no SEO override.",
  },
  {
    key: "appearance",
    value: { accent: "#eda91b", ground: "#07090c", preloader: true, pageTransitions: true },
    description: "Brand accent and motion switches applied across the public site.",
  },
  {
    key: "features",
    value: { testimonials: true, news: true, careers: true, gallery: true, documents: true },
    description: "Section switches. Turning one off hides it everywhere it appears.",
  },
  {
    key: "notifications",
    value: { quoteRecipients: [seedContent.business.quotesEmail], contactRecipients: [seedContent.business.email] },
    description: "Where enquiry notifications are sent once email delivery is connected.",
  },
];

for (const setting of settings) {
  lines.push(
    `insert into site_settings (key, value, description)\nvalues (${lit(setting.key)}, ${jsonb(setting.value)}, ${lit(setting.description)})\non conflict (key) do update set value = excluded.value, description = excluded.description;\n`,
  );
}

writeFileSync(OUT, lines.join("\n"));
console.log(`Wrote ${OUT}`);
console.log(
  `  ${COLLECTIONS.reduce((n, c) => n + c.rows.length, 0)} content rows, ` +
    `${Object.keys(singletons).length} singletons, ${Object.keys(manifest).length} media assets, ` +
    `${settings.length} settings`,
);
