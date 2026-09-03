import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Plus, PenLine, ExternalLink, Database } from "lucide-react";
import {
  PageShell,
  PageTitle,
  Panel,
  StatusChip,
  EmptyState,
  PortalLink,
} from "@/components/portal/Primitives";
import { requirePortalSession } from "@/lib/portal/auth";
import { listCollection } from "@/lib/portal/data";
import { COLLECTIONS, type CollectionKey } from "@/lib/portal/schema";
import { getMedia } from "@/lib/cms/media";

const PUBLIC_ROUTES: Partial<Record<CollectionKey, string>> = {
  services: "/services",
  industries: "/industries",
  projects: "/projects",
  news: "/news",
};

export default async function CollectionListPage({
  params,
}: PageProps<"/portal/content/[collection]">) {
  await requirePortalSession("viewer");
  const { collection } = await params;

  const key = collection as CollectionKey;
  const def = COLLECTIONS[key];
  if (!def) notFound();

  const { rows, live } = await listCollection(key);
  const published = rows.filter((r) => r.status === "published").length;

  return (
    <PageShell>
      <PageTitle
        title={def.label}
        description={def.description}
        breadcrumb={[{ label: "Portal", href: "/portal" }, { label: def.label }]}
        actions={
          <>
            {PUBLIC_ROUTES[key] && (
              <PortalLink href={PUBLIC_ROUTES[key]!} target="_blank" variant="ghost">
                <ExternalLink className="size-3.5" />
                View live
              </PortalLink>
            )}
            <PortalLink href={`/portal/content/${key}/new`} variant="primary">
              <Plus className="size-4" />
              New {def.singular.toLowerCase()}
            </PortalLink>
          </>
        }
      />

      {!live && (
        <div className="chamfer mb-6 flex items-start gap-3 border border-gold-500/35 bg-gold-500/8 p-4">
          <Database className="mt-0.5 size-4 shrink-0 text-gold-400" />
          <p className="text-sm leading-relaxed text-steel-200">
            Showing the content shipped with the site. Connect Supabase to edit it —{" "}
            <Link href="/portal/setup" className="text-gold-400 underline underline-offset-4">
              setup instructions
            </Link>
            .
          </p>
        </div>
      )}

      <Panel
        title={`${rows.length} ${rows.length === 1 ? def.singular.toLowerCase() : def.label.toLowerCase()}`}
        description={`${published} published`}
        className="overflow-hidden"
      >
        {rows.length ? (
          <ul className="-m-6 divide-y divide-steel-600/12">
            {rows.map((row) => {
              const title = String(row.data[def.titleField] ?? row.slug ?? "Untitled");
              const subtitle = def.subtitleField
                ? String(row.data[def.subtitleField] ?? "")
                : "";
              const image = def.imageField
                ? getMedia(row.data[def.imageField] as string | undefined)
                : null;

              return (
                <li key={row.id}>
                  <Link
                    href={`/portal/content/${key}/${row.id}`}
                    className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-ink-850"
                  >
                    <span className="font-mono text-xs text-steel-500 tabular">
                      {String(row.sort).padStart(2, "0")}
                    </span>

                    {image?.src ? (
                      <span className="chamfer-sm relative size-12 shrink-0 overflow-hidden border border-steel-600/20">
                        <Image src={image.src} alt="" fill sizes="48px" className="object-cover" />
                      </span>
                    ) : def.imageField ? (
                      <span className="chamfer-sm flex size-12 shrink-0 items-center justify-center border border-dashed border-steel-600/25 text-[0.5625rem] text-steel-500">
                        no image
                      </span>
                    ) : null}

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-paper-50">
                        {title}
                      </span>
                      {subtitle && (
                        <span className="mt-0.5 block truncate text-xs text-steel-500">
                          {subtitle}
                        </span>
                      )}
                    </span>

                    {row.slug && (
                      <span className="hidden shrink-0 font-mono text-xs text-steel-500 lg:block">
                        /{row.slug}
                      </span>
                    )}

                    <StatusChip status={row.status} />

                    <PenLine className="size-4 shrink-0 text-steel-500 transition-colors group-hover:text-gold-400" />
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <EmptyState
            title={`No ${def.label.toLowerCase()} yet`}
            description={def.description}
            icon={<def.icon className="size-8" />}
            action={
              <PortalLink href={`/portal/content/${key}/new`} variant="primary">
                <Plus className="size-4" />
                Create the first one
              </PortalLink>
            }
          />
        )}
      </Panel>
    </PageShell>
  );
}
