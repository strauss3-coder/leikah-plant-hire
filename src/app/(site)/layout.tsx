import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Preloader } from "@/components/layout/Preloader";
import { PageTransition } from "@/components/layout/PageTransition";
import { QuickActions } from "@/components/layout/QuickActions";
import { getBusiness, getServices, getIndustries } from "@/lib/cms";
import { JsonLd, organisationSchema } from "@/lib/seo";

/**
 * The public site shell. Navigation is built from the CMS at request time, so
 * a service or sector added in the portal appears in the menu without a code
 * change — the same rule as everything else on the site.
 */
export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const [business, services, industries] = await Promise.all([
    getBusiness(),
    getServices(),
    getIndustries(),
  ]);

  const serviceLinks = services.map((service) => ({
    label: service.title,
    href: `/services/${service.slug}`,
    description: service.summary,
  }));

  const industryLinks = industries.map((industry) => ({
    label: industry.name,
    href: `/industries/${industry.slug}`,
    description: industry.summary,
  }));

  return (
    <>
      <JsonLd data={organisationSchema(business)} />
      <Preloader />
      <SiteHeader
        phone={business.phone}
        serviceLinks={serviceLinks}
        industryLinks={industryLinks}
      />
      <main id="main" className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <SiteFooter />
      <QuickActions phone={business.emergencyPhone} whatsapp={business.whatsapp} />
    </>
  );
}
