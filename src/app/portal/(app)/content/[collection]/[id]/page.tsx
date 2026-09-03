import { notFound } from "next/navigation";
import Link from "next/link";
import { Database } from "lucide-react";
import { PageShell, PageTitle } from "@/components/portal/Primitives";
import { EntryEditor } from "@/components/portal/EntryEditor";
import { requirePortalSession, atLeast } from "@/lib/portal/auth";
import { getCollectionItem, listCollection, loadRelationOptions } from "@/lib/portal/data";
import { COLLECTIONS, type CollectionKey } from "@/lib/portal/schema";

export default async function CollectionEditorPage({
  params,
}: PageProps<"/portal/content/[collection]/[id]">) {
  const session = await requirePortalSession("editor");
  const { collection, id } = await params;

  const key = collection as CollectionKey;
  const def = COLLECTIONS[key];
  if (!def) notFound();

  const isNew = id === "new";
  const [{ row, live }, options, { rows: siblings }] = await Promise.all([
    isNew
      ? Promise.resolve({ row: null, live: true })
      : getCollectionItem(key, id),
    loadRelationOptions(),
    listCollection(key),
  ]);

  if (!isNew && !row) notFound();

  const title = row ? String(row.data[def.titleField] ?? "Untitled") : `New ${def.singular.toLowerCase()}`;

  // New entries land at the end of the list rather than jumping to the top.
  const nextSort = siblings.length ? Math.max(...siblings.map((s) => s.sort)) + 1 : 1;

  return (
    <PageShell>
      <PageTitle
        title={title}
        description={isNew ? def.description : undefined}
        breadcrumb={[
          { label: "Portal", href: "/portal" },
          { label: def.label, href: `/portal/content/${key}` },
          { label: isNew ? "New" : title },
        ]}
      />

      {!live && (
        <div className="chamfer mb-6 flex items-start gap-3 border border-gold-500/35 bg-gold-500/8 p-4">
          <Database className="mt-0.5 size-4 shrink-0 text-gold-400" />
          <p className="text-sm leading-relaxed text-steel-200">
            This is the content shipped with the site, shown read-only. Saving needs Supabase —{" "}
            <Link href="/portal/setup" className="text-gold-400 underline underline-offset-4">
              setup instructions
            </Link>
            .
          </p>
        </div>
      )}

      <EntryEditor
        collection={key}
        options={options}
        canPublish={atLeast(session.role, "editor")}
        readOnly={!live}
        row={
          row
            ? {
                id: row.id,
                slug: row.slug,
                sort: row.sort,
                status: row.status,
                data: row.data,
                updatedAt: row.updated_at,
              }
            : { slug: null, sort: nextSort, status: "draft", data: {} }
        }
      />
    </PageShell>
  );
}
