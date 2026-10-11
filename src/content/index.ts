import myJourney from '../../content/my-journey.json';
import type { SectionId } from '../sections';

export type Block = { text: string } | { image: string; alt: string; draft?: boolean; wide?: boolean };
export type Item = { id: string; title: string; layout: 'zigzag' | 'grid'; blocks: Block[] };
export type PageContent = { title: string; intro?: string; introStyle?: 'italic'; items: Item[] };

// Trang chưa có nội dung (anh/chị bổ sung sau) → undefined.
export const CONTENT: Partial<Record<SectionId, PageContent>> = {
  'my-journey': myJourney as PageContent,
};

export const isImage = (b: Block): b is Extract<Block, { image: string }> => 'image' in b;
