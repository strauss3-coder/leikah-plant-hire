import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Media } from "@/components/ui/Media";
import { CtaBanner } from "@/components/site/CtaBanner";
import { getBusiness, getNews, getPageMeta } from "@/lib/cms";
import { buildMetadata, JsonLd, breadcrumbSchema } from "@/lib/seo";
import { formatDate, readingTime } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageMeta("news");
  return buildMetadata({
    title: page.title,
    description: page.lead,
    path: "/news",
    image: page.image,
    seo: page.seo,
  });
}

export default async function NewsPage() {
  const [page, posts, business] = await Promise.all([
    getPageMeta("news"),
    getNews(),
    getBusiness(),
  ]);

  const [lead, ...rest] = posts;

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "News & Insight", path: "/news" },
        ])}
      />

      <PageHeader
        blueprint="dozer"
        eyebrow={page.eyebrow}
        headline={page.headline}
        lead={page.lead}
        image={page.image}
        trail={[{ label: "Home", href: "/" }, { label: "News" }]}
        size="compact"
      />

      <Section tone="darker">
        <div className="shell flex flex-col gap-10">
          {!posts.length && (
            <p className="py-16 text-center text-sm text-steel-400">
              No articles have been published yet.
            </p>
          )}

          {lead && (
            <Reveal>
              <Link
                href={`/news/${lead.slug}`}
                className="group chamfer relative grid overflow-hidden border border-steel-600/18 bg-ink-900 transition-all duration-500 hover:border-gold-500/45 lg:grid-cols-2"
              >
                <div className="relative overflow-hidden">
                  <Media
                    media={lead.image}
                    alt=""
                    ratio="16 / 10"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    priority
                    className="h-full w-full"
                    imageClassName="object-cover transition-transform duration-[1.1s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 to-transparent" />
                </div>

                <div className="flex flex-col justify-center gap-5 p-8 lg:p-12">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className="eyebrow text-gold-400">{lead.category}</span>
                    <span aria-hidden="true" className="size-1 rotate-45 bg-steel-600/50" />
                    <time dateTime={lead.publishedAt} className="text-xs text-steel-500">
                      {formatDate(lead.publishedAt)}
                    </time>
                    <span aria-hidden="true" className="size-1 rotate-45 bg-steel-600/50" />
                    <span className="text-xs text-steel-500">
                      {readingTime(lead.body)} min read
                    </span>
                  </div>

                  <h2 className="text-display-3 text-paper-50">{lead.title}</h2>
                  <p className="text-sm leading-relaxed text-steel-400 sm:text-base">
                    {lead.excerpt}
                  </p>

                  <span className="inline-flex items-center gap-2 text-sm font-medium text-gold-400">
                    Read the article
                    <ArrowUpRight className="size-4 transition-transform duration-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          )}

          {rest.length > 0 && (
            <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
              {rest.map((post) => (
                <RevealItem key={post.id} className="flex">
                  <Link
                    href={`/news/${post.slug}`}
                    className="group chamfer flex w-full flex-col overflow-hidden border border-steel-600/18 bg-ink-900 transition-all duration-500 hover:-translate-y-1 hover:border-gold-500/45"
                  >
                    <div className="relative overflow-hidden">
                      <Media
                        media={post.image}
                        alt=""
                        ratio="16 / 10"
                        sizes="(min-width: 1024px) 33vw, 50vw"
                        className="w-full"
                        imageClassName="object-cover transition-transform duration-[1.1s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-3 p-6">
                      <div className="flex items-center gap-3">
                        <span className="eyebrow text-gold-400">{post.category}</span>
                        <time dateTime={post.publishedAt} className="text-xs text-steel-500">
                          {formatDate(post.publishedAt)}
                        </time>
                      </div>
                      <h3 className="text-lg leading-snug font-bold text-paper-50">{post.title}</h3>
                      <p className="text-sm leading-relaxed text-steel-400">{post.excerpt}</p>
                      <ArrowUpRight className="mt-auto size-4 text-steel-500 transition-all duration-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold-400" />
                    </div>
                  </Link>
                </RevealItem>
              ))}
            </RevealGroup>
          )}
        </div>
      </Section>

      <CtaBanner
        headline="Got a maintenance problem you keep paying for twice?"
        body="Describe it. If it is something we have seen before, we will tell you what usually causes it — whether or not you end up hiring us."
        phone={business.phone}
        primaryLabel="Ask us about it"
        primaryHref="/contact"
      />
    </>
  );
}
