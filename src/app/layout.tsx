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
      default: `${business.tradingName} — Plant Hire, Earthmoving & Heavy Mechanical | Middelburg`,
      template: `%s — ${business.tradingName}`,
    },
    description: business.summary,
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
      title: `${business.tradingName} — Plant Hire, Earthmoving & Heavy Mechanical`,
      description: business.summary,
      images: ogImage,
    },
    twitter: {
      card: "summary_large_image",
      title: `${business.tradingName} — Plant Hire, Earthmoving & Heavy Mechanical`,
      description: business.summary,
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
