import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { Item } from '../../content';
import { preloadImage } from '../Img';
import { ItemContent } from './Blocks';
import { DUR, EASE } from '../../motion';
import { imageWidths, vwSizes } from './sizes';

const hashId = () => decodeURIComponent(window.location.hash.slice(1));

/** Ghi ô đang mở lên địa chỉ (không tạo mục lịch sử mới, không để router cuộn). */
function writeHash(id: string | null) {
  const url = window.location.pathname + window.location.search + (id ? `#${encodeURIComponent(id)}` : '');
  window.history.replaceState(window.history.state, '', url);
}

export function ItemList({ items }: { items: Item[] }) {
  const [openId, setOpenId] = useState<string | null>(() => {
    const h = hashId();
    return items.some((i) => i.id === h) ? h : null;
  });
  const refs = useRef(new Map<string, HTMLElement>());
  const openRef = useRef(openId);
  openRef.current = openId;
  const reduce = useReducedMotion();

  // Mở link có sẵn #id: cuộn ngay tới thẻ (không hiệu ứng).
  useLayoutEffect(() => {
    if (!openId) return;
    const el = refs.current.get(openId);
    if (el) window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - 24, behavior: 'instant' });
    // chỉ chạy lúc vào trang
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onHash = () => {
      const h = hashId();
      setOpenId(items.some((i) => i.id === h) ? h : null);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [items]);

  // Callback ổn định (không đổi giữa các lần render) → chỉ thẻ đổi trạng thái mới render lại.
  const toggle = useCallback((id: string) => {
    const next = openRef.current === id ? null : id;
    setOpenId(next);
    writeHash(next);
  }, []);
  const setRef = useCallback((id: string, el: HTMLElement | null) => {
    if (el) refs.current.set(id, el);
    else refs.current.delete(id);
  }, []);

  // Mở xong mà đầu thẻ bị khuất phía trên → cuộn mượt cho đầu thẻ vào màn hình.
  const onOpened = useCallback(
    (id: string) => {
      const el = refs.current.get(id);
      // AnimatePresence giữ props cũ khi thu lại → chỉ xử lý nếu thẻ vẫn đang mở.
      if (!el || openRef.current !== id) return;
      const top = el.getBoundingClientRect().top;
      if (top < 8) window.scrollTo({ top: window.scrollY + top - 24, behavior: reduce ? 'instant' : 'smooth' });
    },
    [reduce],
  );

  return (
    <div className="items">
      {items.map((item) => (
        <ExpandItem
          key={item.id}
          item={item}
          open={openId === item.id}
          onToggle={toggle}
          onOpened={onOpened}
          setRef={setRef}
        />
      ))}
    </div>
  );
}

type Props = {
  item: Item;
  open: boolean;
  onToggle: (id: string) => void;
  onOpened: (id: string) => void;
  setRef: (id: string, el: HTMLElement | null) => void;
};

const ExpandItem = memo(function ExpandItem({ item, open, onToggle, onOpened, setRef }: Props) {
  const reduce = useReducedMotion();
  // Ảnh trong ô thu gọn chỉ tải khi chuột di vào / focus / mở.
  const [warmed, setWarmed] = useState(open);
  const warm = () => {
    if (warmed) return;
    setWarmed(true);
    for (const [id, w] of imageWidths(item)) preloadImage(id, vwSizes(w));
  };
  // Nội dung dựng sẵn (ẩn) từ lúc hover để lúc bấm chỉ còn animate chiều cao.
  // Thu xong thì ẩn hẳn (visibility) để không đọc/tab được vào nội dung đang đóng.
  const [settled, setSettled] = useState(!open);
  useEffect(() => {
    if (open) {
      setSettled(false);
      setWarmed(true); // mở bằng #hash / nút Back: chưa qua hover
    }
  }, [open]);

  const sectionRef = useCallback((el: HTMLElement | null) => setRef(item.id, el), [setRef, item.id]);
  // Nội dung chỉ được dựng khi sắp mở (hover/focus/mở) → vào trang nhẹ; dựng xong thì giữ lại.
  const ready = warmed || open;
  const content = useMemo(() => (ready ? <ItemContent item={item} load /> : null), [item, ready]);

  const btnId = `${item.id}-btn`;
  const panelId = `${item.id}-panel`;
  const dur = reduce ? 0 : DUR.expand;

  return (
    <section className={`item${open ? ' is-open' : ''}${!open && settled ? ' is-settled' : ''}`} ref={sectionRef}>
      <span className="item__bg item__bg--closed" aria-hidden="true" />
      <span className="item__bg item__bg--open" aria-hidden="true" />
      <h2 className="item__h">
        <button
          id={btnId}
          type="button"
          className="item__btn"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => {
            warm();
            onToggle(item.id);
          }}
          onPointerEnter={warm}
          onFocus={warm}
        >
          <span className="item__t item__t--grad">{item.title}</span>
          <span className="item__t item__t--white" aria-hidden="true">
            {item.title}
          </span>
        </button>
      </h2>
      <motion.div
        id={panelId}
        role="region"
        aria-labelledby={btnId}
        className="item__panel"
        style={{ visibility: !open && settled ? 'hidden' : undefined }}
        initial={false}
        animate={{ height: open ? 'auto' : 0 }}
        transition={{ duration: dur, ease: EASE }}
        onAnimationComplete={() => (open ? onOpened(item.id) : setSettled(true))}
      >
        <motion.div
          className="item__content"
          initial={false}
          animate={
            open
              ? { opacity: 1, y: 0, transition: { duration: reduce ? 0.15 : DUR.expand - DUR.contentDelay, delay: reduce ? 0 : DUR.contentDelay, ease: EASE } }
              : { opacity: 0, y: reduce ? 0 : 16, transition: { duration: reduce ? 0.1 : 0.2, ease: EASE } }
          }
        >
          {content}
        </motion.div>
      </motion.div>
    </section>
  );
});
