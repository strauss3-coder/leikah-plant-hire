import { Receipt } from "lucide-react";
import { PageShell, PageTitle, Panel } from "@/components/portal/Primitives";
import { requirePortalSession } from "@/lib/portal/auth";

/**
 * Invoicing is scoped but not built. The schema already carries `customers` and
 * links quote requests to them, so the work when it happens is a table, a
 * numbering sequence and a PDF renderer — not a data-model rewrite.
 *
 * Saying that plainly is more useful than shipping a half-working module.
 */
export default async function InvoicesPage() {
  await requirePortalSession("viewer");

  return (
    <PageShell>
      <PageTitle
        title="Invoices"
        description="Not built yet — the groundwork is in place."
        breadcrumb={[{ label: "Portal", href: "/portal" }, { label: "Invoices" }]}
      />

      <Panel title="What is already in place">
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-4">
            <Receipt className="mt-0.5 size-5 shrink-0 text-gold-500" />
            <p className="text-sm leading-relaxed text-steel-300">
              The database already holds a <code className="font-mono text-xs text-gold-400">customers</code>{" "}
              table, and every quote request can be linked to a customer record. That is the part
              that is expensive to retrofit, and it is done.
            </p>
          </div>

          <div>
            <h3 className="eyebrow mb-3 text-steel-500">Still to build</h3>
            <ul className="flex flex-col gap-2.5 text-sm text-steel-300">
              {[
                "An invoices table with line items, VAT handling and a sequential number series",
                "A quotation-to-invoice conversion that carries the agreed scope across",
                "PDF generation on the company letterhead",
                "Payment status tracking and an ageing view",
                "Export for the bookkeeper, in whatever format their package accepts",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2 h-px w-4 shrink-0 bg-gold-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs leading-relaxed text-steel-500">
            Worth deciding first whether invoicing should live here at all, or whether the portal
            should hand qualified work to the accounting package the business already uses. Building
            a second place where money is recorded is usually a mistake.
          </p>
        </div>
      </Panel>
    </PageShell>
  );
}
