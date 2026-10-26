import type { Block, Item, RowBlock, TextBlock, ImageBlock, SplitImage } from '../../content';
import { isImage, isImageCell, isVideoCell, isRow, isEntry, isVideo, isText, isMarquee, isSlideshow, isSplit } from '../../content';
import { imageEntry } from '../Img';

// Kích thước theo khung thiết kế 1920: thẻ rộng 1138, nội dung 1053 (lề trong 40 + viền 3).
export const CONTENT_W = 1053;
export const GAP_X = 20;
export const ZIGZAG_IMG_W = 599;
export const ENTRY_IMG_W = 371;
export const CAROUSEL_IMG_W = 335;
/** Khối 2 cột (split): khoảng cách giữa các ảnh trong cột ảnh. */
export const SPLIT_IMG_GAP = 14;

const aspect = (id: string) => imageEntry(id)?.aspect ?? 1;
/** Tỉ lệ khung hiển thị của ảnh trong khối 2 cột (đã cắt nếu có crop). */
export const splitAspect = (c: SplitImage) => c.crop ?? aspect(c.image);

/** Bố cục My Journey: chia khối thành hàng (ảnh liền nhau cùng hàng, trừ ảnh `wide`; chữ một hàng).
 *  zigzag: ghép từng cặp chữ + ảnh thành một hàng 2 cột. */
export type LegacyRow =
  | { kind: 'text'; block: TextBlock }
  | { kind: 'images'; blocks: ImageBlock[] }
  | { kind: 'pair'; blocks: [Block, Block] };

export function toRows(item: Item): LegacyRow[] {
  const rows: LegacyRow[] = [];
  const b = item.blocks;
  if (item.layout === 'zigzag') {
    for (let i = 0; i < b.length; i += 2) {
      if (b[i + 1]) rows.push({ kind: 'pair', blocks: [b[i], b[i + 1]] });
      else rows.push(isImage(b[i]) ? { kind: 'images', blocks: [b[i] as ImageBlock] } : { kind: 'text', block: b[i] as TextBlock });
    }
    return rows;
  }
  for (const block of b) {
    const last = rows.at(-1);
    if (isText(block)) rows.push({ kind: 'text', block });
    else if (!isImage(block)) continue;
    else if (!block.wide && last?.kind === 'images' && !last.blocks[0].wide) last.blocks.push(block);
    else rows.push({ kind: 'images', blocks: [block] });
  }
  return rows;
}

/** Hệ số co giãn của từng ô trong hàng: ảnh = tỉ lệ khung (→ các ảnh cao bằng nhau), chữ = `grow`,
 *  ô trống = tỉ lệ trung bình của các ảnh trong hàng. */
export function rowGrows(row: RowBlock): number[] {
  const imgs = row.row.filter(isImageCell).map((c) => aspect(c.image));
  const avg = imgs.length ? imgs.reduce((a, b) => a + b, 0) / imgs.length : 1;
  return row.row.map((c) => (isImageCell(c) ? aspect(c.image) : isVideoCell(c) ? aspect(c.video.poster) : 'grow' in c ? c.grow : avg));
}

/** Chiều rộng hiển thị (đơn vị thiết kế) của mọi ảnh trong ô. */
export function imageWidths(item: Item): Map<string, number> {
  const out = new Map<string, number>();
  if (item.layout) {
    for (const r of toRows(item)) {
      if (r.kind === 'images') {
        const w = (CONTENT_W - GAP_X * (r.blocks.length - 1)) / r.blocks.length;
        r.blocks.forEach((b) => out.set(b.image, w));
      } else if (r.kind === 'pair') r.blocks.forEach((b) => isImage(b) && out.set(b.image, ZIGZAG_IMG_W));
    }
    return out;
  }
  for (const b of item.blocks) {
    if (isImage(b)) out.set(b.image, b.width ?? CONTENT_W);
    else if (isRow(b)) {
      const g = rowGrows(b);
      const sum = g.reduce((a, x) => a + x, 0);
      const free = (b.width ?? CONTENT_W) - (b.gap ?? GAP_X) * (b.row.length - 1);
      b.row.forEach((c, i) => {
        if (isImageCell(c)) out.set(c.image, (free * g[i]) / sum);
        else if (isVideoCell(c)) out.set(c.video.poster, (free * g[i]) / sum);
      });
    } else if (isSplit(b)) {
      const r = b.split.images.map(splitAspect);
      const sum = r.reduce((a, x) => a + x, 0);
      const free = b.split.mediaWidth - SPLIT_IMG_GAP * (r.length - 1);
      b.split.images.forEach((c, i) => out.set(c.image, (free * r[i]) / sum));
    } else if (isEntry(b)) {
      if (b.entry.image) out.set(b.entry.image, ENTRY_IMG_W);
      for (const c of b.entry.carousel ?? []) out.set(c.image, CAROUSEL_IMG_W);
    } else if (isVideo(b)) out.set(b.video.poster, b.width);
    else if (isMarquee(b))
      for (const c of b.marquee) {
        const id = 'video' in c ? c.video.poster : c.image;
        out.set(id, b.height * aspect(id));
      }
    // Trình chiếu: chỉ trang đầu được tải sẵn khi hover; các trang sau tải khi lật tới gần.
    else if (isSlideshow(b) && b.slideshow[0]) out.set(b.slideshow[0].image, CONTENT_W);
  }
  return out;
}

/** `sizes`: máy tính (≥ 1280px) theo tỉ lệ khung 1920; tablet (768–1279px) thang cố định 0.75px/đơn vị
 *  (xem section.css), không quá 90vw; điện thoại (< 768px) ảnh chiếm gần hết chiều ngang. */
export function vwSizes(designWidth: number): string {
  return `(max-width: 767px) 92vw, (max-width: 1279px) min(${Math.round(designWidth * 0.75)}px, 90vw), ${((designWidth / 1920) * 100).toFixed(1)}vw`;
}
