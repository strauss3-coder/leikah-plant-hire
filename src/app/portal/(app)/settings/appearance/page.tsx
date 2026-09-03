import { PageShell, PageTitle, Panel } from "@/components/portal/Primitives";
import { SettingsEditor } from "@/components/portal/SettingsEditor";
import { requirePortalSession } from "@/lib/portal/auth";
import { getServerSupabase } from "@/lib/supabase/server";

const SWATCHES = [
  ["Gold 300", "#ffd772", "Highlights and hover states"],
  ["Gold 500", "#eda91b", "The brand accent — buttons, rules, active states"],
  ["Gold 600", "#c9860c", "Gradient shadow on the accent"],
  ["Ink 950", "#07090c", "Page ground"],
  ["Ink 900", "#0b0e13", "Panels and alternating bands"],
  ["Steel 300", "#9aa3b0", "Secondary text on dark"],
  ["Paper 100", "#f7f8f9", "Light section ground"],
  ["Signal green", "#3fae7a", "Open, live, complete"],
  ["Signal red", "#e2564a", "Emergency and destructive actions"],
];

export default async function AppearancePage() {
  await requirePortalSession("admin");
  const supabase = await getServerSupabase();

  const { data } = supabase
    ? await supabase.from("site_settings").select("value").eq("key", "appearance").maybeSingle()
    : { data: null };

  return (
    <PageShell>
      <PageTitle
        title="Appearance"
        description="Motion switches and the palette the site is built on."
        breadcrumb={[{ label: "Portal", href: "/portal" }, { label: "Appearance" }]}
      />

      <div className="mb-6">
        <SettingsEditor
          settingKey="appearance"
          title="Motion"
          description="Both are suppressed automatically for visitors who have asked their device to reduce motion, whatever these are set to."
          fields={[
            { key: "preloader", label: "Show the branded loading screen on first visit", type: "boolean" },
            { key: "pageTransitions", label: "Animate page transitions", type: "boolean" },
          ]}
          value={(data?.value as Record<string, unknown>) ?? {}}
          readOnly={!supabase}
        />
      </div>

      <Panel
        title="Palette"
        description="Defined once in globals.css. Changing a value there updates every component that uses it."
      >
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SWATCHES.map(([name, hex, use]) => (
            <li key={name} className="flex items-center gap-3">
              <span
                className="chamfer-sm size-11 shrink-0 border border-steel-600/20"
                style={{ background: hex }}
                aria-hidden="true"
              />
              <span className="min-w-0">
                <span className="block text-sm font-medium text-paper-50">{name}</span>
                <span className="block font-mono text-xs text-steel-500">{hex}</span>
                <span className="mt-0.5 block text-xs text-steel-500">{use}</span>
              </span>
            </li>
          ))}
        </ul>
      </Panel>
    </PageShell>
  );
}
