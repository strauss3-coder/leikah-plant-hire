import { notFound } from "next/navigation";
import Link from "next/link";
import { Database, ExternalLink } from "lucide-react";
import { PageShell, PageTitle, PortalLink } from "@/components/portal/Primitives";
import { SingletonEditor } from "@/components/portal/SingletonEditor";
import { PageHeadersEditor } from "@/components/portal/PageHeadersEditor";
import { requirePortalSession } from "@/lib/portal/auth";
import { getSingletonData, loadRelationOptions } from "@/lib/portal/data";
import { SINGLETONS } from "@/lib/portal/schema";

/** Where each singleton is visible on the public site. */
const PREVIEW: Record<string, string> = {
  home: "/",
  about: "/about",
  safety: "/health-safety",
  business: "/contact",
  headers: "/services",
};

export default async function SingletonPage({ params }: PageProps<"/portal/pages/[key]">) {
  await requirePortalSession("editor");
  const { key } = await params;

  // "Page headers" edits the `pages` singleton, which is a map of route headers
  // rather than a flat field list, so it gets its own editor.
  if (key === "headers") {
    const { data, live } = await getSingletonData("pages");
    return (
      <PageShell>
        <PageTitle
          title="Page headers"
          description="The eyebrow, headline, lead paragraph and header image at the top of every interior page."
          breadcrumb={[{ label: "Portal", href: "/portal" }, { label: "Page headers" }]}
          actions={
            <PortalLink href="/services" target="_blank" variant="ghost">
              <ExternalLink className="size-3.5" />
              Preview
            </PortalLink>
          }
        />
        {!live && <NotConnected />}
        <PageHeadersEditor data={data as Record<string, Record<string, unknown>>} readOnly={!live} />
      </PageShell>
    );
  }

  const def = SINGLETONS[key];
  if (!def) notFound();

  const [{ data, live }, options] = await Promise.all([
    getSingletonData(key),
    loadRelationOptions(),
  ]);

  return (
    <PageShell>
      <PageTitle
        title={def.label}
        description={def.description}
        breadcrumb={[{ label: "Portal", href: "/portal" }, { label: def.label }]}
        actions={
          PREVIEW[key] && (
            <PortalLink href={PREVIEW[key]} target="_blank" variant="ghost">
              <ExternalLink className="size-3.5" />
              Preview
            </PortalLink>
          )
        }
      />

      {!live && <NotConnected />}

      <SingletonEditor singletonKey={key} data={data} options={options} readOnly={!live} />
    </PageShell>
  );
}

function NotConnected() {
  return (
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
  );
}
