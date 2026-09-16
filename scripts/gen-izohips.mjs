import fs from "node:fs";

// ---- deterministic RNG so the output is reproducible ----
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const SEED = Number(process.argv[2] ?? 20260916);
const rand = mulberry32(SEED);

// ---- value noise with smoothstep interpolation ----
function makeLattice(n) {
  const g = new Float64Array(n * n);
  for (let i = 0; i < g.length; i++) g[i] = rand();
  return g;
}
const smooth = (t) => t * t * (3 - 2 * t);

function noiseAt(lat, n, x, y) {
  // x,y in [0,1)
  const fx = x * n, fy = y * n;
  const x0 = Math.floor(fx), y0 = Math.floor(fy);
  const tx = smooth(fx - x0), ty = smooth(fy - y0);
  const i = (xi, yi) => lat[((yi % n) + n) % n * n + (((xi % n) + n) % n)];
  const a = i(x0, y0), b = i(x0 + 1, y0), c = i(x0, y0 + 1), d = i(x0 + 1, y0 + 1);
  return (a * (1 - tx) + b * tx) * (1 - ty) + (c * (1 - tx) + d * tx) * ty;
}

// fractal brownian motion: a few octaves of value noise
const OCTAVES = [
  { n: 3, amp: 1.0 },
  { n: 6, amp: 0.5 },
  { n: 12, amp: 0.25 },
  { n: 24, amp: 0.12 },
  { n: 48, amp: 0.06 },
];
const lattices = OCTAVES.map((o) => makeLattice(o.n));

const W = 1600, H = 900;          // viewBox
const GX = 200, GY = 116;          // sample grid (aspect-matched)

const field = new Float64Array((GX + 1) * (GY + 1));
let lo = Infinity, hi = -Infinity;
for (let j = 0; j <= GY; j++) {
  for (let i = 0; i <= GX; i++) {
    const x = i / GX, y = j / GY;
    let v = 0, tot = 0;
    OCTAVES.forEach((o, k) => {
      // stretch y a little so ridges lean, like real terrain
      v += noiseAt(lattices[k], o.n, x, y * 0.82 + x * 0.14) * o.amp;
      tot += o.amp;
    });
    v /= tot;
    field[j * (GX + 1) + i] = v;
    if (v < lo) lo = v;
    if (v > hi) hi = v;
  }
}
// normalise to 0..1
for (let k = 0; k < field.length; k++) field[k] = (field[k] - lo) / (hi - lo);

const at = (i, j) => field[j * (GX + 1) + i];
const px = (i) => (i / GX) * W;
const py = (j) => (j / GY) * H;

// ---- marching squares -> line segments per iso level ----
function segmentsFor(level) {
  const segs = [];
  const lerp = (ia, ja, ib, jb) => {
    const va = at(ia, ja), vb = at(ib, jb);
    const t = (level - va) / (vb - va || 1e-9);
    return [px(ia + (ib - ia) * t), py(ja + (jb - ja) * t)];
  };
  for (let j = 0; j < GY; j++) {
    for (let i = 0; i < GX; i++) {
      const v0 = at(i, j), v1 = at(i + 1, j), v2 = at(i + 1, j + 1), v3 = at(i, j + 1);
      let idx = 0;
      if (v0 > level) idx |= 8;
      if (v1 > level) idx |= 4;
      if (v2 > level) idx |= 2;
      if (v3 > level) idx |= 1;
      if (idx === 0 || idx === 15) continue;
      const top = () => lerp(i, j, i + 1, j);
      const right = () => lerp(i + 1, j, i + 1, j + 1);
      const bottom = () => lerp(i, j + 1, i + 1, j + 1);
      const left = () => lerp(i, j, i, j + 1);
      switch (idx) {
        case 1: case 14: segs.push([left(), bottom()]); break;
        case 2: case 13: segs.push([bottom(), right()]); break;
        case 3: case 12: segs.push([left(), right()]); break;
        case 4: case 11: segs.push([top(), right()]); break;
        case 6: case 9:  segs.push([top(), bottom()]); break;
        case 7: case 8:  segs.push([left(), top()]); break;
        case 5:  segs.push([left(), top()]); segs.push([bottom(), right()]); break;
        case 10: segs.push([left(), bottom()]); segs.push([top(), right()]); break;
      }
    }
  }
  return segs;
}

// ---- join segments into polylines so the SVG stays small ----
const key = (p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`;
function join(segs) {
  const map = new Map();
  segs.forEach((s, i) => {
    for (const p of s) {
      const k = key(p);
      if (!map.has(k)) map.set(k, []);
      map.get(k).push(i);
    }
  });
  const used = new Array(segs.length).fill(false);
  const lines = [];
  for (let i = 0; i < segs.length; i++) {
    if (used[i]) continue;
    used[i] = true;
    const line = [segs[i][0], segs[i][1]];
    // extend forward, then backward
    for (const dir of [1, 0]) {
      for (;;) {
        const end = dir ? line[line.length - 1] : line[0];
        const cands = map.get(key(end)) || [];
        const nxt = cands.find((c) => !used[c]);
        if (nxt === undefined) break;
        used[nxt] = true;
        const [a, b] = segs[nxt];
        const other = key(a) === key(end) ? b : a;
        if (dir) line.push(other); else line.unshift(other);
      }
    }
    if (line.length > 2) lines.push(line);
  }
  return lines;
}

const N = 19;
const parts = [];
for (let l = 1; l < N; l++) {
  const level = l / N;
  const lines = join(segmentsFor(level));
  if (!lines.length) continue;
  const d = lines
    .map((pts) => "M" + pts.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join("L"))
    .join("");
  const major = l % 5 === 0;               // index contours, like a real topo sheet
  parts.push(
    `<path d="${d}" fill="none" stroke="#DEDEDE" stroke-width="${major ? 2.1 : 1}" ` +
      `stroke-opacity="${major ? 0.85 : 0.5}" stroke-linecap="round" stroke-linejoin="round"/>`
  );
}

const svg =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" ` +
  `width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice">` +
  parts.join("") +
  `</svg>`;

const out = "public/izohips.svg";
fs.writeFileSync(out, svg);
console.log(`${out}  ${(svg.length / 1024).toFixed(1)} KB  seed=${SEED}  paths=${parts.length}`);
