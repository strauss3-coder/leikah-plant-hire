import { PageShell, PageTitle, Panel } from "@/components/portal/Primitives";
import { SettingsEditor } from "@/components/portal/SettingsEditor";
import { requirePortalSession } from "@/lib/portal/auth";
import { getServerSupabase } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/seo";

export default async function SeoSettingsPage() {
  await requirePortalSession("admin");
  const supabase = await getServerSupabase();

  const { data } = supabase
    ? await supabase.from("site_settings").select("value").eq("key", "seo.defaults").maybeSingle()
    : { data: null };

  return (
    <PageShell>
      <PageTitle
        title="SEO"
        description="Defaults used wherever a page has no override of its own. Per-page titles and descriptions live on each item in the content editor."
        breadcrumb={[{ label: "Portal", href: "/portal" }, { label: "SEO" }]}
      />

      <div className="mb-6">
        <SettingsEditor
          settingKey="seo.defaults"
          title="Search defaults"
          description="The title template, fallback title and fallback description."
          fields={[
            { key: "defaultTitle", label: "Default page title", type: "text" },
            { key: "titleTemplate", label: "Title template", type: "text" },
            { key: "defaultDescription", label: "Default description", type: "textarea" },
          ]}
          value={(data?.value as Record<string, unknown>) ?? {}}
          readOnly={!supabase}
        />
      </div>

      <Panel title="Generated automatically" description="Nothing here needs editing — it is built from your content.">
        <ul className="flex flex-col gap-3 text-sm text-steel-300">
          {[
            ["Sitemap", `${SITE_URL}/sitemap.xml`, "Rebuilt from the CMS, so a new service or project is listed without a redeploy."],
            ["Robots", `${SITE_URL}/robots.txt`, "Allows the site, blocks the portal and the enquiry endpoints."],
            ["Organisation record", "Structured data on every page", "Address, coordinates, hours and service areas from the business record."],
            ["Service records", "Structured data per service page", "Lets search engines list individual services."],
            ["FAQ records", "Structured data on the FAQ and service pages", "Eligible for expandable answers in search results."],
            ["Breadcrumbs", "Structured data on every interior page", "Shows the path rather than a bare URL in search results."],
          ].map(([label, value, note]) => (
            <li key={label} className="flex flex-col gap-1 border-b border-steel-600/10 pb-3 last:border-0">
              <span className="flex flex-wrap items-baseline gap-x-3">
                <span className="font-medium text-paper-50">{label}</span>
                <span className="font-mono text-xs text-steel-500">{value}</span>
              </span>
              <span className="text-xs text-steel-500">{note}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </PageShell>
  );
}
