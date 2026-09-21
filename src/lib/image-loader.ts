/**
 * Custom image loader for the static export.
 *
 * The problem it solves
 * ---------------------
 * The export target has no Image Optimization API, so `images.unoptimized` was
 * set and `next/image` emitted a bare `src` with no `srcset`. Every visitor
 * therefore downloaded the largest rendition of every photograph: a phone on a
 * mobile connection pulled the same 900 KB file as a 4K desktop, and `sizes`
 * had no effect because there was nothing for the browser to choose between.
 *
 * The renditions were always there. `scripts/process-media.mjs` writes
 * 640/1080/1600/2200 for every image; nothing was pointing at them.
 *
 * How it works
 * ------------
 * Every generated file is named `<base>-<width>.webp`, and the `src` next/image
 * receives is the largest one. So the filename itself carries the ceiling, and
 * the loader can pick a rendition without consulting the manifest, which would
 * otherwise have to be shipped to the browser.
 *
 * `process-media.mjs` builds widths as `WIDTHS.filter(w => w <= source width)`,
 * which is always a prefix of the ladder. Any ladder width at or below the
 * ceiling is therefore guaranteed to exist on disk, and the two files have to
 * agree on this: if the ladder changes there, it changes here.
 */

/** Must match WIDTHS in scripts/process-media.mjs. */
const LADDER = [640, 1080, 1600, 2200] as const;

export default function leikahImageLoader({
  src,
  width,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  // Anything not produced by the media pipeline is passed through untouched:
  // brand SVGs, the partner mark, and any absolute URL.
  const match = /^(.*)-(\d+)\.webp$/.exec(src);
  if (!match) return src;

  const [, base, ceilingText] = match;
  const ceiling = Number(ceilingText);
  if (!Number.isFinite(ceiling)) return src;

  /**
   * Smallest rendition that covers the request, capped at what exists.
   *
   * The 0.8 is the part that matters. The ladder is coarse, and the browser
   * asks in Next's device sizes, so a 1920px screen asks for 1920 and a strict
   * "first rendition at least this wide" answer jumps a whole tier to 2200:
   * roughly 900 KB where 1600 would have done. Allowing the served file to be
   * up to a fifth narrower than asked lets 1920 take the 1600 and 1280 take
   * the 1080. The browser upscales by about 1.2x, which is not visible on a
   * photograph, and never applies where a rendition of the right size exists.
   */
  const acceptable = width * 0.8;
  const chosen = LADDER.find((w) => w >= acceptable && w <= ceiling) ?? ceiling;
  return `${base}-${chosen}.webp`;
}
