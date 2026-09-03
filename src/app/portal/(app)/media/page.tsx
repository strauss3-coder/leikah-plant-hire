import { Database, ImageIcon } from "lucide-react";
import Link from "next/link";
import { PageShell, PageTitle, Panel, EmptyState } from "@/components/portal/Primitives";
import { MediaLibrary } from "@/components/portal/MediaLibrary";
import { requirePortalSession } from "@/lib/portal/auth";
import { getServerSupabase } from "@/lib/supabase/server";
import { allMedia } from "@/lib/cms/media";

interface MediaRow {
  id: string;
  slug: string;
  title: string;
  alt: string;
  caption: string | null;
  tags: string[];
  width: number | null;
  height: number | null;
}

/**
 * Alt text is content, not decoration — it is the only description a screen
 * reader gets, and it is one of the few accessibility properties that has to be
 * written by a person who knows what is in the photograph. Editing it here
 * updates it everywhere the image appears.
 */
export default async function MediaLibraryPage() {
  await requirePortalSession("viewer");
  const supabase = await getServerSupabase();

  let rows: MediaRow[] = [];
  let live = false;

  if (supabase) {
    const { data, error } = await supabase
      .from("media_assets")
      .select("id, slug, title, alt, caption, tags, width, height")
      .is("deleted_at", null)
      .order("sort", { ascending: true });
    if (!error) {
      rows = (data ?? []) as MediaRow[];
      live = true;
    }
  }

  // Before the database exists, show the generated manifest read-only so the
  // library is still browsable.
  const fallback: MediaRow[] = allMedia.map((asset, i) => ({
    id: `seed-${i}`,
    slug: asset.slug,
    title: asset.title,
    alt: asset.alt,
    caption: null,
    tags: asset.tags,
    width: asset.width,
    height: asset.height,
  }));

  const items = live && rows.length ? rows : fallback;

  return (
    <PageShell>
      <PageTitle
        title="Media library"
        description="Every photograph on the site. Titles and alt text edited here update everywhere the image appears."
        breadcrumb={[{ label: "Portal", href: "/portal" }, { label: "Media library" }]}
      />

      {!live && (
        <div className="chamfer mb-6 flex items-start gap-3 border border-gold-500/35 bg-gold-500/8 p-4">
          <Database className="mt-0.5 size-4 shrink-0 text-gold-400" />
          <p className="text-sm leading-relaxed text-steel-200">
            Showing the generated image manifest, read-only. Connect Supabase to edit titles, alt
            text and tags —{" "}
            <Link href="/portal/setup" className="text-gold-400 underline underline-offset-4">
              setup instructions
            </Link>
            .
          </p>
        </div>
      )}

      {items.length ? (
        <MediaLibrary items={items} readOnly={!live} />
      ) : (
        <Panel>
          <EmptyState
            icon={<ImageIcon className="size-8" />}
            title="No images yet"
            description="Run npm run media to process the photography in the assets folder, then run the seed migration."
          />
        </Panel>
      )}
    </PageShell>
  );
}
