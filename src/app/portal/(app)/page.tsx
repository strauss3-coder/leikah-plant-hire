import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CircleCheck,
  Clock,
  FileWarning,
  Inbox,
  Quote,
} from "lucide-react";
import { PageShell, PageTitle, Panel, Chip, PortalLink } from "@/components/portal/Primitives";
import { requirePortalSession } from "@/lib/portal/auth";
import { getServerSupabase } from "@/lib/supabase/server";
import { getSiteContent } from "@/lib/cms";
import { formatDate, cn } from "@/lib/utils";

/* ============================================================================
   DASHBOARD

   Two jobs: surface what needs a human today, and be honest about what is still
   outstanding before the site can go live. The launch checklist is generated
   from the actual content, not a static list — it goes away by itself as the
   gaps get filled.
   ========================================================================= */

interface RecentQuote {
  id: string;
  reference: string;
  company: string;
  contact_name: string;
  urgency: string;
  status: string;
  site_location: string;
  created_at: string;
}

export default async function PortalDashboard() {
  const session = await requirePortalSession("viewer");
  const supabase = await getServerSupabase();
  const content = await getSiteContent();

  let counts = {
    new_quotes: 0,
    emergency_quotes: 0,
    new_messages: 0,
    new_applications: 0,
    live_services: 0,
    live_projects: 0,
    live_testimonials: 0,
    media_count: 0,
  };
  let recent: RecentQuote[] = [];

  // In preview mode the counts come from the seed graph, so the tiles say
  // something true rather than showing zero against thirteen live services.
  if (!supabase) {
    counts = {
      ...counts,
      live_services: content.services.length,
      live_projects: content.projects.length,
      live_testimonials: content.testimonials.length,
      media_count: Object.keys(content.pages).length,
    };
  }

  if (supabase) {
    const [countRes, recentRes] = await Promise.all([
      supabase.from("portal_dashboard_counts").select("*").single(),
      supabase
        .from("quote_requests")
        .select("id, reference, company, contact_name, urgency, status, site_location, created_at")
        .order("created_at", { ascending: false })
        .limit(6),
    ]);
    if (countRes.data) counts = { ...counts, ...countRes.data };
    if (recentRes.data) recent = recentRes.data as RecentQuote[];
  }

  /* --- Launch checklist, derived from live content ---------------------- */
  const checklist = [
    {
      done: Boolean(content.business.registration),
      label: "Company registration number",
      href: "/portal/pages/business",
      why: "Required on quotations and by most corporate vendor forms.",
    },
    {
      done: Boolean(content.business.vat),
      label: "VAT number",
      href: "/portal/pages/business",
      why: "Needed before you can issue a tax invoice.",
    },
    {
      done: Boolean(content.business.bbbee),
      label: "B-BBEE level",
      href: "/portal/pages/business",
      why: "Mines and municipalities score contractors on this at tender stage.",
    },
    {
      done: !content.business.email.includes("leikahplanthire.co.za") || Boolean(process.env.NEXT_PUBLIC_MAIL_VERIFIED),
      label: "Branded mailboxes live",
      href: "/portal/pages/business",
      why: "The site lists info@ and quotes@ addresses. Create them, or change them here to addresses that work.",
    },
    {
      done: content.testimonials.length > 0,
      label: "At least one client testimonial",
      href: "/portal/content/testimonials",
      why: "The section stays hidden until a real, attributable quote is published.",
    },
    {
      done: content.safety.certifications.length > 0,
      label: "Safety certifications loaded",
      href: "/portal/pages/safety",
      why: "SHE departments look for these before they will accept a contractor.",
    },
    {
      done: content.documents.length > 0,
      label: "Company documents uploaded",
      href: "/portal/content/documents",
      why: "Brochures, insurance certificates and letters of good standing for the vendor pack.",
    },
    {
      done: content.clients.length > 0,
      label: "Client logos (with written permission)",
      href: "/portal/content/clients",
      why: "Only add a client mark once they have agreed to it in writing.",
    },
  ];

  const outstanding = checklist.filter((item) => !item.done);

  const tiles = [
    { label: "New quote requests", value: counts.new_quotes, href: "/portal/enquiries/quotes", icon: Quote, urgent: counts.emergency_quotes > 0 },
    { label: "New messages", value: counts.new_messages, href: "/portal/enquiries/messages", icon: Inbox },
    { label: "Live services", value: counts.live_services, href: "/portal/content/services", icon: CircleCheck },
    { label: "Live projects", value: counts.live_projects, href: "/portal/content/projects", icon: CircleCheck },
  ];

  return (
    <PageShell>
      <PageTitle
        title={`Good day${session.fullName ? `, ${session.fullName.split(" ")[0]}` : ""}`}
        description="What needs attention today, and what is still outstanding before launch."
        actions={<PortalLink href="/" target="_blank">View the live site</PortalLink>}
      />

      {counts.emergency_quotes > 0 && (
        <div className="chamfer mb-6 flex items-center gap-4 border border-signal-red/50 bg-signal-red/8 p-5">
          <AlertTriangle className="size-5 shrink-0 text-signal-red" />
          <p className="flex-1 text-sm text-steel-200">
            <strong className="font-semibold text-paper-50">
              {counts.emergency_quotes} emergency request
              {counts.emergency_quotes === 1 ? "" : "s"}
            </strong>{" "}
            waiting. Someone has a machine down.
          </p>
          <PortalLink href="/portal/enquiries/quotes?urgency=emergency" size="sm">
            Open
          </PortalLink>
        </div>
      )}

      {/* --- Tiles ------------------------------------------------------------ */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((tile) => (
          <Link
            key={tile.label}
            href={tile.href}
            className={cn(
              "chamfer group flex flex-col gap-3 border bg-ink-900 p-6 transition-colors",
              tile.urgent
                ? "border-signal-red/40 hover:border-signal-red/70"
                : "border-steel-600/15 hover:border-gold-500/45",
            )}
          >
            <tile.icon className="size-5 text-steel-500 transition-colors group-hover:text-gold-400" />
            <span className="font-display text-3xl font-black tracking-tight text-paper-50 tabular">
              {tile.value}
            </span>
            <span className="text-xs text-steel-400">{tile.label}</span>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        {/* --- Recent enquiries ---------------------------------------------- */}
        <Panel
          title="Recent quote requests"
          actions={
            <Link
              href="/portal/enquiries/quotes"
              className="inline-flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-300"
            >
              View all
              <ArrowRight className="size-3.5" />
            </Link>
          }
          className="overflow-hidden"
        >
          {recent.length ? (
            <ul className="-m-6 divide-y divide-steel-600/12">
              {recent.map((quote) => (
                <li key={quote.id}>
                  <Link
                    href={`/portal/enquiries/quotes/${quote.id}`}
                    className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-ink-850"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-2 text-sm font-medium text-paper-50">
                        <span className="truncate">{quote.company}</span>
                        {quote.urgency === "emergency" && <Chip tone="red">Emergency</Chip>}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-steel-500">
                        {quote.contact_name} · {quote.site_location}
                      </p>
                    </div>
                    <div className="hidden shrink-0 text-right sm:block">
                      <p className="font-mono text-xs text-steel-500">{quote.reference}</p>
                      <p className="mt-0.5 flex items-center justify-end gap-1.5 text-xs text-steel-500">
                        <Clock className="size-3" />
                        {formatDate(quote.created_at)}
                      </p>
                    </div>
                    <Chip tone={quote.status === "new" ? "gold" : "neutral"}>{quote.status}</Chip>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-10 text-center text-sm text-steel-500">
              {supabase
                ? "No quote requests yet. They will appear here the moment one arrives."
                : "Connect Supabase to start receiving enquiries."}
            </p>
          )}
        </Panel>

        {/* --- Launch checklist ------------------------------------------------ */}
        <Panel
          title="Before launch"
          description={
            outstanding.length
              ? `${outstanding.length} item${outstanding.length === 1 ? "" : "s"} still outstanding`
              : "Everything is in place"
          }
        >
          {outstanding.length ? (
            <ul className="flex flex-col gap-4">
              {outstanding.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="group flex items-start gap-3">
                    <FileWarning className="mt-0.5 size-4 shrink-0 text-gold-500" />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-steel-200 transition-colors group-hover:text-gold-400">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-steel-500">
                        {item.why}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center gap-3 py-4">
              <CircleCheck className="size-5 shrink-0 text-signal-green" />
              <p className="text-sm text-steel-300">
                Every pre-launch item is complete. Nothing on the site is waiting on content.
              </p>
            </div>
          )}
        </Panel>
      </div>
    </PageShell>
  );
}
