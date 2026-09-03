import { Briefcase } from "lucide-react";
import { PageShell, PageTitle, Panel, Chip, EmptyState, PortalLink } from "@/components/portal/Primitives";
import { EnquiryWorkflow } from "@/components/portal/EnquiryWorkflow";
import { requirePortalSession } from "@/lib/portal/auth";
import { getServerSupabase } from "@/lib/supabase/server";
import { formatDate, telHref } from "@/lib/utils";

interface ApplicationRow {
  id: string;
  reference: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  experience: string;
  competencies: string | null;
  cv: { name: string; path: string } | null;
  status: string;
  internal_notes: string | null;
  created_at: string;
}

export default async function ApplicationsPage() {
  await requirePortalSession("viewer");
  const supabase = await getServerSupabase();

  let rows: ApplicationRow[] = [];
  const signedCvs: Record<string, string> = {};

  if (supabase) {
    const { data } = await supabase
      .from("job_applications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    rows = (data ?? []) as ApplicationRow[];

    // CVs sit in the private bucket; each link is signed for an hour.
    await Promise.all(
      rows
        .filter((row) => row.cv?.path)
        .map(async (row) => {
          const { data: signed } = await supabase.storage
            .from("enquiry-attachments")
            .createSignedUrl(row.cv!.path, 60 * 60);
          if (signed?.signedUrl) signedCvs[row.id] = signed.signedUrl;
        }),
    );
  }

  return (
    <PageShell>
      <PageTitle
        title="Applications"
        description="Every application received, including speculative ones sent when no role was advertised."
        breadcrumb={[{ label: "Portal", href: "/portal" }, { label: "Applications" }]}
      />

      {rows.length ? (
        <div className="flex flex-col gap-4">
          {rows.map((row) => (
            <Panel
              key={row.id}
              title={row.name}
              description={`Applying for: ${row.role}`}
              actions={
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-steel-500">{row.reference}</span>
                  <Chip tone={row.status === "new" ? "gold" : "neutral"}>{row.status}</Chip>
                </div>
              }
            >
              <div className="flex flex-col gap-5">
                <div>
                  <h3 className="eyebrow mb-2 text-steel-500">Experience</h3>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-steel-200">
                    {row.experience}
                  </p>
                </div>

                {row.competencies && (
                  <div>
                    <h3 className="eyebrow mb-2 text-steel-500">Competencies</h3>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-steel-200">
                      {row.competencies}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-steel-600/12 pt-4 text-xs">
                  <a href={`mailto:${row.email}`} className="text-gold-400 hover:text-gold-300">
                    {row.email}
                  </a>
                  <a href={telHref(row.phone)} className="text-steel-300 hover:text-gold-400">
                    {row.phone}
                  </a>
                  {signedCvs[row.id] && (
                    <a
                      href={signedCvs[row.id]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold-400 underline underline-offset-4 hover:text-gold-300"
                    >
                      Download CV
                    </a>
                  )}
                  <span className="text-steel-500">{formatDate(row.created_at)}</span>
                </div>

                <EnquiryWorkflow
                  table="job_applications"
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
            icon={<Briefcase className="size-8" />}
            title={supabase ? "No applications yet" : "Not connected"}
            description={
              supabase
                ? "Applications from the careers page arrive here, whether or not a vacancy is advertised."
                : "Connect Supabase and applications will land here."
            }
            action={!supabase ? <PortalLink href="/portal/setup">Setup instructions</PortalLink> : undefined}
          />
        </Panel>
      )}
    </PageShell>
  );
}
