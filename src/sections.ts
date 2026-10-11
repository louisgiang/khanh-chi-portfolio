export type SectionId = 'my-journey' | 'applied-science' | 'craft-villages' | 'stage-and-screen' | 'my-little-village';

export const SECTIONS: { id: SectionId; title: string; path: string }[] = [
  { id: 'my-journey', title: 'My Journey', path: '/my-journey' },
  { id: 'applied-science', title: 'Applied Science', path: '/applied-science' },
  { id: 'craft-villages', title: 'Craft Villages', path: '/craft-villages' },
  { id: 'stage-and-screen', title: 'Stage & Screen', path: '/stage-and-screen' },
  { id: 'my-little-village', title: 'My Little Village', path: '/my-little-village' },
];

export const sectionPath = (id: SectionId) => SECTIONS.find((s) => s.id === id)!.path;

// Tải sẵn code trang thành phần (gọi khi hover/focus cánh hoa hoặc tab).
export const loadSectionPage = () => import('./pages/SectionPage');
let prefetched = false;
export function prefetchSection(_id: SectionId) {
  if (prefetched) return;
  prefetched = true;
  void loadSectionPage();
}
