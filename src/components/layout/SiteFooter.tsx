import Link from "next/link";
import { Mail, MapPin, Phone, MessageCircle, ArrowUpRight } from "lucide-react";
import { LeikahLogo } from "@/components/brand/Logo";
import { BigWordmark, SurveyGrid } from "@/components/graphics/Atmosphere";
import { footerNav } from "@/lib/navigation";
import { getBusiness } from "@/lib/cms";
import { telHref, whatsappHref } from "@/lib/utils";
import { OpeningStatus } from "./OpeningStatus";

/* ============================================================================
   SITE FOOTER

   Carries the full NAP block (name, address, phone) that local search and
   corporate procurement both look for, the division map, and the emergency
   line held apart from everything else so it is never lost in a link list.
   ========================================================================= */

export async function SiteFooter() {
  const business = await getBusiness();
  const { address } = business;
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-steel-600/18 bg-ink-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent"
      />
      <SurveyGrid opacity={0.35} />

      {/* Emergency band — deliberately the first thing in the footer. */}
      <div className="border-b border-steel-600/15 bg-ink-900">
        <div className="shell flex flex-col items-start justify-between gap-5 py-7 sm:flex-row sm:items-center">
          <div className="flex items-start gap-4">
            <span className="relative mt-1.5 flex size-2.5 shrink-0">
              <span className="absolute inline-flex size-full rounded-full bg-signal-green opacity-70 motion-safe:animate-[leikah-pulse-ring_2.4s_ease-out_infinite]" />
              <span className="relative inline-flex size-2.5 rounded-full bg-signal-green" />
            </span>
            <div>
              <p className="font-display text-lg font-bold text-paper-50">
                Breakdown? The line is open.
              </p>
              <p className="mt-1 max-w-lg text-sm text-steel-400">{business.emergencyNote}</p>
            </div>
          </div>
          <a
            href={telHref(business.emergencyPhone)}
            className="chamfer-sm inline-flex h-12 shrink-0 items-center gap-3 bg-gold-500 px-6 font-semibold text-ink-950 transition-colors hover:bg-gold-400"
          >
            <Phone className="size-4" />
            <span className="tabular">{business.emergencyPhone}</span>
          </a>
        </div>
      </div>

      <div className="shell grid gap-12 py-16 lg:grid-cols-[1.15fr_2fr] lg:py-20">
        <div className="flex flex-col gap-7">
          <Link href="/" aria-label="Leikah Plant Hire — home">
            <LeikahLogo className="h-11 w-auto text-paper-50" />
          </Link>
          <p className="max-w-sm text-sm leading-relaxed text-steel-400">{business.summary}</p>

          <address className="flex flex-col gap-4 not-italic">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${address.lat},${address.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 text-sm text-steel-300 transition-colors hover:text-paper-50"
            >
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold-500" />
              <span>
                {address.street}, {address.suburb}
                <br />
                {address.city}, {address.province} {address.postalCode}
                <span className="ml-1.5 inline-block opacity-0 transition-opacity group-hover:opacity-100">
                  <ArrowUpRight className="inline size-3.5" />
                </span>
              </span>
            </a>
            <a
              href={telHref(business.phone)}
              className="flex items-center gap-3 text-sm text-steel-300 transition-colors hover:text-paper-50"
            >
              <Phone className="size-4 shrink-0 text-gold-500" />
              <span className="tabular">{business.phone}</span>
            </a>
            <a
              href={whatsappHref(business.whatsapp, "Good day, I would like to enquire about plant hire.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-steel-300 transition-colors hover:text-paper-50"
            >
              <MessageCircle className="size-4 shrink-0 text-gold-500" />
              WhatsApp enquiry
            </a>
            <a
              href={`mailto:${business.email}`}
              className="flex items-center gap-3 text-sm text-steel-300 transition-colors hover:text-paper-50"
            >
              <Mail className="size-4 shrink-0 text-gold-500" />
              {business.email}
            </a>
          </address>

          <OpeningStatus hours={business.hours} />
        </div>

        <div className="grid gap-10 sm:grid-cols-3">
          {footerNav.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="eyebrow mb-5 text-steel-500">{group.title}</h2>
              <ul className="flex flex-col gap-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-steel-300 transition-colors hover:text-gold-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/* Service footprint — real coverage, stated plainly. */}
      <div className="border-t border-steel-600/12">
        <div className="shell flex flex-wrap items-center gap-x-2 gap-y-2 py-6">
          <span className="eyebrow mr-2 text-steel-500">Service footprint</span>
          {business.serviceAreas.map((area, i) => (
            <span key={area} className="text-xs text-steel-400">
              {area}
              {i < business.serviceAreas.length - 1 && (
                <span aria-hidden="true" className="mx-2 text-steel-500/50">
                  ·
                </span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* The site signs off on the name */}
      <div className="relative h-24 overflow-hidden border-t border-steel-600/12 sm:h-32 lg:h-44">
        <BigWordmark className="bottom-[-18%]" opacity={0.09} align="center" />
      </div>

      <div className="relative border-t border-steel-600/12">
        <div className="shell flex flex-col items-start justify-between gap-4 py-6 text-xs text-steel-500 sm:flex-row sm:items-center">
          <p>
            © {year} {business.legalName}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {business.socials.map((social) => (
              <a
                key={social.platform}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-gold-400"
              >
                {social.label}
              </a>
            ))}
            {/* The portal needs a server, so it is not part of the static
                preview build and the link would only 404 there. */}
            {process.env.STATIC_EXPORT !== "1" && (
              <Link href="/portal" className="transition-colors hover:text-gold-400">
                Client &amp; staff portal
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
