import type { Block, Item } from '../../content';
import { isImage } from '../../content';

// Kích thước theo khung thiết kế 1920: thẻ rộng 1138, nội dung 1053 (lề trong 40 + viền 3).
export const CONTENT_W = 1053;
export const GAP_X = 20;
export const ZIGZAG_IMG_W = 599;

type Img = Extract<Block, { image: string }>;

/** Chia khối thành hàng: ảnh liền nhau cùng một hàng (trừ ảnh `wide`), chữ một hàng riêng.
 *  Bố cục zigzag: ghép từng cặp chữ + ảnh thành một hàng 2 cột. */
export type Row = { kind: 'text'; block: Extract<Block, { text: string }> } | { kind: 'images'; blocks: Img[] } | { kind: 'pair'; blocks: [Block, Block] };

export function toRows(item: Item): Row[] {
  const rows: Row[] = [];
  const b = item.blocks;
  if (item.layout === 'zigzag') {
    for (let i = 0; i < b.length; i += 2) {
      if (b[i + 1]) rows.push({ kind: 'pair', blocks: [b[i], b[i + 1]] });
      else rows.push(isImage(b[i]) ? { kind: 'images', blocks: [b[i] as Img] } : { kind: 'text', block: b[i] as never });
    }
    return rows;
  }
  for (const block of b) {
    const last = rows.at(-1);
    if (!isImage(block)) rows.push({ kind: 'text', block });
    else if (!block.wide && last?.kind === 'images' && !last.blocks[0].wide) last.blocks.push(block);
    else rows.push({ kind: 'images', blocks: [block] });
  }
  return rows;
}

/** Chiều rộng hiển thị (đơn vị thiết kế) của một ảnh trong thẻ. */
export function imageWidth(item: Item, img: Img): number {
  if (item.layout === 'zigzag') return ZIGZAG_IMG_W;
  const row = toRows(item).find((r) => r.kind === 'images' && r.blocks.includes(img));
  const n = row && row.kind === 'images' ? row.blocks.length : 1;
  return (CONTENT_W - GAP_X * (n - 1)) / n;
}

/** `sizes`: máy tính theo tỉ lệ khung 1920; điện thoại (< 768px) ảnh chiếm gần hết chiều ngang. */
export function contentSizes(item: Item, img: Img): string {
  const vw = ((imageWidth(item, img) / 1920) * 100).toFixed(1);
  return `(max-width: 767px) 92vw, ${vw}vw`;
}
