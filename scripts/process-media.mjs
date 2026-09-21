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
  /* --------------------------------------------------------------------------
     WORKSHOP AND REPAIRS (client supply, September 2026)

     The first photography of the business's own premises and its own crews.
     Four groups, kept in the order the work actually runs: the workshop itself,
     precision machining, component rebuild, and field service.
     ----------------------------------------------------------------------- */

  /* --- The workshop ------------------------------------------------------ */
  { src: "workshop:repairs/08fc97dd-b0f7-4812-a8dc-7a8cac8cf9f5.JPG", slug: "workshop-bay-plant-stripped", trim: false,
    title: "Workshop bay with plant stripped for repair",
    alt: "A wheel loader stripped down in a brick workshop bay, with an articulated dump truck on stands behind it",
    tags: ["workshop", "facility", "mechanical"] },
  { src: "workshop:repairs/42730837-4bde-4e1d-8fe1-8b56336f0ebd.JPG", slug: "workshop-adt-on-stands", trim: false,
    title: "Articulated hauler lifted for a driveline repair",
    alt: "An articulated dump truck raised on blue column lifts inside the workshop, with the roof trusses overhead",
    tags: ["workshop", "facility", "powertrain"] },
  { src: "workshop:repairs/48c5655b-9ced-4611-88bb-ed80e44684cc.JPG", slug: "workshop-component-racking", trim: false,
    title: "Component racking alongside the repair bays",
    alt: "The workshop interior with a hauler body raised and rebuilt components stored on racking along the far wall",
    tags: ["workshop", "facility", "supply"] },
  { src: "workshop:repairs/9ac4992d-097d-42de-b413-adb87b319483.JPG", slug: "workshop-bays-in-use", trim: false,
    title: "Both repair bays under load",
    alt: "Two machines under repair in adjacent workshop bays, one on column lifts and one part dismantled",
    tags: ["workshop", "facility"] },

  /* --- Line boring and bore welding -------------------------------------- */
  { src: "workshop:repairs/Line boring and bore welding/de0605cf-9b99-45fc-92a2-c2abdf2cb8be.JPG", slug: "line-borer-rigged-on-boom", trim: false,
    title: "Line boring rig set up on an excavator boom",
    alt: "A portable line boring and bore welding machine clamped to an orange excavator boom inside the workshop",
    tags: ["machining", "line-boring", "workshop", "hero"] },
  { src: "workshop:repairs/Line boring and bore welding/aa5c9b9f-3ff6-4aa1-910b-f58562c7df83.JPG", slug: "bore-weld-build-up", trim: false,
    title: "Worn bore built back up with weld",
    alt: "A boom eye with fresh weld metal deposited around the worn bore, photographed outdoors against a blue sky",
    tags: ["machining", "line-boring", "welding"] },
  { src: "workshop:repairs/Line boring and bore welding/de4393a6-a16b-4b7e-9684-de59c5b35088.JPG", slug: "bore-weld-ready-to-machine", trim: false,
    title: "Weld deposit ready for machining",
    alt: "Ring of weld build-up inside a bore on an orange machine casting, waiting to be cut back to size",
    tags: ["machining", "line-boring", "welding"] },
  { src: "workshop:repairs/Line boring and bore welding/168f1553-d124-41c2-95e9-77dd18e4b1f5.JPG", slug: "boring-bar-through-bore", trim: false,
    title: "Boring bar set through the repaired bore",
    alt: "A boring bar passed through the bore of an orange machine casting with the cutting head mounted mid span",
    tags: ["machining", "line-boring", "workshop"] },
  { src: "workshop:repairs/Line boring and bore welding/3c56735c-a4c9-4011-9da7-79f68079fb25.JPG", slug: "boom-eye-bored-to-size", trim: false,
    title: "Boom eye cut back to size",
    alt: "A machined bore in a black excavator boom eye showing clean bright metal and a consistent tool finish",
    tags: ["machining", "line-boring"] },
  { src: "workshop:repairs/Line boring and bore welding/7fc3665c-3eca-4598-a31d-452b5a082d1e.JPG", slug: "link-bore-finished", trim: false,
    title: "Link bore finished and measured",
    alt: "A finished bore in a machine link, the bright machined surface running the full depth of the boss",
    tags: ["machining", "line-boring"] },
  { src: "workshop:repairs/Line boring and bore welding/911a8027-4cb5-4f04-a1cd-47d77f182cc1.JPG", slug: "twin-lug-bores-restored", trim: false,
    title: "Paired lugs brought back to alignment",
    alt: "The underside of a boom showing two mounting lugs, the nearer bore freshly machined to bright metal",
    tags: ["machining", "line-boring"] },
  { src: "workshop:repairs/Line boring and bore welding/8e20ea99-142d-4adb-8793-3e8143a40a6f.JPG", slug: "bush-pressed-into-bore", trim: false,
    title: "New bush pressed into the restored bore",
    alt: "A replacement bush seated in the freshly machined bore of a yellow machine component standing on site",
    tags: ["machining", "line-boring", "field-service"] },
  { src: "workshop:repairs/Line boring and bore welding/d71b6548-91f8-4c30-89b3-282e47af5f06.JPG", slug: "bore-repair-job-carded", trim: false,
    title: "Bore repair carried out under the machine",
    alt: "A technician working beneath a machine at a bore repair, with the job card taped to the boom above him",
    tags: ["machining", "line-boring", "field-service", "team"] },

  /* --- Engine and powertrain rebuild -------------------------------------- */
  { src: "workshop:repairs/enigine-part-repair/6fa45b65-f0f1-4d04-8d08-e6b3d7ab2044.JPG", slug: "cylinder-block-bores-finished", trim: false,
    title: "Cylinder block finished and laid out",
    alt: "A six cylinder block painted yellow with the finished bores visible along its length",
    tags: ["engines", "workshop", "mechanical"] },
  { src: "workshop:repairs/enigine-part-repair/230d3b2c-2c3c-41f8-b799-8d3de470e11c.JPG", slug: "final-drive-wrapped-dispatch", trim: false,
    title: "Rebuilt final drive sealed for dispatch",
    alt: "A rebuilt final drive wrapped in protective plastic and stood on a drum ready to leave the workshop",
    tags: ["powertrain", "workshop", "supply"] },
  { src: "workshop:repairs/enigine-part-repair/2568e00f-e737-4d74-a789-87fcfca3df99.JPG", slug: "differential-housing-rebuilt", trim: false,
    title: "Differential housing rebuilt and repainted",
    alt: "A differential housing finished in yellow standing on the workshop floor after rebuild",
    tags: ["powertrain", "workshop", "mechanical"] },
  { src: "workshop:repairs/enigine-part-repair/89dbbd42-eb8a-46e6-a507-d74dc82b4255.JPG", slug: "transmission-on-rebuild-stand", trim: false,
    title: "Transmission mounted on the rebuild stand",
    alt: "A hauler transmission on a workshop rebuild stand, finished in yellow with the drop box fitted",
    tags: ["powertrain", "workshop", "mechanical"] },
  { src: "workshop:repairs/enigine-part-repair/8b6633ba-67d1-4f62-9f01-df8010346b5a.JPG", slug: "final-drive-slung-for-fitment", trim: false,
    title: "Final drive slung ready for fitment",
    alt: "A rebuilt final drive assembly hanging in lifting slings outside the workshop door",
    tags: ["powertrain", "workshop"] },
  { src: "workshop:repairs/enigine-part-repair/a7635d29-0c37-4c64-a4f0-53bf1de0c27a.JPG", slug: "drive-axle-assembly-complete", trim: false,
    title: "Drive axle assembled and laid out",
    alt: "A complete drive axle and shaft assembly finished in yellow and laid out on paving outside the workshop",
    tags: ["powertrain", "workshop", "mechanical"] },
  { src: "workshop:repairs/enigine-part-repair/a9e0ad09-3f86-48b1-9602-63eb2d3463b7.JPG", slug: "axle-universal-joint-detail", trim: false,
    title: "Universal joint and flange refitted",
    alt: "Close view of a universal joint and drive flange on a rebuilt axle, freshly painted",
    tags: ["powertrain", "mechanical"] },
  { src: "workshop:repairs/enigine-part-repair/d027b6d2-b120-4ef1-afdd-9cc6ebb5854e.JPG", slug: "driveline-yoke-detail", trim: false,
    title: "Driveline yoke set and secured",
    alt: "A driveline yoke and flange on a rebuilt axle assembly, photographed close up outdoors",
    tags: ["powertrain", "mechanical"] },
  { src: "workshop:repairs/enigine-part-repair/bfc796e2-ebed-43bd-acb0-9a6a4d8cd96f.JPG", slug: "long-block-built-up", trim: false,
    title: "Long block built up on the bench",
    alt: "A diesel long block finished in yellow with the head fitted, standing in the workshop",
    tags: ["engines", "workshop", "mechanical"] },
  { src: "workshop:repairs/enigine-part-repair/eda18eb7-f1af-4e84-8503-6dbb0b6a665c.JPG", slug: "long-block-front-elevation", trim: false,
    title: "Rebuilt engine ready to be crated",
    alt: "The front of a rebuilt diesel engine finished in yellow, standing on the workshop floor",
    tags: ["engines", "workshop"] },
  { src: "workshop:repairs/enigine-part-repair/d23fb75b-e877-42fa-974b-f1ff868fa507.JPG", slug: "hub-wrapped-for-transport", trim: false,
    title: "Wheel end wrapped for transport",
    alt: "A rebuilt wheel end sealed in protective wrap and stood on a drum ready for collection",
    tags: ["powertrain", "supply", "logistics"] },
  { src: "workshop:repairs/enigine-part-repair/eecec9e7-a6d4-4f45-9bb9-0623a228c182.JPG", slug: "component-returned-to-machine", trim: false,
    title: "Rebuilt component delivered back to the machine",
    alt: "A wrapped rebuilt component standing on site in front of the wheel loader it belongs to",
    tags: ["powertrain", "field-service", "logistics"] },

  /* --- Field service ------------------------------------------------------ */
  { src: "workshop:repairs/on-site/3741a971-2333-40cb-b666-670cc307939b.JPG", slug: "field-crew-under-machine", trim: false,
    title: "Field crew working a repair on the ground",
    alt: "Two technicians in high visibility clothing and hard hats working underneath a machine on a mine floor",
    tags: ["field-service", "team", "safety", "mining", "hero"] },
  { src: "workshop:repairs/on-site/1d56e99d-4ada-4372-ae4d-6953de5e303c.JPG", slug: "powertrain-lifted-by-crane", trim: false,
    title: "Engine and transmission lifted out on site",
    alt: "A truck mounted crane lifting an engine and transmission assembly clear of a machine on a mine site",
    tags: ["field-service", "powertrain", "mining"] },
  { src: "workshop:repairs/on-site/e5b8bfad-6556-4696-b31e-a40a2f2c413f.JPG", slug: "powertrain-removal-in-field", trim: false,
    title: "Powertrain removal under way in the field",
    alt: "A crew guiding a slung engine and transmission assembly down onto stands beside a machine on a mine site",
    tags: ["field-service", "powertrain", "team", "mining"] },
  { src: "workshop:repairs/on-site/14fcf5bf-b43b-4fde-8b34-bc2eac315ea3.JPG", slug: "engine-stripped-on-site", trim: false,
    title: "Engine stripped where it stands",
    alt: "A diesel engine partly dismantled on the ground at a mine site with guarding and pipework laid out beside it",
    tags: ["field-service", "engines", "mining"] },
  { src: "workshop:repairs/on-site/9955de12-ab13-4673-b3c3-a5c0a3691a88.JPG", slug: "cooling-pack-turbo-exposed", trim: false,
    title: "Cooling pack and turbocharger opened up",
    alt: "The cooling pack and turbocharger of a yellow machine exposed for inspection during a site repair",
    tags: ["field-service", "engines", "diagnostics"] },
  { src: "workshop:repairs/on-site/38f318f6-4db9-4abf-9bb5-6d644cdffb17.JPG", slug: "on-site-cutting-and-welding", trim: false,
    title: "Cutting and welding brought to the machine",
    alt: "Gas cylinders and a welding set rigged beside an excavator bucket for a repair carried out on site",
    tags: ["field-service", "fabrication", "welding"] },
  { src: "workshop:repairs/on-site/3dd4e2cf-8e6c-49bd-9e6d-dbf5d347e715.JPG", slug: "service-vehicle-rigged-on-site", trim: false,
    title: "Service vehicle rigged alongside the machine",
    alt: "A service bakkie carrying a welding unit in the load bin, parked beside a wheel loader under repair",
    tags: ["field-service", "fleet", "mining"] },
  { src: "workshop:repairs/on-site/a7090487-ac52-4d33-80f6-017695fc73ca.JPG", slug: "crane-truck-component-recovery", trim: false,
    title: "Crane truck recovering components",
    alt: "A truck mounted crane loading dismantled machine components in the yard for return to the workshop",
    tags: ["logistics", "field-service", "workshop"] },
  { src: "workshop:repairs/on-site/a765f7f0-b676-4073-a51f-94787da70094.JPG", slug: "live-mine-service-call", trim: false,
    title: "Service call on a live mining operation",
    alt: "Service vehicles and cones set up between a tracked excavator and a wheel loader on an active mine haul road",
    tags: ["field-service", "mining", "safety"] },
  /* --------------------------------------------------------------------------
     MINING (client supply, September 2026)

     Shot on an active opencast coal operation, and by some margin the highest
     resolution material in the library: 12 megapixel stills rather than the
     phone screenshots the earlier sets came from, so these are the only client
     photographs that stand up at full-bleed hero sizes.

     Sources are HEIC. They are converted to JPEG in assest/mining/_web because
     sharp reads Apple HEIC inconsistently and does not pick up its rotation,
     whereas the converted files carry an ordinary EXIF orientation tag that
     `.rotate()` below applies correctly.
     ----------------------------------------------------------------------- */

  /* --- The pit ------------------------------------------------------------ */
  { src: "mining/_web/IMG_0789.jpg", slug: "coal-bench-excavator-working", trim: false,
    title: "Excavator working a coal bench",
    alt: "A tracked excavator standing on exposed coal at the foot of a red overburden face in an opencast pit",
    tags: ["mining", "earthmoving", "coal", "hero"] },
  { src: "mining/_web/IMG_0792.jpg", slug: "opencast-pit-overview", trim: false,
    title: "The cut, seen from the highwall",
    alt: "An opencast pit seen from above the highwall, with standing water in the floor and a machine working the far bench",
    tags: ["mining", "earthmoving", "coal"] },
  { src: "mining/_web/IMG_0795.jpg", slug: "coal-seam-exposed", trim: false,
    title: "Coal seam exposed under the overburden",
    alt: "A Caterpillar excavator digging at an exposed black coal seam, with a worker in red standing at the toe of the face",
    tags: ["mining", "coal", "earthmoving", "team"] },
  { src: "mining/_web/IMG_0808.jpg", slug: "pit-panorama-waterline", trim: false,
    title: "Working down to the waterline",
    alt: "A wide opencast pit with a red highwall, standing water across the floor and an orange tracked excavator working at the water's edge",
    tags: ["mining", "earthmoving", "site-services"] },

  /* --- The product -------------------------------------------------------- */
  { src: "mining/_web/IMG_0800.jpg", slug: "coal-slab-in-hand", trim: false,
    title: "Coal taken straight off the face",
    alt: "Two hands holding a large layered slab of black coal, with the opencast pit and working machines behind",
    tags: ["coal", "materials", "mining", "hero"] },
  { src: "mining/_web/IMG_0798.jpg", slug: "coal-sample-at-the-face", trim: false,
    title: "Sample checked at the face",
    alt: "A hand holding a slab of coal up against the pit behind it, with an excavator working in the background",
    tags: ["coal", "materials", "mining"] },
  { src: "mining/_web/IMG_0813.jpg", slug: "coal-sample-on-bucket-tooth", trim: false,
    title: "A lump of coal on the bucket lip",
    alt: "A piece of coal resting on the worn tooth of an excavator bucket, with a site vehicle out of focus behind it",
    tags: ["coal", "materials", "mining", "hero"] },

  /* --- Plant on site ------------------------------------------------------ */
  { src: "mining/_web/IMG_0801.jpg", slug: "liebherr-excavator-low-angle", trim: false,
    title: "Liebherr excavator between passes",
    alt: "A Liebherr tracked excavator photographed from ground level, boom raised against a heavy sky",
    tags: ["plant", "fleet", "mining", "hero"] },
  { src: "mining/_web/IMG_0818.jpg", slug: "excavator-with-lighting-tower", trim: false,
    title: "Lighting plant set for the night shift",
    alt: "A Liebherr 976 excavator beside a mobile lighting tower on the pit floor as the light goes",
    tags: ["plant", "mining", "site-services", "fleet"] },
  { src: "mining/_web/IMG_0807.jpg", slug: "excavator-and-site-vehicles", trim: false,
    title: "Machine and vehicles on the pit road",
    alt: "A Liebherr excavator working beside site bakkies parked along the pit haul road",
    tags: ["mining", "fleet", "logistics"] },
  { src: "mining/_web/IMG_0802.jpg", slug: "excavator-undercarriage-detail", trim: false,
    title: "Undercarriage on the pit floor",
    alt: "The tracks and counterweight of a large excavator in close view, with site vehicles parked beyond it",
    tags: ["plant", "mining", "mechanical"] },
  { src: "mining/_web/IMG_0809.jpg", slug: "site-inspection-pit-floor", trim: false,
    title: "Walking the pit floor",
    alt: "Site vehicles drawn up beside a Liebherr excavator with people walking the pit floor on an inspection",
    tags: ["mining", "team", "safety", "fleet"] },
];

const WIDTHS = [640, 1080, 1600, 2200];

const QUALITY_FOR = (w) => (w >= 2200 ? 60 : w >= 1600 ? 64 : w >= 1080 ? 74 : 82);

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
        /**
         * Quality falls as the rendition grows. A 2200px file is only ever
         * served to a viewport wide enough to scale it down, so detail that
         * costs a megabyte there is never seen; at 640 the image is close to
         * its display size and needs the quality.
         *
         * The 12 megapixel pit photography made this worth doing: at a flat
         * 78 the largest renditions reached 1.27 MB each, and those are the
         * largest contentful paint on a desktop page header.
         */
        .webp({ quality: QUALITY_FOR(w), effort: 6 })
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
