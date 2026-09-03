import "server-only";
import { getServerSupabase } from "@/lib/supabase/server";
import { seedContent } from "@/content/seed";
import { COLLECTIONS, type CollectionKey } from "./schema";
import type { Option } from "@/components/portal/Fields";

/* ============================================================================
   PORTAL READS

   Unlike the public site, the portal shows drafts and archived rows — it needs
   the whole table, not the published slice.

   When Supabase is not connected the portal falls back to the seed graph in
   read-only form. That lets whoever is setting the project up walk through
   every screen and see the real content before the database exists; the editors
   simply cannot save, and they say so.
   ========================================================================= */

export interface PortalRow {
  id: string;
  slug: string | null;
  sort: number;
  status: "draft" | "published" | "archived";
  data: Record<string, unknown>;
  updated_at?: string;
  deleted_at?: string | null;
}

/** Seed rows, shaped like database rows so one code path renders both. */
function seedRows(collection: CollectionKey): PortalRow[] {
  const def = COLLECTIONS[collection];
  const items = (seedContent as unknown as Record<string, unknown[]>)[collection] ?? [];

  return items.map((item, index) => {
    const record = item as Record<string, unknown>;
    const data = { ...record };
    delete data.id;
    delete data.order;

    return {
      id: String(record.id ?? `seed-${collection}-${index}`),
      slug: def.slugField ? ((record[def.slugField] as string) ?? null) : null,
      sort: typeof record.order === "number" ? record.order : index,
      status: "published" as const,
      data,
      deleted_at: null,
    };
  });
}

export async function listCollection(
  collection: CollectionKey,
  { includeDeleted = false }: { includeDeleted?: boolean } = {},
): Promise<{ rows: PortalRow[]; live: boolean }> {
  const def = COLLECTIONS[collection];
  const supabase = await getServerSupabase();
  if (!supabase) return { rows: seedRows(collection), live: false };

  let query = supabase
    .from(def.table)
    .select("id, slug, sort, status, data, updated_at, deleted_at")
    .order("sort", { ascending: true });

  if (!includeDeleted) query = query.is("deleted_at", null);

  const { data, error } = await query;
  if (error) {
    console.error(`[portal] failed to list ${collection}`, error.message);
    return { rows: seedRows(collection), live: false };
  }

  return { rows: (data ?? []) as PortalRow[], live: true };
}

export async function getCollectionItem(
  collection: CollectionKey,
  id: string,
): Promise<{ row: PortalRow | null; live: boolean }> {
  const def = COLLECTIONS[collection];
  const supabase = await getServerSupabase();

  if (!supabase) {
    const row = seedRows(collection).find((r) => r.id === id) ?? null;
    return { row, live: false };
  }

  const { data, error } = await supabase
    .from(def.table)
    .select("id, slug, sort, status, data, updated_at, deleted_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error(`[portal] failed to load ${collection}/${id}`, error.message);
    return { row: null, live: true };
  }

  return { row: (data as PortalRow) ?? null, live: true };
}

export async function getSingletonData(
  key: string,
): Promise<{ data: Record<string, unknown>; live: boolean }> {
  const supabase = await getServerSupabase();
  const fallback = (seedContent as unknown as Record<string, Record<string, unknown>>)[key] ?? {};

  if (!supabase) return { data: fallback, live: false };

  const { data, error } = await supabase
    .from("content_singletons")
    .select("data")
    .eq("key", key)
    .maybeSingle();

  if (error || !data?.data) return { data: fallback, live: !error };
  return { data: data.data as Record<string, unknown>, live: true };
}

/**
 * Option lists for select and multiselect fields that reference another
 * collection. Loaded once per editor render and passed down, so a field with
 * fifty options does not issue fifty queries.
 */
export async function loadRelationOptions(): Promise<Record<string, Option[]>> {
  const keys: CollectionKey[] = ["services", "industries", "projects", "testimonials", "fleet"];
  const entries = await Promise.all(
    keys.map(async (key) => {
      const def = COLLECTIONS[key];
      const { rows } = await listCollection(key);
      const options: Option[] = rows
        .filter((row) => !row.deleted_at)
        .map((row) => ({
          value: (row.slug ?? row.id) as string,
          label: String(row.data[def.titleField] ?? row.slug ?? row.id),
        }));
      return [key, options] as const;
    }),
  );

  // Testimonials are referenced by row id rather than by slug.
  const map = Object.fromEntries(entries) as Record<string, Option[]>;
  const { rows: testimonialRows } = await listCollection("testimonials");
  map.testimonials = testimonialRows.map((row) => ({
    value: row.id,
    label: `${row.data.author ?? "Unnamed"} — ${row.data.company ?? ""}`.trim(),
  }));

  return map;
}
