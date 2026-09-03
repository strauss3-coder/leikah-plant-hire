import { notFound } from "next/navigation";
import { Mail, MapPin, Phone, MessageCircle, Paperclip, CalendarDays, Wallet } from "lucide-react";
import { PageShell, PageTitle, Panel, Chip } from "@/components/portal/Primitives";
import { EnquiryWorkflow } from "@/components/portal/EnquiryWorkflow";
import { requirePortalSession } from "@/lib/portal/auth";
import { getServerSupabase } from "@/lib/supabase/server";
import { getServices, getIndustries } from "@/lib/cms";
import { formatDate, telHref, whatsappHref } from "@/lib/utils";

interface Attachment {
  name: string;
  path: string;
  size: number;
  type: string;
}

export default async function QuoteDetailPage({
  params,
}: PageProps<"/portal/enquiries/quotes/[id]">) {
  await requirePortalSession("viewer");
  const { id } = await params;

  const supabase = await getServerSupabase();
  if (!supabase) notFound();

  const [{ data: quote }, services, industries] = await Promise.all([
    supabase.from("quote_requests").select("*").eq("id", id).maybeSingle(),
    getServices(),
    getIndustries(),
  ]);

  if (!quote) notFound();

  const requested = services.filter((s) => (quote.service_slugs ?? []).includes(s.slug));
  const sector = industries.find((i) => i.slug === quote.industry_slug);
  const attachments = (quote.attachments ?? []) as Attachment[];

  // Attachments live in a private bucket, so links are signed on demand and
  // expire — a forwarded email should not become permanent public access.
  const signed = await Promise.all(
    attachments
      .filter((file) => file.path)
      .map(async (file) => {
        const { data } = await supabase.storage
          .from("enquiry-attachments")
          .createSignedUrl(file.path, 60 * 60);
        return { ...file, url: data?.signedUrl ?? null };
      }),
  );

  return (
    <PageShell>
      <PageTitle
        title={quote.company as string}
        description={`${quote.contact_name}${quote.role ? ` · ${quote.role}` : ""}`}
        breadcrumb={[
          { label: "Portal", href: "/portal" },
          { label: "Quote requests", href: "/portal/enquiries/quotes" },
          { label: quote.reference as string },
        ]}
        actions={
          <>
            <Chip tone={quote.urgency === "emergency" ? "red" : "neutral"}>
              {quote.urgency as string}
            </Chip>
            <Chip tone={quote.status === "new" ? "gold" : "neutral"}>{quote.status as string}</Chip>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="flex flex-col gap-6">
          <Panel title="What they need">
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap gap-2">
                {requested.map((service) => (
                  <Chip key={service.id} tone="gold">
                    {service.title}
                  </Chip>
                ))}
                {!requested.length && (
                  <p className="text-sm text-steel-500">No services were selected.</p>
                )}
              </div>

              <div className="whitespace-pre-wrap text-sm leading-relaxed text-steel-200">
                {quote.description as string}
              </div>
            </div>
          </Panel>

          {signed.length > 0 && (
            <Panel title={`Attachments (${signed.length})`} description="Links expire after an hour.">
              <ul className="flex flex-col gap-2">
                {signed.map((file) => (
                  <li key={file.path}>
                    <a
                      href={file.url ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="chamfer-sm flex items-center gap-3 border border-steel-600/20 bg-ink-950 px-4 py-3 text-sm transition-colors hover:border-gold-500/45"
                    >
                      <Paperclip className="size-4 shrink-0 text-gold-500" />
                      <span className="min-w-0 flex-1 truncate text-steel-200">{file.name}</span>
                      <span className="shrink-0 text-xs text-steel-500 tabular">
                        {Math.round(file.size / 1024)} KB
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </Panel>
          )}

          <EnquiryWorkflow
            table="quote_requests"
            id={quote.id as string}
            status={quote.status as string}
            notes={(quote.internal_notes as string) ?? ""}
          />
        </div>

        <div className="flex flex-col gap-6">
          <Panel title="Contact">
            <dl className="flex flex-col gap-4 text-sm">
              <ContactRow icon={<Phone className="size-4" />} label="Telephone">
                <a href={telHref(quote.phone as string)} className="text-steel-200 hover:text-gold-400">
                  {quote.phone as string}
                </a>
              </ContactRow>
              <ContactRow icon={<MessageCircle className="size-4" />} label="WhatsApp">
                <a
                  href={whatsappHref(
                    quote.phone as string,
                    `Good day ${quote.contact_name}, regarding your enquiry ${quote.reference} —`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-steel-200 hover:text-gold-400"
                >
                  Open a chat
                </a>
              </ContactRow>
              <ContactRow icon={<Mail className="size-4" />} label="Email">
                <a
                  href={`mailto:${quote.email}?subject=${encodeURIComponent(`Leikah Plant Hire — quotation ${quote.reference}`)}`}
                  className="break-all text-steel-200 hover:text-gold-400"
                >
                  {quote.email as string}
                </a>
              </ContactRow>
            </dl>
          </Panel>

          <Panel title="Enquiry record">
            <dl className="flex flex-col divide-y divide-steel-600/12 text-sm">
              <Row label="Reference" value={quote.reference as string} mono />
              <Row label="Received" value={formatDate(quote.created_at as string)} />
              <Row label="Sector" value={sector?.name ?? "—"} />
              <Row
                label="Site"
                value={`${quote.site_location}, ${quote.province}`}
                icon={<MapPin className="size-3.5" />}
              />
              <Row
                label="Preferred start"
                value={quote.preferred_start ? formatDate(quote.preferred_start as string) : "Not stated"}
                icon={<CalendarDays className="size-3.5" />}
              />
              <Row label="Duration" value={(quote.duration as string) || "Not stated"} />
              <Row
                label="Budget"
                value={(quote.budget_band as string) || "Not stated"}
                icon={<Wallet className="size-3.5" />}
              />
              <Row label="Source" value={(quote.source as string) || "website"} mono />
              <Row label="Consent given" value={quote.consent ? "Yes" : "No"} />
            </dl>
          </Panel>
        </div>
      </div>
    </PageShell>
  );
}

function ContactRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 shrink-0 text-gold-500">{icon}</span>
      <div className="min-w-0">
        <dt className="text-xs text-steel-500">{label}</dt>
        <dd className="mt-0.5">{children}</dd>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
  icon,
}: {
  label: string;
  value: string;
  mono?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <dt className="flex items-center gap-1.5 text-xs text-steel-500">
        {icon}
        {label}
      </dt>
      <dd className={`text-right text-sm text-steel-200 ${mono ? "font-mono text-xs" : ""}`}>
        {value}
      </dd>
    </div>
  );
}
