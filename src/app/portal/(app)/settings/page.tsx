import { PageShell, PageTitle, Panel } from "@/components/portal/Primitives";
import { SettingsEditor } from "@/components/portal/SettingsEditor";
import { requirePortalSession } from "@/lib/portal/auth";
import { getServerSupabase } from "@/lib/supabase/server";

const GROUPS = [
  {
    key: "features",
    title: "Section switches",
    description: "Turning a section off hides it everywhere it appears on the site, immediately.",
    fields: [
      { key: "testimonials", label: "Testimonials", type: "boolean" as const },
      { key: "news", label: "News & insight", type: "boolean" as const },
      { key: "careers", label: "Careers", type: "boolean" as const },
      { key: "gallery", label: "Gallery", type: "boolean" as const },
      { key: "documents", label: "Document downloads", type: "boolean" as const },
    ],
  },
  {
    key: "notifications",
    title: "Enquiry notifications",
    description: "Where enquiry alerts are sent once email delivery is connected.",
    fields: [
      { key: "quoteRecipients", label: "Quote request recipients", type: "list" as const },
      { key: "contactRecipients", label: "Message recipients", type: "list" as const },
    ],
  },
];

export default async function SettingsPage() {
  await requirePortalSession("admin");
  const supabase = await getServerSupabase();

  const { data } = supabase
    ? await supabase.from("site_settings").select("key, value")
    : { data: null };

  const values = Object.fromEntries(
    (data ?? []).map((row) => [row.key as string, row.value as Record<string, unknown>]),
  );

  return (
    <PageShell>
      <PageTitle
        title="System settings"
        description="Switches that change how the public site behaves."
        breadcrumb={[{ label: "Portal", href: "/portal" }, { label: "Settings" }]}
      />

      {GROUPS.map((group) => (
        <div key={group.key} className="mb-6">
          <SettingsEditor
            settingKey={group.key}
            title={group.title}
            description={group.description}
            fields={group.fields}
            value={values[group.key] ?? {}}
            readOnly={!supabase}
          />
        </div>
      ))}

      <Panel title="Environment" description="Read-only. Set at deploy time, not from the portal.">
        <dl className="flex flex-col divide-y divide-steel-500/12 text-sm">
          {[
            ["Site URL", process.env.NEXT_PUBLIC_SITE_URL ?? "not set — defaults to leikahplanthire.co.za"],
            ["Supabase", process.env.NEXT_PUBLIC_SUPABASE_URL ? "connected" : "not connected"],
            ["Service role key", process.env.SUPABASE_SERVICE_ROLE_KEY ? "present" : "missing — enquiries cannot be stored"],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-4 py-3">
              <dt className="text-xs text-steel-500">{label}</dt>
              <dd className="font-mono text-xs text-steel-300">{value}</dd>
            </div>
          ))}
        </dl>
      </Panel>
    </PageShell>
  );
}
