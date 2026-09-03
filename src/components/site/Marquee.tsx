import { cn } from "@/lib/utils";

/* ============================================================================
   MARQUEE BAND

   Duplicates its content once and translates by exactly -50%, which is what
   makes the loop seamless. The track pauses on hover so a reader can actually
   read it, and stops entirely under reduced motion.
   ========================================================================= */

export function Marquee({
  items,
  className,
  speed = 42,
}: {
  items: string[];
  className?: string;
  /** Seconds for one full pass. Longer = slower. */
  speed?: number;
}) {
  if (!items.length) return null;
  const track = [...items, ...items];

  return (
    <div
      className={cn("group relative flex overflow-hidden", className)}
      style={{
        maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <div
        className="flex shrink-0 items-center gap-10 pr-10 motion-safe:animate-[leikah-marquee_var(--speed)_linear_infinite] motion-safe:group-hover:[animation-play-state:paused]"
        style={{ "--speed": `${speed}s` } as React.CSSProperties}
        aria-hidden="false"
      >
        {track.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex shrink-0 items-center gap-10 text-sm font-medium whitespace-nowrap text-steel-400"
            aria-hidden={i >= items.length}
          >
            {item}
            <span aria-hidden="true" className="size-1 shrink-0 rotate-45 bg-gold-500/60" />
          </span>
        ))}
      </div>
    </div>
  );
}
