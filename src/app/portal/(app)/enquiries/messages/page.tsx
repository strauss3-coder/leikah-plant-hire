import { Inbox } from "lucide-react";
import { PageShell, PageTitle, Panel, Chip, EmptyState, PortalLink } from "@/components/portal/Primitives";
import { EnquiryWorkflow } from "@/components/portal/EnquiryWorkflow";
import { requirePortalSession } from "@/lib/portal/auth";
import { getServerSupabase } from "@/lib/supabase/server";
import { formatDate, telHref } from "@/lib/utils";

interface MessageRow {
  id: string;
  reference: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  department: string;
  subject: string;
  message: string;
  status: string;
  internal_notes: string | null;
  created_at: string;
}

/**
 * Messages are short enough to read in place, so the list expands rather than
 * routing to a detail page — one fewer click on the screen the office actually
 * lives in.
 */
export default async function MessagesPage() {
  await requirePortalSession("viewer");
  const supabase = await getServerSupabase();

  let rows: MessageRow[] = [];
  if (supabase) {
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    rows = (data ?? []) as MessageRow[];
  }

  return (
    <PageShell>
      <PageTitle
        title="Messages"
        description="Everything sent through the contact form, routed to the department the sender chose."
        breadcrumb={[{ label: "Portal", href: "/portal" }, { label: "Messages" }]}
      />

      {rows.length ? (
        <div className="flex flex-col gap-4">
          {rows.map((row) => (
            <Panel
              key={row.id}
              title={row.subject}
              description={`${row.name}${row.company ? ` · ${row.company}` : ""} · ${row.department}`}
              actions={
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-steel-500">{row.reference}</span>
                  <Chip tone={row.status === "new" ? "gold" : "neutral"}>{row.status}</Chip>
                </div>
              }
            >
              <div className="flex flex-col gap-5">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-steel-200">
                  {row.message}
                </p>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-steel-600/12 pt-4 text-xs">
                  <a
                    href={`mailto:${row.email}?subject=${encodeURIComponent(`Re: ${row.subject} (${row.reference})`)}`}
                    className="text-gold-400 hover:text-gold-300"
                  >
                    {row.email}
                  </a>
                  {row.phone && (
                    <a href={telHref(row.phone)} className="text-steel-300 hover:text-gold-400">
                      {row.phone}
                    </a>
                  )}
                  <span className="text-steel-500">{formatDate(row.created_at)}</span>
                </div>

                <EnquiryWorkflow
                  table="contact_messages"
                  id={row.id}
                  status={row.status}
                  notes={row.internal_notes ?? ""}
                />
              </div>
            </Panel>
          ))}
        </div>
      ) : (
        <Panel>
          <EmptyState
            icon={<Inbox className="size-8" />}
            title={supabase ? "No messages yet" : "Not connected"}
            description={
              supabase
                ? "Contact form submissions arrive here as soon as they are sent."
                : "Connect Supabase and contact form messages will land in this inbox."
            }
            action={!supabase ? <PortalLink href="/portal/setup">Setup instructions</PortalLink> : undefined}
          />
        </Panel>
      )}
    </PageShell>
  );
}
