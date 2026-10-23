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
// Chất lượng riêng theo nhóm ảnh (đường dẫn trong assets-src). Trang photobook nhiều hạt nhiễu + chữ nhỏ:
// AVIF 48 nhẹ hơn ~40% so với 55, so ở 100% không thấy khác (xem NOTES).
// Ảnh trang chủ (thuyền giấy): vân giấy vẽ tay, nén mạnh thì nhoè → chất lượng cao hơn (bản 1920 vẫn < 350KB).
const QUALITY_OVERRIDES = [
  { match: /^craft-villages\/photography-/, avif: 48 },
  { match: /^home-new\/home-background\./, avif: 70, webp: 85 },
];
const qualityFor = (rel) => ({ ...QUALITY, ...QUALITY_OVERRIDES.find((o) => o.match.test(rel)) });
const DEFAULT_WIDTHS = [480, 800, 1200, 1600];
// Ảnh nền toàn màn hình (trang chủ thuyền giấy, nền trang con): theo khổ màn hình 828 / 1280 / 1920.
const SCREEN_WIDTHS = [828, 1280, 1920];
const isScreen = (rel) => /^home-new\//.test(rel);
// Nền trang con là lớp mờ trong suốt ~30% (thiết kế đặt trên nền trắng) → trộn sẵn lên trắng: không cần alpha, nhẹ hơn.
const FLATTEN = [{ match: /^home-new\/background\./, background: '#ffffff' }];
// Ảnh mặt sau cánh hoa chỉ hiển thị ~250–420px → 2 cỡ là đủ (1x / 2x).
const PETAL_WIDTHS = [420, 840];

// Bỏ qua: ảnh bố cục ref/, và các hình trang chủ được dựng lại bằng SVG
// (cánh hoa mặt trước, mảnh ngôi sao, mũi tên). Chỉ giữ ảnh "- hover" ở home.
function skip(rel) {
  const parts = rel.split('/');
  if (parts.includes('ref')) return true;
  if (parts[0] === 'home' && !/ - hover\.\w+$/i.test(rel)) return true;
  if (/-ref\.\w+$/i.test(rel)) return true; // ảnh thiết kế để đối chiếu (home-new/home-ref.png)
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
  const q = qualityFor(rel);
  const dir = rel.split('/').slice(0, -1).map(slug).join('/');
  const name = slug(path.parse(rel).name.replace(/ - hover$/i, '-back'));
  const id = dir ? `${dir}/${name}` : name;
  const isPetal = /^home\//.test(rel);

  // .rotate() không tham số = xoay theo EXIF; sharp mặc định không ghi metadata ra file.
  const flat = FLATTEN.find((f) => f.match.test(rel));
  let base = sharp(file, { failOn: 'none' }).rotate();
  if (flat) base = base.flatten({ background: flat.background });
  const meta = await base.metadata();
  const oriented = meta.orientation >= 5;
  const W = oriented ? meta.height : meta.width;
  const H = oriented ? meta.width : meta.height;

  let widths = (isPetal ? PETAL_WIDTHS : isScreen(rel) ? SCREEN_WIDTHS : DEFAULT_WIDTHS).filter((w) => w < W);
  if (widths.length === 0 || (W - widths.at(-1) > 200 && W < (isPetal ? 840 : 1600))) widths.push(W);

  await fs.mkdir(path.join(OUT, dir), { recursive: true });
  const variants = [];
  for (const w of widths) {
    for (const fmt of ['avif', 'webp']) {
      const rel2 = `${id}-${w}.${fmt}`;
      const info = await base
        .clone()
        .resize({ width: w, withoutEnlargement: true })
        [fmt]({ quality: q[fmt], effort: fmt === 'avif' ? 6 : 5 })
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
      alpha: !!meta.hasAlpha && !flat,
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

// assets-src/ không nằm trong git: máy khác có thể chỉ có ảnh gốc của vài trang (hoặc thư mục rỗng).
// Giữ mọi mục manifest cũ, trừ khi biết chắc ảnh gốc của nó từng ở trên máy này (có trong cache) và nay đã bị xoá.
const localRels = new Set(files.map(([, r]) => r));
const removedIds = new Set(Object.entries(cache).filter(([rel]) => !localRels.has(rel)).map(([, c]) => c.id));
const oldManifest = await readJson(MANIFEST, {});

for (const [file, rel] of files) {
  const buf = await fs.readFile(file);
  srcBytes += buf.length;
  // Ảnh có chất lượng riêng: đưa thông số vào hash → đổi thông số thì chỉ nhóm đó được xử lý lại.
  const ov = QUALITY_OVERRIDES.find((o) => o.match.test(rel));
  const hash = createHash('sha1').update(buf).update(ov ? JSON.stringify(qualityFor(rel)) : '').digest('hex');
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

// Mục cũ không được xử lý lại lần này (ảnh gốc ở máy khác) → giữ nguyên.
for (const [id, entry] of Object.entries(oldManifest)) if (!(id in manifest) && !removedIds.has(id)) manifest[id] = entry;

// File output mồ côi (không còn trong manifest): chỉ báo, không xoá — public/img có file cố ý giữ lại
// (vd. bản 1600px của ảnh bìa video cũ). Muốn xoá thật: npm run images -- --prune
const keep = new Set(Object.values(manifest).flatMap((e) => [...e.avif, ...e.webp].map((v) => path.join(ROOT, 'public', v.src))));
const orphans = (await exists(OUT)) ? (await walk(OUT)).filter((f) => !keep.has(f)) : [];
if (process.argv.includes('--prune')) for (const f of orphans) await fs.rm(f);
else if (orphans.length) console.log(`(${orphans.length} file trong public/img không còn dùng — giữ lại; xoá bằng --prune)`);

await fs.mkdir(path.dirname(MANIFEST), { recursive: true });
const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
await fs.writeFile(MANIFEST, JSON.stringify(sorted, null, 2));
await fs.writeFile(CACHE, JSON.stringify(nextCache));

const outBytes = Object.values(manifest).reduce((s, e) => s + [...e.avif, ...e.webp].reduce((a, v) => a + v.bytes, 0), 0);
console.log(
  `\n${files.length} ảnh: ${done} xử lý, ${skipped} bỏ qua (không đổi).  Gốc ${kb(srcBytes)} → output ${kb(outBytes)}  (${((Date.now() - t0) / 1000).toFixed(1)}s)`,
);
