"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { Accordion } from "@/components/ui/Accordion";
import type { Faq } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

/* ============================================================================
   FAQ BROWSER

   Category rail plus a plain substring search over question and answer. No
   fuzzy matching library — with a set this size, an honest substring match is
   faster and never returns a surprising result.
   ========================================================================= */

const ALL = "All questions";

export function FaqBrowser({ faqs }: { faqs: Faq[] }) {
  const [category, setCategory] = useState(ALL);
  const [query, setQuery] = useState("");

  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(faqs.map((f) => f.category)))],
    [faqs],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return faqs.filter((f) => {
      const inCategory = category === ALL || f.category === category;
      if (!inCategory) return false;
      if (!q) return true;
      return (
        f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
      );
    });
  }, [faqs, category, query]);

  return (
    <div className="grid gap-12 lg:grid-cols-[16rem_1fr] lg:gap-16">
      {/* --- Rail ------------------------------------------------------------ */}
      <div className="flex flex-col gap-6 lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
        <label className="relative block">
          <span className="sr-only">Search questions</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-steel-500"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions"
            className="chamfer-sm h-12 w-full border border-steel-600/25 bg-ink-900 pl-10 pr-10 text-sm text-paper-50 placeholder:text-steel-500 focus:border-gold-500/60 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-steel-500 transition-colors hover:text-gold-400"
            >
              <X className="size-4" />
            </button>
          )}
        </label>

        <nav aria-label="FAQ categories" className="flex flex-wrap gap-2 lg:flex-col">
          {categories.map((item) => {
            const on = category === item;
            const count =
              item === ALL ? faqs.length : faqs.filter((f) => f.category === item).length;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                aria-pressed={on}
                className={cn(
                  "chamfer-sm flex items-center justify-between gap-3 border px-4 py-2.5 text-left text-sm font-medium transition-all duration-300",
                  on
                    ? "border-gold-500 bg-gold-500 text-ink-950"
                    : "border-steel-600/22 text-steel-300 hover:border-gold-500/45 hover:text-paper-50",
                )}
              >
                {item}
                <span className={cn("text-xs tabular", on ? "text-ink-950/75" : "text-steel-500")}>
                  {count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* --- Answers ---------------------------------------------------------- */}
      <div>
        {visible.length > 0 ? (
          <Accordion
            key={`${category}-${query}`}
            items={visible.map((f) => ({
              id: f.id,
              question: f.question,
              answer: f.answer,
              meta: category === ALL ? f.category : undefined,
            }))}
            defaultOpen={0}
          />
        ) : (
          <p className="py-16 text-center text-sm text-steel-400">
            Nothing matches &ldquo;{query}&rdquo;. Try a different word, or ask us directly.
          </p>
        )}
      </div>
    </div>
  );
}
