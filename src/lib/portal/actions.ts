"use server";

import { revalidatePath } from "next/cache";
import { getServerSupabase } from "@/lib/supabase/server";
import { requirePortalSession } from "./auth";
import { COLLECTIONS, SINGLETONS, type CollectionKey } from "./schema";

/* ============================================================================
   PORTAL WRITE ACTIONS

   Every action goes through the *user's* Supabase client, not the service role,
   so row-level security is the last word on whether a write is allowed. The
   role check here is for a clear error message; the database is the enforcement.

   Deletes are soft by default. `deleted_at` is set and the row disappears from
   both the site and the portal's default view, but it is still recoverable.
   ========================================================================= */

export interface PortalResult {
  ok: boolean;
  message: string;
  id?: string;
}

/** Public routes a collection appears on, so an edit invalidates the right pages. */
const REVALIDATE: Record<CollectionKey | string, string[]> = {
  services: ["/", "/services", "/maintenance", "/supply", "/emergency", "/industries", "/quote"],
  divisions: ["/", "/about", "/services"],
  industries: ["/", "/industries", "/services", "/quote"],
  projects: ["/", "/projects", "/industries"],
  testimonials: ["/", "/testimonials", "/projects"],
  faqs: ["/faq", "/services"],
  gallery: ["/gallery", "/services", "/projects"],
  clients: ["/"],
  documents: ["/health-safety"],
  news: ["/news"],
  careers: ["/careers"],
  departments: ["/contact"],
  staff: ["/about"],
  business: ["/", "/contact", "/about", "/emergency", "/supply"],
  home: ["/"],
  about: ["/about"],
  safety: ["/health-safety", "/"],
  pages: ["/"],
};

function revalidate(key: string) {
  const paths = REVALIDATE[key] ?? ["/"];
  for (const path of paths) {
    revalidatePath(path, "page");
  }
  // Detail routes are prerendered per slug; the layout-level revalidate covers
  // every one of them in a single call.
  revalidatePath("/", "layout");
}

/* --- Collections -------------------------------------------------------------- */

export async function saveCollectionItem({
  collection,
  id,
  data,
  slug,
  sort,
  status,
}: {
  collection: CollectionKey;
  id?: string;
  data: Record<string, unknown>;
  slug?: string | null;
  sort?: number;
  status?: "draft" | "published" | "archived";
}): Promise<PortalResult> {
  await requirePortalSession("editor");
  const def = COLLECTIONS[collection];
  if (!def) return { ok: false, message: "Unknown collection." };

  const supabase = await getServerSupabase();
  if (!supabase) return { ok: false, message: "The database is not connected." };

  const row = {
    data,
    slug: slug || null,
    sort: sort ?? 0,
    status: status ?? "draft",
  };

  if (id) {
    const { error } = await supabase.from(def.table).update(row).eq("id", id);
    if (error) return { ok: false, message: friendly(error.message) };
    revalidate(collection);
    return { ok: true, message: `${def.singular} saved.`, id };
  }

  const { data: inserted, error } = await supabase
    .from(def.table)
    .insert(row)
    .select("id")
    .single();

  if (error) return { ok: false, message: friendly(error.message) };
  revalidate(collection);
  return { ok: true, message: `${def.singular} created.`, id: inserted.id as string };
}

export async function setItemStatus({
  collection,
  id,
  status,
}: {
  collection: CollectionKey;
  id: string;
  status: "draft" | "published" | "archived";
}): Promise<PortalResult> {
  await requirePortalSession("editor");
  const def = COLLECTIONS[collection];
  const supabase = await getServerSupabase();
  if (!supabase) return { ok: false, message: "The database is not connected." };

  const { error } = await supabase.from(def.table).update({ status }).eq("id", id);
  if (error) return { ok: false, message: friendly(error.message) };

  revalidate(collection);
  return {
    ok: true,
    message: status === "published" ? `${def.singular} is now live.` : `${def.singular} taken offline.`,
  };
}

export async function softDeleteItem({
  collection,
  id,
}: {
  collection: CollectionKey;
  id: string;
}): Promise<PortalResult> {
  await requirePortalSession("editor");
  const def = COLLECTIONS[collection];
  const supabase = await getServerSupabase();
  if (!supabase) return { ok: false, message: "The database is not connected." };

  const { error } = await supabase
    .from(def.table)
    .update({ deleted_at: new Date().toISOString(), status: "archived" })
    .eq("id", id);

  if (error) return { ok: false, message: friendly(error.message) };
  revalidate(collection);
  return { ok: true, message: `${def.singular} removed. It can be restored from the archive.` };
}

export async function restoreItem({
  collection,
  id,
}: {
  collection: CollectionKey;
  id: string;
}): Promise<PortalResult> {
  await requirePortalSession("editor");
  const def = COLLECTIONS[collection];
  const supabase = await getServerSupabase();
  if (!supabase) return { ok: false, message: "The database is not connected." };

  const { error } = await supabase
    .from(def.table)
    .update({ deleted_at: null, status: "draft" })
    .eq("id", id);

  if (error) return { ok: false, message: friendly(error.message) };
  revalidate(collection);
  return { ok: true, message: `${def.singular} restored as a draft.` };
}

