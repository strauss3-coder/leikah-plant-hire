// Renders the icon family as a contact sheet at three sizes so the silhouettes
// can actually be judged rather than assumed.
import { readFileSync } from "node:fs";
import sharp from "sharp";

const src = readFileSync("src/components/graphics/EquipmentIcon.tsx", "utf8");
const body = src.slice(src.indexOf("const PATHS"), src.indexOf("export function EquipmentIcon"));

const TRACKS = (x1, x2) => `M${x1 + 4} 42 H${x2 - 4} a4 4 0 0 0 0-8 H${x1 + 4} a4 4 0 0 0 0 8 Z`;

// Pull each icon block out of the JSX and turn it into raw SVG markup.
const icons = [];
const re = /^\s{2}"?([a-z]+)"?:\s*\(\s*<>([\s\S]*?)<\/>\s*\),/gm;
let m;
while ((m = re.exec(body))) {
  const name = m[1];
  let inner = m[2]
    .replace(/\{TRACKS\((\d+),\s*(\d+)\)\}/g, (_, a, b) => `"${TRACKS(+a, +b)}"`)
    .replace(/d=\{?"([^"]*)"\}?/g, 'd="$1"')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .trim();
  icons.push({ name, inner });
}

const COLS = 6;
const CELL = 150;
const rows = Math.ceil(icons.length / COLS);
let g = "";
icons.forEach((ic, i) => {
  const cx = (i % COLS) * CELL + 20;
  const cy = Math.floor(i / COLS) * CELL + 20;
  // 72px, 40px and 24px renderings side by side
  g += `<g transform="translate(${cx},${cy}) scale(1.5)" stroke="#eda91b" fill="none" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ic.inner}</g>`;
  g += `<g transform="translate(${cx + 78},${cy + 8}) scale(0.83)" stroke="#e2e5e9" fill="none" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ic.inner}</g>`;
  g += `<g transform="translate(${cx + 78},${cy + 56}) scale(0.5)" stroke="#e2e5e9" fill="none" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ic.inner}</g>`;
  g += `<text x="${cx}" y="${cy + 108}" fill="#7d8794" font-size="10" font-family="monospace">${ic.name}</text>`;
});

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${COLS * CELL}" height="${rows * CELL}">
<rect width="100%" height="100%" fill="#0b0e13"/>${g}</svg>`;

const out = "/private/tmp/claude-501/-Users-struass-Desktop-ISM--supply-and-maintancance-/7fca5b04-5681-4085-ae46-f4122e7b594b/scratchpad/icon-sheet.png";
await sharp(Buffer.from(svg)).png().toFile(out);
console.log(`${icons.length} icons -> ${out}`);
