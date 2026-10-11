// Chuyển font trong fonts/ → src/assets/fonts/*.woff2, chỉ giữ ký tự Latin + tiếng Việt.
// Chỉ đưa vào các độ đậm thực sự dùng (sửa danh sách FONTS khi cần).
import subsetFont from 'subset-font';
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'src', 'assets', 'fonts');

const FONTS = [
  { src: 'HelveticaNeue-Bold.otf', out: 'hn-700.woff2' },
  { src: 'HelveticaNeue-Roman.otf', out: 'hn-400.woff2' }, // giới thiệu Applied Science, chú thích, dòng 'Published:'
  { src: 'HelveticaNeue-Medium.otf', out: 'hn-500.woff2' },
  { src: 'HelveticaNeue-LightItalic-09.ttf', out: 'hn-300i.woff2' }, // đoạn giới thiệu My Journey
];

// Basic Latin, Latin-1, Vietnamese, dấu câu thông dụng.
const RANGES = [
  [0x20, 0x7e],
  [0xa0, 0xff],
  [0x102, 0x103],
  [0x110, 0x111],
  [0x128, 0x129],
  [0x168, 0x169],
  [0x1a0, 0x1a1],
  [0x1af, 0x1b0],
  [0x300, 0x303],
  [0x309, 0x309],
  [0x323, 0x323],
  [0x1ea0, 0x1ef9],
  [0x2010, 0x2027],
  [0x20ab, 0x20ab],
];
const text = RANGES.flatMap(([a, b]) => Array.from({ length: b - a + 1 }, (_, i) => String.fromCodePoint(a + i))).join('');

await fs.mkdir(OUT, { recursive: true });
for (const f of FONTS) {
  const buf = await fs.readFile(path.join(ROOT, 'fonts', f.src));
  const woff2 = await subsetFont(buf, text, { targetFormat: 'woff2' });
  await fs.writeFile(path.join(OUT, f.out), woff2);
  console.log(`${f.src} (${(buf.length / 1024) | 0}KB) → ${f.out} (${(woff2.length / 1024) | 0}KB)`);
}