export async function reorderItems({
  collection,
  order,
}: {
  collection: CollectionKey;
  order: { id: string; sort: number }[];
}): Promise<PortalResult> {
  await requirePortalSession("editor");
  const def = COLLECTIONS[collection];
  const supabase = await getServerSupabase();
  if (!supabase) return { ok: false, message: "The database is not connected." };

  for (const item of order) {
    const { error } = await supabase.from(def.table).update({ sort: item.sort }).eq("id", item.id);
    if (error) return { ok: false, message: friendly(error.message) };
  }

  revalidate(collection);
  return { ok: true, message: "Order saved." };
}

/* --- Singletons ---------------------------------------------------------------- */

export async function saveSingleton({
  key,
  data,
}: {
  key: string;
  data: Record<string, unknown>;
}): Promise<PortalResult> {
  await requirePortalSession("editor");
  const def = SINGLETONS[key];
  const supabase = await getServerSupabase();
  if (!supabase) return { ok: false, message: "The database is not connected." };

  const { error } = await supabase
    .from("content_singletons")
    .upsert({ key, data }, { onConflict: "key" });

  if (error) return { ok: false, message: friendly(error.message) };
  revalidate(key);
  return { ok: true, message: `${def?.label ?? "Content"} saved and live.` };
}

/* --- Enquiries ------------------------------------------------------------------ */

export async function updateEnquiry({
  table,
  id,
  status,
  notes,
  assignedTo,
}: {
  table: "quote_requests" | "contact_messages" | "job_applications";
  id: string;
  status?: string;
  notes?: string;
  assignedTo?: string | null;
}): Promise<PortalResult> {
  await requirePortalSession("editor");
  const supabase = await getServerSupabase();
  if (!supabase) return { ok: false, message: "The database is not connected." };

  const patch: Record<string, unknown> = {};
  if (status) patch.status = status;
  if (notes !== undefined) patch.internal_notes = notes;
  if (assignedTo !== undefined && table !== "job_applications") patch.assigned_to = assignedTo;

  const { error } = await supabase.from(table).update(patch).eq("id", id);
  if (error) return { ok: false, message: friendly(error.message) };

  revalidatePath("/portal/enquiries", "layout");
  return { ok: true, message: "Enquiry updated." };
}

/* --- Settings -------------------------------------------------------------------- */

export async function saveSetting({
  key,
  value,
}: {
  key: string;
  value: unknown;
}): Promise<PortalResult> {
  await requirePortalSession("admin");
  const supabase = await getServerSupabase();
  if (!supabase) return { ok: false, message: "The database is not connected." };

  const { error } = await supabase.from("site_settings").upsert({ key, value }, { onConflict: "key" });
  if (error) return { ok: false, message: friendly(error.message) };

  revalidatePath("/", "layout");
  return { ok: true, message: "Settings saved." };
}

/* --- Users ----------------------------------------------------------------------- */

export async function updatePortalUser({
  id,
  role,
  active,
  fullName,
}: {
  id: string;
  role?: string;
  active?: boolean;
  fullName?: string;
}): Promise<PortalResult> {
  const session = await requirePortalSession("admin");
  if (id === session.id && (role !== undefined || active === false)) {
    return {
      ok: false,
      message: "You cannot change your own role or deactivate yourself — ask another admin.",
    };
  }

  const supabase = await getServerSupabase();
  if (!supabase) return { ok: false, message: "The database is not connected." };

  const patch: Record<string, unknown> = {};
  if (role) patch.role = role;
  if (active !== undefined) patch.active = active;
  if (fullName !== undefined) patch.full_name = fullName;

  const { error } = await supabase.from("portal_users").update(patch).eq("id", id);
  if (error) return { ok: false, message: friendly(error.message) };

  revalidatePath("/portal/users");
  return { ok: true, message: "User updated." };
}

/* --- Media ------------------------------------------------------------------------ */

export async function saveMediaAsset({
  id,
  title,
  alt,
  caption,
  tags,
}: {
  id: string;
  title: string;
  alt: string;
  caption?: string;
  tags: string[];
}): Promise<PortalResult> {
  await requirePortalSession("editor");
  const supabase = await getServerSupabase();
  if (!supabase) return { ok: false, message: "The database is not connected." };

  const { error } = await supabase
    .from("media_assets")
    .update({ title, alt, caption: caption ?? null, tags })
    .eq("id", id);

  if (error) return { ok: false, message: friendly(error.message) };
  revalidatePath("/", "layout");
  return { ok: true, message: "Image details saved." };
}

/* --- Error translation ------------------------------------------------------------ */

function friendly(message: string) {
  if (/duplicate key|unique constraint/i.test(message)) {
    return "That slug is already in use. Slugs have to be unique.";
  }
  if (/row-level security|permission denied/i.test(message)) {
    return "Your account does not have permission for that. Ask an administrator.";
  }
  if (/violates foreign key/i.test(message)) {
    return "Something this record links to no longer exists. Check the linked items and try again.";
  }
  return message;
}
