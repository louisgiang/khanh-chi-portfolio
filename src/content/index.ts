import myJourney from '../../content/my-journey.json';
import appliedScience from '../../content/applied-science.json';
import craftVillages from '../../content/craft-villages.json';
import type { SectionId } from '../sections';

/** mt = khoảng cách phía trên khối, đơn vị thiết kế 1920 (mặc định 25). */
type Spaced = { mt?: number };

export type ImageRef = { image: string; alt: string; draft?: boolean; square?: boolean };
export type TextBlock = Spaced & { text: string; variant?: 'body' | 'heading' | 'subtitle' | 'title' | 'lead' | 'caption' };
export type ImageBlock = Spaced & ImageRef & { wide?: boolean };

export type Caption = { title: string; text: string; inline?: boolean };
export type Cell =
  | (ImageRef & { caption?: Caption; note?: string; box?: boolean })
  | { text: string; grow: number }
  | { spacer: true };
export type RowBlock = Spaced & { row: Cell[]; gap?: number; align?: 'start' | 'center' };

export type Entry = {
  side: 'left' | 'right';
  image?: string;
  alt?: string;
  draft?: boolean;
  carousel?: ImageRef[];
  title: string;
  href?: string;
  meta: { label: string; text: string; href?: string };
  text: string;
};
export type EntryBlock = Spaced & { entry: Entry };
export type VideoBlock = Spaced & { video: { poster: string; alt: string; draft?: boolean; youtube?: string }; width: number };

/** Băng ảnh trượt ngang tự động (ảnh cao bằng nhau `height`, mỗi ảnh có thể kèm ô chú thích). */
/** minWidth: khung ảnh có chú thích rộng tối thiểu (đơn vị thiết kế) — cho ảnh dọc hẹp, tránh chú thích quá nhiều dòng. */
export type MarqueeBlock = Spaced & { marquee: (ImageRef & { note?: string })[]; height: number; gap?: number; minWidth?: number };
export type DividerBlock = Spaced & { divider: true };
/** Trình chiếu full chiều ngang thẻ, lật trang bằng mũi tên (khung theo tỉ lệ ảnh đầu tiên). */
export type SlideshowBlock = Spaced & { slideshow: ImageRef[]; label?: string };

export type Block = TextBlock | ImageBlock | RowBlock | EntryBlock | VideoBlock | MarqueeBlock | DividerBlock | SlideshowBlock;
/** zigzag/grid: bố cục My Journey (tự ghép ảnh/chữ thành hàng). Không có: khối hiển thị theo thứ tự. */
export type Item = { id: string; title: string; layout?: 'zigzag' | 'grid'; blocks: Block[] };
export type PageContent = { title: string; intro?: string; introStyle?: 'italic'; items: Item[] };

// Trang chưa có nội dung (anh/chị bổ sung sau) → undefined.
export const CONTENT: Partial<Record<SectionId, PageContent>> = {
  'my-journey': myJourney as PageContent,
  'applied-science': appliedScience as PageContent,
  'craft-villages': craftVillages as PageContent,
};

export const isImage = (b: Block): b is ImageBlock => 'image' in b;
export const isText = (b: Block): b is TextBlock => 'text' in b && !('grow' in b);
export const isRow = (b: Block): b is RowBlock => 'row' in b;
export const isEntry = (b: Block): b is EntryBlock => 'entry' in b;
export const isVideo = (b: Block): b is VideoBlock => 'video' in b;
export const isMarquee = (b: Block): b is MarqueeBlock => 'marquee' in b;
export const isDivider = (b: Block): b is DividerBlock => 'divider' in b;
export const isSlideshow = (b: Block): b is SlideshowBlock => 'slideshow' in b;
export const isImageCell = (c: Cell): c is Extract<Cell, { image: string }> => 'image' in c;

/** Mọi ảnh của một ô (để tải sẵn khi hover). */
export function itemImages(item: Item): string[] {
  const out: string[] = [];
  for (const b of item.blocks) {
    if (isImage(b)) out.push(b.image);
    else if (isRow(b)) {
      for (const c of b.row) if (isImageCell(c)) out.push(c.image);
    } else if (isEntry(b)) {
      if (b.entry.image) out.push(b.entry.image);
      for (const c of b.entry.carousel ?? []) out.push(c.image);
    } else if (isVideo(b)) out.push(b.video.poster);
    else if (isMarquee(b)) for (const c of b.marquee) out.push(c.image);
    else if (isSlideshow(b)) for (const c of b.slideshow) out.push(c.image);
  }
  return out;
}
