/**
 * Turns the photographed ISM badge into a usable logo asset.
 *
 * The source is a photograph of a brushed-metal badge on a dark speckled
 * surface. Dropped straight onto the site it would read as a photo of a sign,
 * not as a mark — and its own black background would sit as a visible rectangle
 * over the hero photography.
 *
 * So the letterforms are lifted out using luminance as an alpha channel: the
 * metal becomes opaque white, the dark ground becomes fully transparent. The
 * result tints to any colour in CSS and sits on any background.
 *
 * Run: node scripts/extract-partner-mark.mjs
 */
import sharp from "sharp";
import path from "node:path";
import { mkdir } from "node:fs/promises";

const SRC = path.resolve(process.cwd(), "..", "assest", "logo", "IMG_0546.jpg");
const OUT_DIR = path.resolve(process.cwd(), "public", "brand");

// Tight crop on the letterforms, including the underscore accent below the S.
const CROP = { left: 52, top: 122, width: 900, height: 472 };

/** Luminance below this is background; above it is metal. */
const FLOOR = 78;
const CEIL = 205;

async function run() {
  await mkdir(OUT_DIR, { recursive: true });

  const { data, info } = await sharp(SRC)
    .extract(CROP)
    .greyscale()
    .normalise()
    .blur(0.4) // knocks back sensor noise in the dark ground
    .raw()
    .toBuffer({ resolveWithObject: true });

  const px = info.width * info.height;
  const rgba = Buffer.alloc(px * 4);

  for (let i = 0; i < px; i++) {
    const lum = data[i * info.channels];

    // Map the metal range onto 0–255 and clip everything below the floor, so
    // the speckled background disappears completely rather than leaving dust.
    let a = (lum - FLOOR) / (CEIL - FLOOR);
    a = a <= 0 ? 0 : a >= 1 ? 1 : a;
    // Slight gamma lift so the bevelled edges stay crisp rather than muddy.
    a = Math.pow(a, 0.78);

    rgba[i * 4] = 255;
    rgba[i * 4 + 1] = 255;
    rgba[i * 4 + 2] = 255;
    rgba[i * 4 + 3] = Math.round(a * 255);
  }

  const base = sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } });

  await base
    .clone()
    .resize({ width: 640, withoutEnlargement: true })
    .trim({ threshold: 2 })
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT_DIR, "partner-ism.png"));

  const meta = await sharp(path.join(OUT_DIR, "partner-ism.png")).metadata();
  console.log(`partner-ism.png  ${meta.width}×${meta.height}`);

  // A dark-ground version for use on light sections.
  await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .resize({ width: 640, withoutEnlargement: true })
    .trim({ threshold: 2 })
    .negate({ alpha: false })
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT_DIR, "partner-ism-dark.png"));

  console.log("partner-ism-dark.png written");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
