// Renders the blueprint machines statically so the drawings can be judged.
import { readFileSync } from "node:fs";
import sharp from "sharp";

const src = readFileSync("src/components/graphics/Blueprint.tsx", "utf8");
const block = src.slice(src.indexOf("const MACHINES"), src.indexOf("const WEIGHT"));

const machines = {};
const nameRe = /^\s{2}(\w+):\s*\[/gm;
let m;
const bounds = [];
while ((m = nameRe.exec(block))) bounds.push({ name: m[1], start: m.index });
bounds.forEach((b, i) => {
  const seg = block.slice(b.start, i + 1 < bounds.length ? bounds[i + 1].start : block.length);
  const strokes = [];
  const sr = /\{\s*d:\s*"([^"]+)",\s*step:\s*(\d+)(?:,\s*weight:\s*"(\w+)")?/g;
  let s;
  while ((s = sr.exec(seg))) strokes.push({ d: s[1], weight: s[3] || "primary" });
  machines[b.name] = strokes;
});

const W = { primary: [1.6, 1], detail: [1.1, 0.72], construction: [0.8, 0.42] };
const names = Object.keys(machines);
const CW = 460, CH = 300;
let g = "";
names.forEach((n, i) => {
  const x = (i % 2) * CW + 20, y = Math.floor(i / 2) * CH + 20;
  g += `<g transform="translate(${x},${y})">`;
  for (const st of machines[n]) {
    const [sw, op] = W[st.weight];
    g += `<path d="${st.d}" stroke="#eda91b" stroke-width="${sw}" opacity="${op}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  g += `<text x="0" y="278" fill="#7d8794" font-size="13" font-family="monospace">${n}</text></g>`;
});

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${2 * CW}" height="${Math.ceil(names.length / 2) * CH}">
<rect width="100%" height="100%" fill="#0b0e13"/>${g}</svg>`;
const out = "/private/tmp/claude-501/-Users-struass-Desktop-ISM--supply-and-maintancance-/7fca5b04-5681-4085-ae46-f4122e7b594b/scratchpad/blueprint-sheet.png";
await sharp(Buffer.from(svg)).png().toFile(out);
console.log(names.map((n) => `${n}: ${machines[n].length} strokes`).join("\n"));
console.log(out);
