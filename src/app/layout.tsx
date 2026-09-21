import type { Metadata, Viewport } from "next";
import { Archivo, Inter, JetBrains_Mono } from "next/font/google";
import { getBusiness, getHome } from "@/lib/cms";
import { SITE_URL, absoluteUrl } from "@/lib/seo";
import { getMedia } from "@/lib/cms/media";
import "./globals.css";

/* Display: Archivo — a grotesk with the width and the weight range an
   industrial identity needs, and a variable axis so headings stay crisp. */
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700", "800", "900"],
});

/* Body: Inter, for long-form legibility at small sizes. */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/* Technical: used for eyebrows, references, coordinates and readouts. */
const mono = JetBrains_Mono({
  variable: "--font-mono-tech",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

/** One short description for the meta tag and both share cards. 152 characters. */
const SHARE_DESCRIPTION =
  "Plant hire, earthmoving and heavy mechanical contracting across the Mpumalanga coalfields. Dozers, excavators and haulers, wet or dry, from Middelburg.";

export async function generateMetadata(): Promise<Metadata> {
  const [business, home] = await Promise.all([getBusiness(), getHome()]);

  /**
   * Default social preview image, inherited by any page that does not set its
   * own. Without it the homepage shared nothing at all, which is the single
   * most-shared URL on the site: a WhatsApp or LinkedIn preview of it came
   * back as a bare link. Pages that build their own metadata still override.
   */
  const fallback = getMedia(home.hero.media?.[0]);
  const ogImage = fallback.src
    ? [{
        url: absoluteUrl(fallback.src),
        width: fallback.width,
        height: fallback.height,
        alt: fallback.alt,
      }]
    : undefined;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `Plant Hire & Earthmoving, Middelburg | ${business.tradingName}`,
      template: `%s — ${business.tradingName}`,
    },
    // Deliberately not business.summary: that is 318 characters, written to
    // be read on the About page. A meta description is truncated by Google at
    // roughly 160, so this is a purpose-written one at 152.
    description: SHARE_DESCRIPTION,
    applicationName: business.tradingName,
    authors: [{ name: business.tradingName }],
    keywords: [
      "plant hire Middelburg",
      "dozer hire Mpumalanga",
      "earthmoving contractor Middelburg",
      "excavator hire Witbank",
      "haul road construction",
      "heavy diesel engine overhaul",
      "transmission rebuild Mpumalanga",
      "24 hour breakdown service mining",
      "TLB and ADT hire coalfields",
      "mining plant maintenance Middelburg",
    ],
    openGraph: {
      type: "website",
      locale: "en_ZA",
      siteName: business.tradingName,
      // Every other page sets its own through buildMetadata. The homepage
      // defines no metadata of its own, so without this it shipped no og:url.
      url: SITE_URL,
      title: `${business.tradingName} — Plant Hire, Earthmoving & Heavy Mechanical`,
      // Share cards truncate around 200 characters, so they take the short
      // description rather than the 318-character page copy.
      description: SHARE_DESCRIPTION,
      images: ogImage,
    },
    twitter: {
      card: "summary_large_image",
      title: `${business.tradingName} — Plant Hire, Earthmoving & Heavy Mechanical`,
      description: SHARE_DESCRIPTION,
      images: ogImage,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    alternates: { canonical: "/" },
  };
}

export const viewport: Viewport = {
  themeColor: "#07090c",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-ZA"
      className={`${archivo.variable} ${inter.variable} ${mono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
