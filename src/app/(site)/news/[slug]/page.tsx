import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Media } from "@/components/ui/Media";
import { CtaBanner } from "@/components/site/CtaBanner";
import { Article } from "@/components/site/Article";
import { getBusiness, getNews, getNewsBySlug } from "@/lib/cms";
import { getMedia } from "@/lib/cms/media";
import { buildMetadata, JsonLd, breadcrumbSchema, absoluteUrl, SITE_URL } from "@/lib/seo";
import { formatDate, readingTime } from "@/lib/utils";

export async function generateStaticParams() {
  const posts = await getNews();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/news/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getNewsBySlug(slug);
  if (!post) return {};

  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/news/${post.slug}`,
    image: post.image,
    type: "article",
  });
}

export default async function NewsArticlePage({ params }: PageProps<"/news/[slug]">) {
  const { slug } = await params;
  const [post, all, business] = await Promise.all([
    getNewsBySlug(slug),
    getNews(),
    getBusiness(),
  ]);

  if (!post) notFound();

  const more = all.filter((p) => p.slug !== post.slug).slice(0, 3);
  const image = getMedia(post.image);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.publishedAt,
          author: { "@type": "Organization", name: post.author },
          publisher: { "@id": `${SITE_URL}#organisation` },
          ...(image.src ? { image: absoluteUrl(image.src) } : {}),
          mainEntityOfPage: absoluteUrl(`/news/${post.slug}`),
        }}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "News", path: "/news" },
          { name: post.title, path: `/news/${post.slug}` },
        ])}
      />

      <PageHeader
        blueprint="engine"
        eyebrow={post.category}
        headline={post.title}
        lead={post.excerpt}
        image={post.image}
        trail={[
          { label: "Home", href: "/" },
          { label: "News", href: "/news" },
          { label: post.category },
        ]}
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-steel-400">
          <span>{post.author}</span>
          <span aria-hidden="true" className="size-1 rotate-45 bg-steel-600/50" />
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          <span aria-hidden="true" className="size-1 rotate-45 bg-steel-600/50" />
          <span>{readingTime(post.body)} min read</span>
        </div>
      </PageHeader>

      <Section tone="darker">
        <div className="shell">
          <Reveal className="mx-auto max-w-3xl">
            <Article body={post.body} />
          </Reveal>

          <div className="mx-auto mt-14 max-w-3xl border-t border-steel-600/15 pt-8">
            <Link
              href="/news"
              className="group inline-flex items-center gap-2 text-sm font-medium text-gold-400 hover:text-gold-300"
            >
              <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
              All articles
            </Link>
          </div>
        </div>
      </Section>

      {more.length > 0 && (
        <Section tone="dark" tight>
          <div className="shell flex flex-col gap-8">
            <SectionHeading eyebrow="Keep reading" title="More from the yard" size="md" />
            <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
              {more.map((item) => (
                <RevealItem key={item.id} className="flex">
                  <Link
                    href={`/news/${item.slug}`}
                    className="group chamfer flex w-full flex-col overflow-hidden border border-steel-600/18 bg-ink-850 transition-all duration-500 hover:-translate-y-1 hover:border-gold-500/45"
                  >
                    <Media
                      media={item.image}
                      alt=""
                      ratio="16 / 10"
                      sizes="(min-width: 1024px) 33vw, 50vw"
                      className="w-full"
                      imageClassName="object-cover transition-transform duration-[1.1s] group-hover:scale-105"
                    />
                    <div className="flex flex-1 flex-col gap-3 p-6">
                      <span className="eyebrow text-gold-400">{item.category}</span>
                      <h3 className="text-base leading-snug font-bold text-paper-50">
                        {item.title}
                      </h3>
                      <ArrowUpRight className="mt-auto size-4 text-steel-500 transition-all duration-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold-400" />
                    </div>
                  </Link>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </Section>
      )}

      <CtaBanner
        headline="Want this applied to your fleet?"
        body="Send us your machine list and we will show you what the planned version of your current maintenance spend actually looks like."
        phone={business.phone}
        primaryLabel="Request a fleet audit"
        primaryHref="/quote?service=preventive-maintenance"
      />
    </>
  );
}
