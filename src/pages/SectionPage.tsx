import { useLocation } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { SECTIONS } from '../sections';
import { CONTENT } from '../content';
import { DUR, EASE } from '../motion';
import { SectionHeader } from '../components/section/SectionHeader';
import { ItemList } from '../components/section/ItemList';
import '../components/section/section.css';

// Khuôn chung cho 5 trang thành phần. Đầu trang đứng yên, chỉ phần thân chuyển khi đổi tab.
export default function SectionPage() {
  const { pathname } = useLocation();
  const section = SECTIONS.find((s) => s.path === pathname) ?? SECTIONS[0];
  const content = CONTENT[section.id];
  const half = DUR.tab / 2;

  return (
    <div className="page">
      <div className="page__inner">
        <SectionHeader active={section.id} />
        <AnimatePresence mode="wait" initial={false}>
          <motion.main
            key={section.id}
            className="page__body"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: half, ease: EASE } }}
            exit={{ opacity: 0, transition: { duration: half, ease: EASE } }}
          >
            <div className="page__intro">
              <h1 className="page__title">{content?.title ?? section.title}</h1>
              {content?.intro && <p className={`page__lead${content.introStyle === 'italic' ? ' is-italic' : ''}`}>{content.intro}</p>}
            </div>
            {content && <ItemList key={section.id} items={content.items} />}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}
