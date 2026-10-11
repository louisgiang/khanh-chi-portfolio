// Tối ưu ảnh: assets-src/**  →  public/img/** (AVIF + WebP, nhiều chiều rộng)
// + src/generated/images.json (manifest cho component <Img>).
// Chỉ xử lý lại ảnh mới/đã đổi (so hash nội dung trong .image-cache.json).
import sharp from 'sharp';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'assets-src');
const OUT = path.join(ROOT, 'public', 'img');
const MANIFEST = path.join(ROOT, 'src', 'generated', 'images.json');
const CACHE = path.join(ROOT, '.image-cache.json');

const QUALITY = { avif: 55, webp: 75 };
const DEFAULT_WIDTHS = [480, 800, 1200, 1600];
// Ảnh mặt sau cánh hoa chỉ hiển thị ~250–420px → 2 cỡ là đủ (1x / 2x).
const PETAL_WIDTHS = [420, 840];

// Bỏ qua: ảnh bố cục ref/, và các hình trang chủ được dựng lại bằng SVG
// (cánh hoa mặt trước, mảnh ngôi sao, mũi tên). Chỉ giữ ảnh "- hover" ở home.
function skip(rel) {
  const parts = rel.split('/');
  if (parts.includes('ref')) return true;
  if (parts[0] === 'home' && !/ - hover\.\w+$/i.test(rel)) return true;
  return !/\.(png|jpe?g|webp|tiff?|heic|avif)$/i.test(rel);
}

const slug = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .replace(/@\dx/i, '')
    .replace(/&/g, 'and')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

async function walk(dir) {
  const out = [];
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

const readJson = async (p, fb) => {
  try {
    return JSON.parse(await fs.readFile(p, 'utf8'));
  } catch {
    return fb;
  }
};
const exists = (p) => fs.access(p).then(() => true, () => false);
const kb = (n) => (n / 1024).toFixed(0) + 'KB';

async function processImage(file, rel) {
  const dir = rel.split('/').slice(0, -1).map(slug).join('/');
  const name = slug(path.parse(rel).name.replace(/ - hover$/i, '-back'));
  const id = dir ? `${dir}/${name}` : name;
  const isPetal = /^home\//.test(rel);

  // .rotate() không tham số = xoay theo EXIF; sharp mặc định không ghi metadata ra file.
  const base = sharp(file, { failOn: 'none' }).rotate();
  const meta = await base.metadata();
  const oriented = meta.orientation >= 5;
  const W = oriented ? meta.height : meta.width;
  const H = oriented ? meta.width : meta.height;

  let widths = (isPetal ? PETAL_WIDTHS : DEFAULT_WIDTHS).filter((w) => w < W);
  if (widths.length === 0 || (W - widths.at(-1) > 200 && W < (isPetal ? 840 : 1600))) widths.push(W);

  await fs.mkdir(path.join(OUT, dir), { recursive: true });
  const variants = [];
  for (const w of widths) {
    for (const fmt of ['avif', 'webp']) {
      const rel2 = `${id}-${w}.${fmt}`;
      const info = await base
        .clone()
        .resize({ width: w, withoutEnlargement: true })
        [fmt]({ quality: QUALITY[fmt], effort: fmt === 'avif' ? 6 : 5 })
        .toFile(path.join(OUT, rel2));
      variants.push({ w, fmt, src: `/img/${rel2}`, bytes: info.size });
    }
  }

  // Ảnh mờ ~20px nhúng base64 + màu chủ đạo.
  const tiny = await base.clone().resize({ width: 20 }).webp({ quality: 40 }).toBuffer();
  const { dominant } = await base.clone().stats();
  const hex = '#' + [dominant.r, dominant.g, dominant.b].map((v) => v.toString(16).padStart(2, '0')).join('');

  return {
    id,
    entry: {
      width: W,
      height: H,
      aspect: +(W / H).toFixed(4),
      alpha: !!meta.hasAlpha,
      color: hex,
      placeholder: `data:image/webp;base64,${tiny.toString('base64')}`,
      widths,
      avif: variants.filter((v) => v.fmt === 'avif').map(({ w, src, bytes }) => ({ w, src, bytes })),
      webp: variants.filter((v) => v.fmt === 'webp').map(({ w, src, bytes }) => ({ w, src, bytes })),
    },
  };
}

const t0 = Date.now();
const cache = await readJson(CACHE, {});
const manifest = {};
const nextCache = {};
let done = 0,
  skipped = 0,
  srcBytes = 0;

const files = (await walk(SRC)).map((f) => [f, path.relative(SRC, f).split(path.sep).join('/')]).filter(([, r]) => !skip(r));

for (const [file, rel] of files) {
  const buf = await fs.readFile(file);
  srcBytes += buf.length;
  const hash = createHash('sha1').update(buf).digest('hex');
  const prev = cache[rel];
  if (prev && prev.hash === hash) {
    const ok = await Promise.all([...prev.entry.avif, ...prev.entry.webp].map((v) => exists(path.join(ROOT, 'public', v.src))));
    if (ok.every(Boolean)) {
      manifest[prev.id] = prev.entry;
      nextCache[rel] = prev;
      skipped++;
      continue;
    }
  }
  const { id, entry } = await processImage(file, rel);
  manifest[id] = entry;
  nextCache[rel] = { hash, id, entry };
  done++;
  console.log(`✓ ${rel}  →  ${id}  (${kb(buf.length)} → ${entry.avif.map((v) => v.w + ':' + kb(v.bytes)).join(' ')} avif)`);
}

// Xóa file output mồ côi (ảnh gốc đã bị xóa/đổi tên).
const keep = new Set(Object.values(manifest).flatMap((e) => [...e.avif, ...e.webp].map((v) => path.join(ROOT, 'public', v.src))));
if (await exists(OUT)) for (const f of await walk(OUT)) if (!keep.has(f)) await fs.rm(f);

await fs.mkdir(path.dirname(MANIFEST), { recursive: true });
const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
await fs.writeFile(MANIFEST, JSON.stringify(sorted, null, 2));
await fs.writeFile(CACHE, JSON.stringify(nextCache));

const outBytes = Object.values(manifest).reduce((s, e) => s + [...e.avif, ...e.webp].reduce((a, v) => a + v.bytes, 0), 0);
console.log(
  `\n${files.length} ảnh: ${done} xử lý, ${skipped} bỏ qua (không đổi).  Gốc ${kb(srcBytes)} → output ${kb(outBytes)}  (${((Date.now() - t0) / 1000).toFixed(1)}s)`,
);
