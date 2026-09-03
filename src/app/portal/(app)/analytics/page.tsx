import { Gauge } from "lucide-react";
import { PageShell, PageTitle, Panel, Chip } from "@/components/portal/Primitives";
import { requirePortalSession } from "@/lib/portal/auth";
import { getServerSupabase } from "@/lib/supabase/server";

/**
 * First-party enquiry analytics, not a traffic dashboard. Page views belong in
 * a dedicated analytics tool; what the portal can say better than anyone is
 * where enquiries came from and what happened to them.
 */
export default async function AnalyticsPage() {
  await requirePortalSession("admin");
  const supabase = await getServerSupabase();

  const byStatus: Record<string, number> = {};
  const byUrgency: Record<string, number> = {};
  const byService: Record<string, number> = {};
  let total = 0;

  if (supabase) {
    const { data } = await supabase
      .from("quote_requests")
      .select("status, urgency, service_slugs, created_at")
      .limit(2000);

    for (const row of data ?? []) {
      total += 1;
      byStatus[row.status as string] = (byStatus[row.status as string] ?? 0) + 1;
      byUrgency[row.urgency as string] = (byUrgency[row.urgency as string] ?? 0) + 1;
      for (const slug of (row.service_slugs as string[]) ?? []) {
        byService[slug] = (byService[slug] ?? 0) + 1;
      }
    }
  }

  const won = byStatus.won ?? 0;
  const closed = won + (byStatus.lost ?? 0);
  const winRate = closed > 0 ? Math.round((won / closed) * 100) : null;

  return (
    <PageShell>
      <PageTitle
        title="Analytics"
        description="What the enquiry data says. Traffic and page views belong in a dedicated analytics tool."
        breadcrumb={[{ label: "Portal", href: "/portal" }, { label: "Analytics" }]}
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Panel title="Total requests">
          <p className="font-display text-4xl font-black tracking-tight text-paper-50 tabular">{total}</p>
        </Panel>
        <Panel title="Won">
          <p className="font-display text-4xl font-black tracking-tight text-signal-green tabular">{won}</p>
        </Panel>
        <Panel title="Win rate" description="Of requests that reached a decision.">
          <p className="font-display text-4xl font-black tracking-tight text-gold-gradient tabular">
            {winRate === null ? "—" : `${winRate}%`}
          </p>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Breakdown title="By status" data={byStatus} total={total} />
        <Breakdown title="By urgency" data={byUrgency} total={total} />
      </div>

      <div className="mt-6">
        <Breakdown title="Most requested services" data={byService} total={total} limit={10} />
      </div>

      {!total && (
        <Panel className="mt-6">
          <div className="flex items-center gap-4 py-6">
            <Gauge className="size-6 shrink-0 text-steel-500" />
            <p className="text-sm text-steel-400">
              Nothing to report yet. These figures build up as quote requests arrive.
            </p>
          </div>
        </Panel>
      )}
    </PageShell>
  );
}

function Breakdown({
  title,
  data,
  total,
  limit,
}: {
  title: string;
  data: Record<string, number>;
  total: number;
  limit?: number;
}) {
  const entries = Object.entries(data)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);

  if (!entries.length) return null;

  return (
    <Panel title={title}>
      <ul className="flex flex-col gap-4">
        {entries.map(([label, count]) => {
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <li key={label} className="flex flex-col gap-1.5">
              <span className="flex items-baseline justify-between gap-4">
                <span className="text-sm capitalize text-steel-200">{label.replace(/-/g, " ")}</span>
                <span className="flex items-baseline gap-2">
                  <span className="text-sm font-semibold text-paper-50 tabular">{count}</span>
                  <Chip>{pct}%</Chip>
                </span>
              </span>
              <span className="h-1 w-full bg-steel-500/15" aria-hidden="true">
                <span className="block h-full bg-gold-500" style={{ width: `${pct}%` }} />
              </span>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
