import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { Item } from '../../content';
import { isImage } from '../../content';
import { Img, preloadImage } from '../Img';
import { DUR, EASE } from '../../motion';
import { contentSizes, toRows } from './sizes';

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

  const toggle = (id: string) => {
    const next = openId === id ? null : id;
    setOpenId(next);
    writeHash(next);
  };

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
          onToggle={() => toggle(item.id)}
          onOpened={() => onOpened(item.id)}
          setRef={(el) => (el ? refs.current.set(item.id, el) : refs.current.delete(item.id))}
        />
      ))}
    </div>
  );
}

type Props = { item: Item; open: boolean; onToggle: () => void; onOpened: () => void; setRef: (el: HTMLElement | null) => void };

function ExpandItem({ item, open, onToggle, onOpened, setRef }: Props) {
  const reduce = useReducedMotion();
  // Ảnh trong ô thu gọn chỉ tải khi chuột di vào / focus / mở.
  const [warmed, setWarmed] = useState(open);
  const warm = () => {
    if (warmed) return;
    setWarmed(true);
    for (const b of item.blocks) if (isImage(b)) preloadImage(b.image, contentSizes(item, b));
  };
  // Nội dung được dựng sẵn (ẩn) để lúc bấm chỉ còn animate chiều cao — không phải dựng DOM giữa chừng.
  // Thu xong thì ẩn hẳn (visibility) để không đọc/tab được vào nội dung đang đóng.
  const [settled, setSettled] = useState(!open);
  useEffect(() => {
    if (open) {
      setSettled(false);
      setWarmed(true); // mở bằng #hash / nút Back: chưa qua hover
    }
  }, [open]);

  const btnId = `${item.id}-btn`;
  const panelId = `${item.id}-panel`;
  const dur = reduce ? 0 : DUR.expand;

  return (
    <section className={`item${open ? ' is-open' : ''}`} ref={setRef}>
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
            onToggle();
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
        onAnimationComplete={() => (open ? onOpened() : setSettled(true))}
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
          <ItemContent item={item} load={warmed} />
        </motion.div>
      </motion.div>
    </section>
  );
}

function ItemContent({ item, load }: { item: Item; load: boolean }) {
  return (
    <>
      {toRows(item).map((row, i) => {
        if (row.kind === 'text') return <p key={i} className="item__text">{row.block.text}</p>;
        if (row.kind === 'images')
          return (
            <div key={i} className="item__row">
              {row.blocks.map((b) => (
                <Img key={b.image} id={b.image} alt={b.alt} sizes={contentSizes(item, b)} load={load} className="item__img" />
              ))}
            </div>
          );
        const imgFirst = isImage(row.blocks[0]);
        return (
          <div key={i} className={`item__pair${imgFirst ? ' is-img-first' : ''}`}>
            {row.blocks.map((b) =>
              isImage(b) ? (
                <Img key={b.image} id={b.image} alt={b.alt} sizes={contentSizes(item, b)} load={load} className="item__img" />
              ) : (
                <p key="t" className="item__text">
                  {b.text}
                </p>
              ),
            )}
          </div>
        );
      })}
    </>
  );
}
