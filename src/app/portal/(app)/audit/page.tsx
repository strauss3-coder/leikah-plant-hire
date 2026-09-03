import { ScrollText } from "lucide-react";
import { PageShell, PageTitle, Panel, EmptyState, Chip } from "@/components/portal/Primitives";
import { requirePortalSession } from "@/lib/portal/auth";
import { getServerSupabase } from "@/lib/supabase/server";

interface AuditRow {
  id: number;
  table_name: string;
  row_id: string | null;
  action: string;
  actor_email: string | null;
  created_at: string;
}

const ACTION_TONE = { INSERT: "green", UPDATE: "gold", DELETE: "red" } as const;

/**
 * Written by a database trigger rather than by application code, so a change
 * made directly in Supabase is captured too. Nothing in the application can
 * write to this table — there is no policy that allows it.
 */
export default async function AuditPage() {
  await requirePortalSession("admin");
  const supabase = await getServerSupabase();

  const { data } = supabase
    ? await supabase
        .from("audit_log")
        .select("id, table_name, row_id, action, actor_email, created_at")
        .order("created_at", { ascending: false })
        .limit(300)
    : { data: null };

  const rows = (data ?? []) as AuditRow[];

  return (
    <PageShell>
      <PageTitle
        title="Audit log"
        description="Every content change, recorded by the database itself. Append-only — nothing can edit or remove an entry."
        breadcrumb={[{ label: "Portal", href: "/portal" }, { label: "Audit log" }]}
      />

      <Panel title={`Last ${rows.length} events`} className="overflow-hidden">
        {rows.length ? (
          <div className="-m-6 overflow-x-auto">
            <table className="w-full min-w-[44rem] text-sm">
              <thead>
                <tr className="border-b border-steel-600/15 text-left">
                  <th scope="col" className="px-6 py-3 text-xs font-medium text-steel-500">When</th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium text-steel-500">Who</th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium text-steel-500">Action</th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium text-steel-500">Table</th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium text-steel-500">Row</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-steel-600/10">
                {rows.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-ink-850">
                    <td className="whitespace-nowrap px-6 py-3 text-xs text-steel-400 tabular">
                      {new Date(row.created_at).toLocaleString("en-ZA", {
                        timeZone: "Africa/Johannesburg",
                      })}
                    </td>
                    <td className="px-6 py-3 text-xs text-steel-300">
                      {row.actor_email ?? "system"}
                    </td>
                    <td className="px-6 py-3">
                      <Chip tone={ACTION_TONE[row.action as keyof typeof ACTION_TONE] ?? "neutral"}>
                        {row.action}
                      </Chip>
                    </td>
                    <td className="px-6 py-3 font-mono text-xs text-steel-400">{row.table_name}</td>
                    <td className="px-6 py-3 font-mono text-xs text-steel-500">
                      {row.row_id?.slice(0, 8) ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={<ScrollText className="size-8" />}
            title="Nothing recorded yet"
            description="Every create, edit and delete will be listed here with the account that made it."
          />
        )}
      </Panel>
    </PageShell>
  );
}
