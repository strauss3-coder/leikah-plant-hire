import Link from "next/link";
import { Building2 } from "lucide-react";
import { PageShell, PageTitle, Panel, EmptyState, Chip } from "@/components/portal/Primitives";
import { requirePortalSession } from "@/lib/portal/auth";
import { getServerSupabase } from "@/lib/supabase/server";
import { formatDate, telHref } from "@/lib/utils";

interface CustomerRow {
  id: string;
  name: string;
  trading_name: string | null;
  industry_slug: string | null;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  status: string;
  created_at: string;
}

/**
 * Customers are created from qualified quote requests rather than typed in
 * cold, which is why this screen is a register rather than a form — the record
 * comes from work that actually happened.
 */
export default async function CustomersPage() {
  await requirePortalSession("viewer");
  const supabase = await getServerSupabase();

  const { data } = supabase
    ? await supabase
        .from("customers")
        .select("id, name, trading_name, industry_slug, contact_name, email, phone, status, created_at")
        .is("deleted_at", null)
        .order("name", { ascending: true })
    : { data: null };

  const rows = (data ?? []) as CustomerRow[];

  return (
    <PageShell>
      <PageTitle
        title="Customers"
        description="The register behind quotations and, in time, invoices."
        breadcrumb={[{ label: "Portal", href: "/portal" }, { label: "Customers" }]}
      />

      <Panel title={`${rows.length} customer${rows.length === 1 ? "" : "s"}`} className="overflow-hidden">
        {rows.length ? (
          <div className="-m-6 overflow-x-auto">
            <table className="w-full min-w-[46rem] text-sm">
              <thead>
                <tr className="border-b border-steel-600/15 text-left">
                  <th scope="col" className="px-6 py-3 text-xs font-medium text-steel-500">Customer</th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium text-steel-500">Contact</th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium text-steel-500">Status</th>
                  <th scope="col" className="px-6 py-3 text-xs font-medium text-steel-500">Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-steel-600/10">
                {rows.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-ink-850">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-paper-50">{row.name}</p>
                      {row.trading_name && (
                        <p className="mt-0.5 text-xs text-steel-500">t/a {row.trading_name}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-steel-400">
                      {row.contact_name && <p className="text-steel-300">{row.contact_name}</p>}
                      {row.email && (
                        <a href={`mailto:${row.email}`} className="hover:text-gold-400">
                          {row.email}
                        </a>
                      )}
                      {row.phone && (
                        <p>
                          <a href={telHref(row.phone)} className="hover:text-gold-400">
                            {row.phone}
                          </a>
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Chip tone={row.status === "active" ? "green" : "neutral"}>{row.status}</Chip>
                    </td>
                    <td className="px-6 py-4 text-xs text-steel-500">{formatDate(row.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={<Building2 className="size-8" />}
            title="No customers on the register yet"
            description="A customer record is created when a quote request is qualified, so this fills up as enquiries turn into work."
            action={
              <Link
                href="/portal/enquiries/quotes"
                className="chamfer-sm inline-flex h-11 items-center border border-steel-600/25 px-5 text-sm font-medium text-steel-200 transition-colors hover:border-gold-500/50"
              >
                Open the quote inbox
              </Link>
            }
          />
        )}
      </Panel>
    </PageShell>
  );
}
