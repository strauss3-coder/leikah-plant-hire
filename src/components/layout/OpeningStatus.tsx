"use client";

import { useEffect, useState } from "react";
import type { OperatingHours } from "@/lib/cms/types";
import { johannesburgNow } from "@/lib/utils";
import { cn } from "@/lib/utils";

/* ============================================================================
   OPENING STATUS

   Reads the CMS operating hours and says whether the yard is open right now, in
   South African time regardless of where the visitor is. It renders "closed" on
   the server and corrects on mount, because a server-rendered "open" that is
   wrong for the reader's clock is worse than a moment of caution.
   ========================================================================= */

function minutesToLabel(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function nextOpening(hours: OperatingHours[], day: number) {
  for (let i = 1; i <= 7; i++) {
    const next = hours.find((h) => h.day === (day + i) % 7);
    if (next && (next.alwaysOpen || next.opens !== null)) return next;
  }
  return null;
}

export function OpeningStatus({
  hours,
  className,
}: {
  hours: OperatingHours[];
  className?: string;
}) {
  const [state, setState] = useState<{ open: boolean; label: string } | null>(null);

  useEffect(() => {
    const compute = () => {
      const { day, minutes } = johannesburgNow();
      const today = hours.find((h) => h.day === day);

      if (today?.alwaysOpen) {
        setState({ open: true, label: "Open now — 24 hours" });
        return;
      }

      if (today && today.opens !== null && today.closes !== null) {
        if (minutes >= today.opens && minutes < today.closes) {
          setState({ open: true, label: `Open now — until ${minutesToLabel(today.closes)}` });
          return;
        }
        if (minutes < today.opens) {
          setState({ open: false, label: `Opens today at ${minutesToLabel(today.opens)}` });
          return;
        }
      }

      const next = nextOpening(hours, day);
      setState({
        open: false,
        label: next
          ? `Yard closed — opens ${next.label} ${next.opens !== null ? minutesToLabel(next.opens) : ""}`.trim()
          : "Yard closed",
      });
    };

    compute();
    const id = setInterval(compute, 60_000);
    return () => clearInterval(id);
  }, [hours]);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center gap-2.5 text-sm">
        <span
          className={cn(
            "size-2 rounded-full",
            state?.open ? "bg-signal-green" : "bg-steel-500",
          )}
          aria-hidden="true"
        />
        <span className={state?.open ? "text-steel-200" : "text-steel-400"}>
          {state?.label ?? "Checking yard hours…"}
        </span>
      </div>
      <p className="text-xs text-steel-500">
        Breakdown dispatch is answered 24 hours, every day of the year.
      </p>
    </div>
  );
}
