// Generates abstract blueprint-style SVG placeholder images for seed projects.
// Replace these via the admin panel once real project photos are available.
import fs from "node:fs";
import path from "node:path";

const outDir = path.join(process.cwd(), "public", "uploads", "projects");
fs.mkdirSync(outDir, { recursive: true });

const palettes = [
  ["#171717", "#3a2416", "#f25623"],
  ["#171717", "#3d3d3d", "#dedede"],
  ["#171717", "#4d2e1c", "#f25623"],
  ["#171717", "#333333", "#dedede"],
  ["#171717", "#402615", "#f25623"],
  ["#171717", "#404040", "#dedede"],
];

function svg(seed, [c1, c2, c3]) {
  const rand = (n) => {
    const x = Math.sin(seed * 999 + n) * 10000;
    return x - Math.floor(x);
  };
  const lines = Array.from({ length: 6 }, (_, i) => {
    const y = 80 + i * 150 + rand(i) * 40;
    return `<line x1="0" y1="${y}" x2="1600" y2="${y - 60}" stroke="${c3}" stroke-opacity="0.12" stroke-width="1.5"/>`;
  }).join("");
  const circles = Array.from({ length: 3 }, (_, i) => {
    const cx = 200 + rand(i + 10) * 1200;
    const cy = 200 + rand(i + 20) * 600;
    const r = 80 + rand(i + 30) * 160;
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c3}" fill-opacity="0.08"/>`;
  }).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="1000" fill="url(#g)"/>
  ${circles}
  ${lines}
</svg>`;
}

const projectSlugs = [
  "bodrum-villa",
  "milas-ofis-tadilat",
  "akustik-konser-salonu",
  "zafer-caddesi-rezidans",
  "sahil-konutu-ic-mekan",
  "kurumsal-uiux-vitrin",
];

const created = [];
projectSlugs.forEach((slug, pIdx) => {
  const palette = palettes[pIdx % palettes.length];
  const images = [];
  for (let i = 0; i < 3; i++) {
    const filename = `${slug}-${i + 1}.svg`;
    fs.writeFileSync(path.join(outDir, filename), svg(pIdx * 3 + i, palette));
    images.push(`/uploads/projects/${filename}`);
  }
  created.push({ slug, images });
});

fs.writeFileSync(
  path.join(process.cwd(), "scripts", "seed-images.json"),
  JSON.stringify(created, null, 2)
);

console.log("Generated placeholder images for", created.length, "projects");
