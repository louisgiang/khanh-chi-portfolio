import { useRef, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { SECTIONS, type SectionId } from '../../sections';
import { CONTENT } from '../../content';
import { preloadImage } from '../Img';
import { DUR, EASE } from '../../motion';
import { imageWidths, vwSizes } from './sizes';

/** Tải sẵn ảnh đầu tiên của trang (khi hover/focus tab). */
function prefetchFirstImage(id: SectionId) {
  const first = CONTENT[id]?.items[0];
  const img = first && [...imageWidths(first)][0];
  if (img) preloadImage(img[0], vwSizes(img[1]));
}

export function SectionHeader({ active }: { active: SectionId }) {
  const nav = useRef<HTMLElement>(null);

  // Điện thoại: thanh tab cuộn ngang, giữ tab đang mở trong tầm nhìn.
  useEffect(() => {
    const el = nav.current?.querySelector<HTMLElement>('[aria-current="page"]');
    el?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  }, [active]);

  return (
    <header className="sh">
      <div className="sh__badge-row">
        <Link to="/" className="sh__badge">
          Khánh Chi's Portfolio
        </Link>
      </div>
      <nav className="sh__tabs" ref={nav} aria-label="Sections">
        <ul>
          {SECTIONS.map((s) => {
            const on = s.id === active;
            return (
              <li key={s.id}>
                <Link
                  to={s.path}
                  className={`sh__tab${on ? ' is-active' : ''}`}
                  aria-current={on ? 'page' : undefined}
                  onPointerEnter={() => prefetchFirstImage(s.id)}
                  onFocus={() => prefetchFirstImage(s.id)}
                >
                  {on && <motion.span layoutId="tab-bg" className="sh__tab-bg" transition={{ duration: DUR.tab, ease: EASE }} />}
                  <span className="sh__tab-label">{s.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
