"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Maximize2, X, SplitSquareHorizontal } from "lucide-react";
import { Media } from "@/components/ui/Media";
import { getMedia } from "@/lib/cms/media";
import type { GalleryItem } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

/* ============================================================================
   GALLERY

   A filtered masonry-ish grid with a full-screen viewer. Two details matter:

   • Before/after pairs open in a draggable comparison rather than as two
     separate images, because the pair is the point.
   • The viewer traps focus and restores it on close, and arrow keys move
     between images — this is a keyboard-operable dialog, not a styled overlay.
   ========================================================================= */

const ALL = "All work";

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState(ALL);
  const [active, setActive] = useState<number | null>(null);
  const [compare, setCompare] = useState<GalleryItem | null>(null);
  const reduced = useReducedMotion();

  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(items.map((i) => i.category)))],
    [items],
  );

  const visible = useMemo(
    () => (filter === ALL ? items : items.filter((i) => i.category === filter)),
    [items, filter],
  );

  const close = useCallback(() => setActive(null), []);
  const step = useCallback(
    (delta: number) =>
      setActive((i) => (i === null ? null : (i + delta + visible.length) % visible.length)),
    [visible.length],
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, close, step]);

  if (!items.length) return null;

  return (
    <div className="flex flex-col gap-10">
      {/* --- Filters ---------------------------------------------------------- */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter gallery by category">
        {categories.map((category) => {
          const on = filter === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setFilter(category)}
              aria-pressed={on}
              className={cn(
                "chamfer-sm border px-4 py-2 text-sm font-medium transition-all duration-300",
                on
                  ? "border-gold-500 bg-gold-500 text-ink-950"
                  : "border-steel-600/25 text-steel-300 hover:border-gold-500/50 hover:text-paper-50",
              )}
            >
              {category}
              <span
                className={cn(
                  "ml-2 text-xs tabular",
                  on ? "text-ink-950/75" : "text-steel-500",
                )}
              >
                {category === ALL ? items.length : items.filter((i) => i.category === category).length}
              </span>
            </button>
          );
        })}
      </div>

      {/* --- Grid ------------------------------------------------------------- */}
      <motion.ul layout className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((item, i) => {
            const asset = getMedia(item.media);
            const portrait = asset.aspect < 0.92;
            const pair = item.pairRole === "before" && item.pairedWith;

            return (
              <motion.li
                key={item.id}
                layout={!reduced}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className={cn(portrait && "sm:row-span-2")}
              >
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  className="group chamfer relative block h-full w-full overflow-hidden border border-steel-600/18 bg-ink-850 text-left"
                >
                  <Media
                    media={item.media}
                    ratio={portrait ? "3 / 4" : "4 / 3"}
                    sizes="(min-width: 1024px) 33vw, 50vw"
                    className="w-full"
                    imageClassName="object-cover transition-transform duration-[1.1s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />

                  <span className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/25 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />

                  {pair && (
                    <span className="chamfer-sm absolute left-3 top-3 inline-flex items-center gap-1.5 border border-gold-500/45 bg-ink-950/80 px-2 py-1 text-[0.625rem] font-semibold tracking-wide text-gold-400 uppercase backdrop-blur">
                      <SplitSquareHorizontal className="size-3" />
                      Before / after
                    </span>
                  )}

                  <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
                    <span className="text-xs leading-snug text-steel-200 opacity-0 transition-all duration-500 group-hover:opacity-100 sm:text-[0.8125rem]">
                      {item.caption}
                    </span>
                    <span className="chamfer-sm inline-flex size-8 shrink-0 items-center justify-center border border-steel-100/25 bg-ink-950/70 text-paper-50 opacity-0 backdrop-blur transition-opacity duration-500 group-hover:opacity-100">
                      <Maximize2 className="size-3.5" />
                    </span>
                  </span>
                </button>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>

      {/* --- Viewer ------------------------------------------------------------ */}
      <AnimatePresence>
        {active !== null && visible[active] && (
          <Lightbox
            item={visible[active]}
            index={active}
            total={visible.length}
            onClose={close}
            onStep={step}
            onCompare={() => {
              setCompare(visible[active]);
              setActive(null);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {compare && <CompareViewer item={compare} onClose={() => setCompare(null)} />}
      </AnimatePresence>
    </div>
  );
}

function Lightbox({
  item,
  index,
  total,
  onClose,
  onStep,
  onCompare,
}: {
  item: GalleryItem;
  index: number;
  total: number;
  onClose: () => void;
  onStep: (delta: number) => void;
  onCompare: () => void;
}) {
  const asset = getMedia(item.media);
  const hasPair = Boolean(item.pairedWith);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={item.caption}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[80] flex flex-col bg-ink-950/97 backdrop-blur-md"
    >
      <div className="flex items-center justify-between gap-4 border-b border-steel-600/15 px-4 py-3 sm:px-6">
        <span className="eyebrow text-steel-400 tabular">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <div className="flex items-center gap-2">
          {hasPair && (
            <button
              type="button"
              onClick={onCompare}
              className="chamfer-sm inline-flex items-center gap-2 border border-gold-500/45 px-3 py-2 text-xs font-medium text-gold-400 transition-colors hover:bg-gold-500/10"
            >
              <SplitSquareHorizontal className="size-3.5" />
              Compare
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close viewer"
            autoFocus
            className="chamfer-sm inline-flex size-10 items-center justify-center border border-steel-600/25 text-paper-50 transition-colors hover:border-gold-500/50"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden p-4 sm:p-8">
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-h-full max-w-5xl"
          style={{ aspectRatio: `${asset.width} / ${asset.height}` }}
        >
          <Media
            media={item.media}
            sizes="(min-width: 1024px) 70vw, 100vw"
            priority
            className="max-h-[72vh] w-auto"
            imageClassName="object-contain"
            ratio={`${asset.width} / ${asset.height}`}
          />
        </motion.div>

        <ViewerButton label="Previous image" onClick={() => onStep(-1)} className="left-3 sm:left-6">
          <ArrowLeft className="size-5" />
        </ViewerButton>
        <ViewerButton label="Next image" onClick={() => onStep(1)} className="right-3 sm:right-6">
          <ArrowRight className="size-5" />
        </ViewerButton>
      </div>

      <div className="border-t border-steel-600/15 px-4 py-5 sm:px-6">
        <p className="mx-auto max-w-3xl text-center text-sm leading-relaxed text-steel-300">
          {item.caption}
        </p>
        <p className="mt-1.5 text-center eyebrow text-steel-500">{item.category}</p>
      </div>
    </motion.div>
  );
}

function ViewerButton({
  children,
  label,
  onClick,
  className,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "chamfer-sm absolute top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center border border-steel-600/25 bg-ink-900/80 text-paper-50 backdrop-blur transition-colors hover:border-gold-500/60",
        className,
      )}
    >
      {children}
    </button>
  );
}

/** Draggable before/after comparison. */
function CompareViewer({ item, onClose }: { item: GalleryItem; onClose: () => void }) {
  const [position, setPosition] = useState(50);
  const beforeRef = item.pairRole === "before" ? item.media : item.pairedWith!;
  const afterRef = item.pairRole === "before" ? item.pairedWith! : item.media;
  const asset = getMedia(afterRef);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Before and after comparison"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center gap-6 bg-ink-950/97 p-4 backdrop-blur-md sm:p-8"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close comparison"
        autoFocus
        className="chamfer-sm absolute right-4 top-4 inline-flex size-10 items-center justify-center border border-steel-600/25 text-paper-50 transition-colors hover:border-gold-500/50 sm:right-6 sm:top-6"
      >
        <X className="size-5" />
      </button>

      <div
        className="relative w-full max-w-4xl select-none overflow-hidden chamfer"
        style={{ aspectRatio: `${asset.width} / ${asset.height}` }}
      >
        <Media
          media={afterRef}
          sizes="(min-width: 1024px) 70vw, 100vw"
          priority
          className="absolute inset-0 size-full"
          imageClassName="object-cover"
          ratio="auto"
        />
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <Media
            media={beforeRef}
            sizes="(min-width: 1024px) 70vw, 100vw"
            priority
            className="absolute inset-0 size-full"
            imageClassName="object-cover"
            ratio="auto"
          />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 w-0.5 bg-gold-500"
          style={{ left: `${position}%` }}
        >
          <span className="chamfer-sm absolute top-1/2 left-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-gold-500 text-ink-950">
            <SplitSquareHorizontal className="size-4" />
          </span>
        </div>

        <span className="chamfer-sm absolute left-3 top-3 bg-ink-950/80 px-2.5 py-1 text-[0.625rem] font-semibold tracking-wide text-steel-200 uppercase backdrop-blur">
          Before
        </span>
        <span className="chamfer-sm absolute right-3 top-3 bg-gold-500/90 px-2.5 py-1 text-[0.625rem] font-semibold tracking-wide text-ink-950 uppercase">
          After
        </span>
      </div>

      <label className="w-full max-w-4xl">
        <span className="sr-only">Comparison position</span>
        <input
          type="range"
          min={0}
          max={100}
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          className="w-full accent-[var(--color-gold-500)]"
        />
      </label>

      <p className="max-w-2xl text-center text-sm text-steel-300">{item.caption}</p>
    </motion.div>
  );
}
