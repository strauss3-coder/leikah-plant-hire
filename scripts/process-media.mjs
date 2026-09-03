/**
 * Ingests the client's raw photography from ../assest, trims letterbox bars,
 * normalises to web-safe sizes and emits an image manifest with LQIP blur data.
 *
 * Run: node scripts/process-media.mjs
 */
import sharp from "sharp";
import { mkdir, writeFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const RAW = path.resolve(process.cwd(), "..", "assest");
const OUT = path.resolve(process.cwd(), "public", "media");
const MANIFEST = path.resolve(process.cwd(), "src", "content", "media-manifest.json");

/** Source file -> semantic slug + editorial metadata. */
const CATALOGUE = [
  { src: "images /IMG_0518.JPG", slug: "excavator-coal-bench-fleet", trim: false,
    title: "Primary loading fleet on an active coal bench",
    alt: "Two large tracked excavators positioned on a coal bench at an open-cast mine under heavy cloud",
    tags: ["earthmoving", "mining", "plant"] },
  { src: "images /IMG_0519.JPG", slug: "liebherr-excavator-standby", trim: false,
    title: "Liebherr R976 on standby between cuts",
    alt: "A Liebherr R976 tracked excavator parked beside a service vehicle on a haul road",
    tags: ["earthmoving", "plant", "fleet"] },
  { src: "images /IMG_0520.JPG", slug: "dozer-lowbed-loadout-pit", trim: false,
    title: "Dozer load-out from an open pit",
    alt: "A Caterpillar dozer secured on a lowbed trailer with the terraced walls of an open pit behind it",
    tags: ["logistics", "mining", "plant"] },
  { src: "images /IMG_0522.JPG", slug: "excavator-adt-loading-coal", trim: true,
    title: "Excavator loading articulated dump trucks",
    alt: "An excavator loading an articulated dump truck against a black coal highwall",
    tags: ["earthmoving", "mining"] },
  { src: "images /IMG_0523.JPG", slug: "adt-lowbed-transport-dusk", trim: true,
    title: "Articulated dump truck in transit",
    alt: "A Bell articulated dump truck loaded onto a lowbed trailer at golden hour",
    tags: ["logistics", "plant"] },
  { src: "images /IMG_0524.JPG", slug: "adt-lowbed-quarry-delivery", trim: false,
    title: "Plant delivery into a working quarry",
    alt: "A Bell B40D articulated dump truck being delivered by lowbed into a rock quarry",
    tags: ["logistics", "plant", "quarry"] },
  { src: "images /IMG_0525.JPG", slug: "diesel-engine-workshop-strip", trim: false,
    title: "Heavy diesel engine received for overhaul",
    alt: "A large Caterpillar diesel engine on a workshop stand awaiting strip-down",
    tags: ["mechanical", "workshop", "engines"] },
  { src: "images /IMG_0526.JPG", slug: "dozer-d10t-refurbished", trim: false,
    title: "Track-type tractor returned to service",
    alt: "A freshly refurbished Caterpillar D10T dozer standing on rock at a mine site",
    tags: ["plant", "mechanical", "fleet"] },
  { src: "images /IMG_0527.JPG", slug: "dozer-lowbed-haul-road", trim: false,
    title: "Dozer mobilisation to site",
    alt: "A Caterpillar dozer chained to a red lowbed trailer on a mine haul road under a wide sky",
    tags: ["logistics", "plant", "mining"] },
  { src: "images /IMG_0528.JPG", slug: "leikah-response-vehicle", trim: false,
    title: "Leikah rapid-response service vehicle",
    alt: "A Leikah-liveried Toyota Hilux service bakkie in gold and black branding",
    tags: ["brand", "fleet", "field-service"] },
  { src: "images /IMG_0529.JPG", slug: "fabrication-team-bowser", trim: false,
    title: "Fabrication team assembling a diesel bowser",
    alt: "Five technicians in high-visibility workwear and hard hats welding a steel diesel bowser in a workshop",
    tags: ["workshop", "fabrication", "team", "safety"] },
  { src: "images /IMG_0530.JPG", slug: "pit-dewatering-pump-set", trim: true,
    title: "Pit dewatering pump set in operation",
    alt: "A tractor-driven dewatering pump running lay-flat hose beside a flooded pit",
    tags: ["site-services", "mining"] },
  { src: "images /IMG_0531.JPG", slug: "hydraulic-valve-bank-inspection", trim: false,
    title: "Valve bank inspection during a hydraulic fault-find",
    alt: "Close inspection of hydraulic hoses and a valve bank contaminated with dust and oil",
    tags: ["hydraulics", "diagnostics", "mechanical"] },
  { src: "images /IMG_0532.JPG", slug: "hydraulic-hose-replacement", trim: true,
    title: "Replacement hose crimped and fitted on site",
    alt: "A newly crimped hydraulic hose fitted to an elbow union on yellow plant machinery",
    tags: ["hydraulics", "field-service", "mechanical"] },
  { src: "images /IMG_0533.JPG", slug: "final-drive-rebuild-complete", trim: false,
    title: "Final drive assembly rebuilt and repainted",
    alt: "A rebuilt final drive assembly painted yellow, lifted on slings outside the workshop",
    tags: ["mechanical", "powertrain", "workshop"] },
  { src: "images /IMG_0534.JPG", slug: "transmission-housing-overhaul", trim: false,
    title: "Transmission housing stripped for overhaul",
    alt: "A large yellow transmission housing on a pallet with the input hub exposed",
    tags: ["mechanical", "powertrain", "workshop"] },
  { src: "images /IMG_0535.JPG", slug: "adt-transmission-assembly", trim: false,
    title: "Articulated hauler transmission ready for fitment",
    alt: "A rebuilt Bell transmission assembly with a new filter fitted, standing on a pallet",
    tags: ["mechanical", "powertrain", "workshop"] },
  { src: "images /IMG_0536.JPG", slug: "engine-block-machined", trim: false,
    title: "Cylinder block cleaned and measured",
    alt: "A six-cylinder engine block stripped, cleaned and laid out for measurement",
    tags: ["engines", "workshop", "mechanical"] },
  { src: "images /IMG_0537.JPG", slug: "parts-dispatch-pallet", trim: false,
    title: "Consumables palletised for site dispatch",
    alt: "A shrink-wrapped pallet of parts lifted by forklift ready for dispatch to site",
    tags: ["supply", "logistics"] },
  { src: "images /IMG_0538.JPG", slug: "timing-gear-train-assembly", trim: false,
    title: "Gear train set and timed",
    alt: "The timing gear train of a heavy diesel engine, cleaned and assembled to specification",
    tags: ["engines", "workshop", "mechanical"] },
  { src: "images /IMG_0539.JPG", slug: "water-bowser-dust-suppression", trim: true,
    title: "Water bowser on dust suppression duty",
    alt: "An articulated water bowser truck parked beside a service vehicle on a haul road",
    tags: ["site-services", "plant", "fleet"] },
  { src: "images /IMG_0540.JPG", slug: "powertrain-assembly-bench", trim: true,
    title: "Engine and gearbox married on the bench",
    alt: "A heavy truck engine and gearbox assembly on a workshop stand with fuel lines fitted",
    tags: ["engines", "powertrain", "workshop"] },
  { src: "images /IMG_0541.JPG", slug: "reconditioned-block-lifted", trim: true,
    title: "Reconditioned block lifted for assembly",
    alt: "A reconditioned six-cylinder engine block suspended on lifting slings inside the workshop",
    tags: ["engines", "workshop"] },
  { src: "images /IMG_0542.JPG", slug: "engine-flywheel-housing", trim: false,
    title: "Long block built to OEM specification",
    alt: "A rebuilt long block engine with flywheel housing fitted, suspended in the workshop bay",
    tags: ["engines", "workshop", "mechanical"] },
  { src: "images /IMG_0543.JPG", slug: "dozer-d9t-dusk", trim: false,
    title: "D9T holding the line at last light",
    alt: "A Caterpillar D9T dozer silhouetted against a golden dusk sky on a mine site",
    tags: ["plant", "earthmoving", "hero"] },
  { src: "hero/IMG_0544.JPG", slug: "field-service-excavator-repair", trim: 40,
    title: "Field service crew on a mining excavator",
    alt: "A mobile field service team repairing a large Komatsu mining excavator on a coal stockpile under clear sky",
    tags: ["field-service", "mechanical", "mining", "hero"] },
];

const WIDTHS = [640, 1080, 1600, 2200];

async function run() {
  if (!existsSync(RAW)) throw new Error(`Raw asset directory not found: ${RAW}`);
  await mkdir(OUT, { recursive: true });
  await mkdir(path.dirname(MANIFEST), { recursive: true });

  const manifest = {};

  for (const item of CATALOGUE) {
    const input = path.join(RAW, item.src);
    if (!existsSync(input)) {
      console.warn(`  ! missing ${item.src}`);
      continue;
    }

    let pipeline = sharp(input).rotate();
    if (item.trim) {
      // Letterbox bars are flat black; trim only those. The threshold stays tight so
      // genuinely dark subject matter at the frame edge survives, except where a
      // source was exported with softer padding (declared per item).
      const threshold = typeof item.trim === "number" ? item.trim : 12;
      pipeline = pipeline.trim({ background: "#000000", threshold });
    }

    const buf = await pipeline.toBuffer();
    const meta = await sharp(buf).metadata();
    const widths = WIDTHS.filter((w) => w <= meta.width).concat(
      WIDTHS.some((w) => w <= meta.width) ? [] : [meta.width],
    );

    for (const w of widths) {
      await sharp(buf)
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: w > 1600 ? 78 : 82, effort: 5 })
        .toFile(path.join(OUT, `${item.slug}-${w}.webp`));
    }

    // Largest rendition doubles as the canonical src for <Image>.
    const canonical = Math.max(...widths);

    // 20px LQIP, inlined as a data URI for instant paint under the real image.
    const lqip = await sharp(buf)
      .resize({ width: 20 })
      .blur(1.2)
      .webp({ quality: 40 })
      .toBuffer();

    manifest[item.slug] = {
      slug: item.slug,
      title: item.title,
      alt: item.alt,
      tags: item.tags,
      src: `/media/${item.slug}-${canonical}.webp`,
      widths,
      width: meta.width,
      height: meta.height,
      aspect: +(meta.width / meta.height).toFixed(4),
      blurDataURL: `data:image/webp;base64,${lqip.toString("base64")}`,
    };

    console.log(`  ✓ ${item.slug}  ${meta.width}×${meta.height}  [${widths.join(", ")}]`);
  }

  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");

  const files = await readdir(OUT);
  console.log(`\n${Object.keys(manifest).length} images → ${files.length} renditions in public/media`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
