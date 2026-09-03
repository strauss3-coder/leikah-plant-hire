import Image from "next/image";
import { getMedia, assetPath } from "@/lib/cms/media";
import type { MediaRef } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

/* ============================================================================
   MEDIA

   Every photograph on the site goes through here. It resolves a manifest slug
   to the widest rendition that exists, carries the generated LQIP so nothing
   flashes empty, and reserves the aspect ratio so no image causes layout shift.

   `sizes` is required on anything that is not full-bleed — getting it wrong is
   the single most common cause of a site downloading 2 MB to fill 400 px.
   ========================================================================= */

export function Media({
  media,
  alt,
  className,
  imageClassName,
  sizes = "100vw",
  priority = false,
  fill = true,
  ratio,
  quality = 82,
  loading,
}: {
  media: MediaRef;
  /** Overrides the manifest alt text. Pass "" for decorative images. */
  alt?: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  /** CSS aspect-ratio for the frame; defaults to the image's own. */
  ratio?: string;
  quality?: number;
  loading?: "eager" | "lazy";
}) {
  const asset = getMedia(media);

  if (!asset.src) {
    return (
      <div
        className={cn("bg-ink-800 hairline border", className)}
        style={{ aspectRatio: ratio ?? "16 / 9" }}
        aria-hidden="true"
      />
    );
  }

  const resolvedAlt = alt ?? asset.alt;
  const src = assetPath(asset.src);

  if (!fill) {
    return (
      <Image
        src={src}
        alt={resolvedAlt}
        width={asset.width}
        height={asset.height}
        sizes={sizes}
        quality={quality}
        priority={priority}
        loading={loading ?? (priority ? undefined : "lazy")}
        placeholder={asset.blurDataURL ? "blur" : "empty"}
        blurDataURL={asset.blurDataURL || undefined}
        className={cn("h-auto w-full", imageClassName, className)}
      />
    );
  }

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ aspectRatio: ratio ?? `${asset.width} / ${asset.height}` }}
    >
      <Image
        src={src}
        alt={resolvedAlt}
        fill
        sizes={sizes}
        quality={quality}
        priority={priority}
        loading={loading ?? (priority ? undefined : "lazy")}
        placeholder={asset.blurDataURL ? "blur" : "empty"}
        blurDataURL={asset.blurDataURL || undefined}
        className={cn("object-cover", imageClassName)}
      />
    </div>
  );
}

/**
 * The gradient scrim that makes white type legible over photography. Kept as a
 * component so the ramp is identical on every hero and card in the build.
 */
export function MediaScrim({
  className,
  from = "bottom",
  intensity = "medium",
}: {
  className?: string;
  from?: "bottom" | "left" | "top";
  intensity?: "light" | "medium" | "heavy";
}) {
  const ramp = {
    light: "40%",
    medium: "68%",
    heavy: "88%",
  }[intensity];

  const direction = {
    bottom: "to top",
    left: "to right",
    top: "to bottom",
  }[from];

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        background: `linear-gradient(${direction}, color-mix(in oklab, var(--color-ink-950) ${ramp}, transparent) 0%, transparent 62%)`,
      }}
    />
  );
}
