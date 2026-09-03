"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/* ============================================================================
   ANIMATED COUNTER

   Counts once, on entry, with an ease-out so the last few digits settle rather
   than snapping. Reduced motion gets the final value immediately — a counter
   that animates is decoration, and the number is the content.

   The initial render is always 0, on the server and on the client alike, and
   nothing in the returned markup depends on `useReducedMotion` — that hook
   resolves to null on the server and to the real preference after hydration,
   so reading it during render is a guaranteed text mismatch.

   The element reserves its width via tabular figures, so the layout around it
   never reflows while the digits change.
   ========================================================================= */

export function Counter({
  value,
  prefix,
  suffix,
  duration = 1600,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;

    // Reduced motion jumps to the final value — but it does so from inside a
    // frame callback rather than synchronously in the effect body. Deriving it
    // during render instead would print the final value on the client's first
    // pass and 0 on the server's, which is a text hydration mismatch.
    if (reduced) {
      const jump = requestAnimationFrame(() => setDisplay(value));
      return () => cancelAnimationFrame(jump);
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // easeOutExpo — fast out of the gate, settles on the final digits.
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setDisplay(Math.round(eased * value));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration, reduced]);

  return (
    <span ref={ref} className={cn("tabular", className)}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
