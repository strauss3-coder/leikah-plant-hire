import Link from "next/link";
import { Inbox, Paperclip } from "lucide-react";
import {
  PageShell,
  PageTitle,
  Panel,
  Chip,
  EmptyState,
  PortalLink,
} from "@/components/portal/Primitives";
import { requirePortalSession } from "@/lib/portal/auth";
import { getServerSupabase } from "@/lib/supabase/server";
import { formatDate, cn } from "@/lib/utils";

/* ============================================================================
   QUOTE REQUEST INBOX

   Sorted so emergencies float regardless of age: a machine that went down an
   hour ago outranks a planning enquiry from last week.
   ========================================================================= */

interface QuoteRow {
  id: string;
  reference: string;
  company: string;
  contact_name: string;
  email: string;
  phone: string;
  urgency: "emergency" | "urgent" | "scheduled" | "planning";
  status: string;
  site_location: string;
  province: string;
  service_slugs: string[];
  attachments: unknown[];
  created_at: string;
}

const STATUSES = ["all", "new", "reviewing", "quoted", "won", "lost", "archived"] as const;

const URGENCY_TONE = {
  emergency: "red",
  urgent: "gold",
  scheduled: "neutral",
  planning: "blue",
} as const;

export default async function QuotesInboxPage({
  searchParams,
}: PageProps<"/portal/enquiries/quotes">) {
  await requirePortalSession("viewer");
  const supabase = await getServerSupabase();
  const params = await searchParams;

  const status = typeof params.status === "string" ? params.status : "all";
  const urgency = typeof params.urgency === "string" ? params.urgency : undefined;

  let rows: QuoteRow[] = [];
  let connected = false;

  if (supabase) {
    connected = true;
    let query = supabase
      .from("quote_requests")
      .select(
        "id, reference, company, contact_name, email, phone, urgency, status, site_location, province, service_slugs, attachments, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(200);

    if (status !== "all") query = query.eq("status", status);
    if (urgency) query = query.eq("urgency", urgency);

    const { data } = await query;
    rows = (data ?? []) as QuoteRow[];

    // Emergencies first, then most recent.
    rows.sort((a, b) => {
      const emergency = Number(b.urgency === "emergency") - Number(a.urgency === "emergency");
      if (emergency !== 0) return emergency;
      return b.created_at.localeCompare(a.created_at);
    });
  }

  return (
    <PageShell>
      <PageTitle
        title="Quote requests"
        description="Every request from the website quotation workflow. Emergencies are always listed first."
        breadcrumb={[{ label: "Portal", href: "/portal" }, { label: "Quote requests" }]}
      />

      <nav aria-label="Filter by status" className="mb-6 flex flex-wrap gap-2">
        {STATUSES.map((value) => (
          <Link
            key={value}
            href={value === "all" ? "/portal/enquiries/quotes" : `/portal/enquiries/quotes?status=${value}`}
            className={cn(
              "chamfer-sm border px-3.5 py-2 text-xs font-medium capitalize transition-colors",
              status === value
                ? "border-gold-500 bg-gold-500 text-ink-950"
                : "border-steel-600/25 text-steel-300 hover:border-gold-500/50 hover:text-paper-50",
            )}
          >
            {value}
          </Link>
        ))}
      </nav>

      <Panel title={`${rows.length} request${rows.length === 1 ? "" : "s"}`} className="overflow-hidden">
        {rows.length ? (
          <ul className="-m-6 divide-y divide-steel-600/12">
            {rows.map((row) => (
              <li key={row.id}>
                <Link
                  href={`/portal/enquiries/quotes/${row.id}`}
                  className={cn(
                    "flex flex-wrap items-center gap-x-4 gap-y-2 px-6 py-4 transition-colors hover:bg-ink-850",
                    row.urgency === "emergency" && "border-l-2 border-signal-red",
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-paper-50">
                      <span className="truncate">{row.company}</span>
                      <Chip tone={URGENCY_TONE[row.urgency]}>{row.urgency}</Chip>
                      {Array.isArray(row.attachments) && row.attachments.length > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs text-steel-500">
                          <Paperclip className="size-3" />
                          {row.attachments.length}
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-steel-500">
                      {row.contact_name} · {row.site_location}, {row.province} ·{" "}
                      {row.service_slugs?.length ?? 0} service
                      {row.service_slugs?.length === 1 ? "" : "s"}
                    </p>
                  </div>

                  <div className="hidden text-right sm:block">
                    <p className="font-mono text-xs text-steel-500">{row.reference}</p>
                    <p className="mt-0.5 text-xs text-steel-500">{formatDate(row.created_at)}</p>
                  </div>

                  <Chip tone={row.status === "new" ? "gold" : row.status === "won" ? "green" : "neutral"}>
                    {row.status}
                  </Chip>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={<Inbox className="size-8" />}
            title={connected ? "Nothing here yet" : "Not connected"}
            description={
              connected
                ? "Requests from the website quotation workflow land here the moment they are submitted."
                : "Connect Supabase and enquiries will start arriving in this inbox."
            }
            action={!connected ? <PortalLink href="/portal/setup">Setup instructions</PortalLink> : undefined}
          />
        )}
      </Panel>
    </PageShell>
  );
}
