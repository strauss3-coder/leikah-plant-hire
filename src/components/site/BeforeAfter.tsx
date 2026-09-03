"use client";

import { useCallback, useRef, useState } from "react";
import { SplitSquareHorizontal } from "lucide-react";
import { Media } from "@/components/ui/Media";
import { getMedia } from "@/lib/cms/media";
import type { MediaRef } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

/* ============================================================================
   BEFORE / AFTER

   Drag, click or arrow-key the divider. The handle is a real slider input
   positioned over the image rather than a mouse-only affordance, so the control
   is operable from the keyboard and announced correctly.
   ========================================================================= */

export function BeforeAfter({
  before,
  after,
  caption,
  className,
}: {
  before: MediaRef;
  after: MediaRef;
  caption?: string;
  className?: string;
}) {
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const asset = getMedia(after);

  const setFromClientX = useCallback((clientX: number) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  return (
    <figure className={cn("flex flex-col gap-4", className)}>
      <div
        ref={frameRef}
        className="chamfer relative w-full select-none overflow-hidden border border-steel-600/18"
        style={{ aspectRatio: `${asset.width} / ${asset.height}` }}
        onPointerDown={(e) => {
          setDragging(true);
          e.currentTarget.setPointerCapture(e.pointerId);
          setFromClientX(e.clientX);
        }}
        onPointerMove={(e) => dragging && setFromClientX(e.clientX)}
        onPointerUp={(e) => {
          setDragging(false);
          e.currentTarget.releasePointerCapture(e.pointerId);
        }}
      >
        <Media
          media={after}
          alt=""
          sizes="(min-width: 1024px) 70vw, 100vw"
          className="absolute inset-0 size-full"
          imageClassName="object-cover"
          ratio="auto"
        />

        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <Media
            media={before}
            alt=""
            sizes="(min-width: 1024px) 70vw, 100vw"
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
          <span className="chamfer-sm absolute top-1/2 left-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-gold-500 text-ink-950 shadow-lg shadow-black/40">
            <SplitSquareHorizontal className="size-5" />
          </span>
        </div>

        <span className="chamfer-sm pointer-events-none absolute left-3 top-3 bg-ink-950/85 px-2.5 py-1 text-[0.625rem] font-semibold tracking-wide text-steel-200 uppercase backdrop-blur">
          Before
        </span>
        <span className="chamfer-sm pointer-events-none absolute right-3 top-3 bg-gold-500/90 px-2.5 py-1 text-[0.625rem] font-semibold tracking-wide text-ink-950 uppercase">
          After
        </span>

        {/* The actual control. Visually flush with the frame, fully operable. */}
        <input
          type="range"
          min={0}
          max={100}
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          aria-label="Reveal the before or after image"
          className="absolute inset-x-0 bottom-0 h-11 w-full cursor-ew-resize opacity-0"
        />
      </div>

      {caption && (
        <figcaption className="text-sm leading-relaxed text-steel-400">{caption}</figcaption>
      )}
    </figure>
  );
}
