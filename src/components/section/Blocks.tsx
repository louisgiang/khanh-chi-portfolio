import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { Block, Cell, Entry, ImageRef, Item, MarqueeBlock, RowBlock, SlideshowBlock, VideoBlock } from '../../content';
import { isButton, isDivider, isEntry, isImage, isImageCell, isMarquee, isRow, isSlideshow, isText, isVideo } from '../../content';
import { Img, imageEntry } from '../Img';
import { DUR, EASE } from '../../motion';
import { CONTENT_W, imageWidths, rowGrows, toRows, vwSizes } from './sizes';

const DEFAULT_GAP = 25;
// Nút tiêu đề đã có đệm dưới 24 → khối đầu tiên trừ đi phần này.
const TITLE_PAD = 24;
const u = (n: number) => `calc(var(--s) * ${n})`;

type Ctx = { load: boolean; widths: Map<string, number> };

export function ItemContent({ item, load }: { item: Item; load: boolean }) {
  const ctx: Ctx = { load, widths: imageWidths(item) };
  if (item.layout) return <LegacyContent item={item} ctx={ctx} />;
  return (
    <>
      {item.blocks.map((b, i) => {
        const mt = (b.mt ?? (isEntry(b) ? 0 : DEFAULT_GAP)) - (i === 0 ? TITLE_PAD : 0);
        const last = i === item.blocks.length - 1;
        return (
          <div key={i} className="blk" style={{ marginTop: u(mt) }}>
            <BlockView block={b} ctx={ctx} last={last} />
          </div>
        );
      })}
    </>
  );
}

function BlockView({ block: b, ctx, last }: { block: Block; ctx: Ctx; last: boolean }) {
  if (isText(b)) return <p className={`item__text${b.variant ? ` item__text--${b.variant}` : ''}`}>{b.text}</p>;
  if (isImage(b))
    return <Picture img={b} ctx={ctx} style={b.width ? { width: u(b.width), marginInline: b.center ? 'auto' : undefined } : undefined} />;
  if (isButton(b)) {
    const cls = `pill-btn${b.center ? ' is-center' : ''}`;
    return (
      <p className={`pill-btn__wrap${b.center ? ' is-center' : ''}`}>
        {b.button.href ? (
          <a className={cls} href={b.button.href} target="_blank" rel="noopener noreferrer">
            {b.button.text}
          </a>
        ) : (
          <span className={cls}>{b.button.text}</span>
        )}
      </p>
    );
  }
  if (isRow(b)) return <Row row={b} ctx={ctx} />;
  if (isEntry(b)) return <EntryView entry={b.entry} ctx={ctx} last={last} />;
  if (isVideo(b)) return <Video block={b} ctx={ctx} />;
  if (isMarquee(b)) return <Marquee block={b} ctx={ctx} />;
  if (isDivider(b)) return <hr className="item__divider" />;
  if (isSlideshow(b)) return <Slideshow block={b} ctx={ctx} />;
  return null;
}

function Picture({ img, ctx, style }: { img: ImageRef; ctx: Ctx; style?: CSSProperties }) {
  return (
    <Img
      id={img.image}
      alt={img.alt}
      sizes={vwSizes(ctx.widths.get(img.image) ?? 1053)}
      load={ctx.load}
      className={`item__img${img.square ? ' is-square' : ''}`}
      style={style}
    />
  );
}

function Row({ row, ctx }: { row: RowBlock; ctx: Ctx }) {
  const grows = rowGrows(row);
  return (
    <div className={`item__flex${row.align === 'center' ? ' is-center' : ''}`} style={{ gap: u(row.gap ?? 20) }}>
      {row.row.map((c, i) => (
        <div key={i} className="item__cell" style={{ flexGrow: grows[i] }}>
          <CellView cell={c} ctx={ctx} />
        </div>
      ))}
    </div>
  );
}

function CellView({ cell: c, ctx }: { cell: Cell; ctx: Ctx }) {
  if (isImageCell(c))
    return (
      <>
        <Picture img={c} ctx={ctx} />
        {c.caption && (
          <p className="item__caption">
            <strong>{c.caption.title}</strong>
            {c.caption.inline ? ' ' : <br />}
            {c.caption.text}
          </p>
        )}
        {c.note && <p className={`item__note${c.box ? ' item__note--box' : ''}`}>{c.note}</p>}
      </>
    );
  if ('text' in c) return <p className="item__text">{c.text}</p>;
  return null;
}

function MaybeLink({ href, children }: { href?: string; children: React.ReactNode }) {
  if (!href) return <>{children}</>;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="item__link">
      {children}
    </a>
  );
}

function EntryView({ entry: e, ctx, last }: { entry: Entry; ctx: Ctx; last: boolean }) {
  const media = e.carousel ? (
    <Carousel images={e.carousel} ctx={ctx} />
  ) : e.image ? (
    <Picture img={{ image: e.image, alt: e.alt ?? '', square: true }} ctx={ctx} />
  ) : null;
  return (
    <article className={`entry entry--${e.side}${e.carousel ? ' has-carousel' : ''}${last ? ' is-last' : ''}`}>
      <div className="entry__media">{media}</div>
      <div className="entry__body">
        <h3 className="entry__title">
          <MaybeLink href={e.href}>{e.title}</MaybeLink>
        </h3>
        <p className="entry__meta">
          <strong>{e.meta.label}</strong> <MaybeLink href={e.meta.href}>{e.meta.text}</MaybeLink>
        </p>
        <p className="item__text">{e.text}</p>
      </div>
    </article>
  );
}

function Carousel({ images, ctx }: { images: ImageRef[]; ctx: Ctx }) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  const n = images.length;
  const go = (d: number) => setI((x) => (x + d + n) % n);
  return (
    <div className="carousel" role="group" aria-roledescription="carousel" aria-label="Essay pages">
      <button type="button" className="carousel__btn carousel__btn--prev" aria-label="Previous page" onClick={() => go(-1)}>
        <svg viewBox="0 0 16 19" aria-hidden="true">
          <polygon points="0,9.5 16,0 16,19" />
        </svg>
      </button>
      <div className="carousel__viewport">
        <motion.div
          className="carousel__track"
          animate={{ x: `${-i * 100}%` }}
          initial={false}
          transition={{ duration: reduce ? 0 : DUR.tab + 0.1, ease: EASE }}
        >
          {images.map((img, k) => (
            <div key={img.image} className="carousel__slide" aria-hidden={k !== i}>
              <Picture img={{ ...img, square: true }} ctx={ctx} />
            </div>
          ))}
        </motion.div>
      </div>
      <button type="button" className="carousel__btn carousel__btn--next" aria-label="Next page" onClick={() => go(1)}>
        <svg viewBox="0 0 16 19" aria-hidden="true">
          <polygon points="16,9.5 0,0 0,19" />
        </svg>
      </button>
      <p className="visually-hidden" aria-live="polite">
        Page {i + 1} of {n}
      </p>
    </div>
  );
}

/** Băng ảnh trượt ngang tự động, chạy vòng (dãy ảnh lặp 2 lần, trượt đúng nửa chiều dài rồi quay lại
 *  — khớp liền nên không thấy chỗ nối). Dừng khi rê chuột / focus; giảm chuyển động → đứng yên, cuộn tay. */
const MARQUEE_SPEED = 45; // đơn vị thiết kế / giây
function Marquee({ block: b, ctx }: { block: MarqueeBlock; ctx: Ctx }) {
  const reduce = useReducedMotion();
  const gap = b.gap ?? 10;
  const imgW = (c: ImageRef) => b.height * (imageEntry(c.image)?.aspect ?? 1);
  // Ảnh dọc hẹp có chú thích: khung rộng tối thiểu minWidth (nếu đặt) để chú thích không quá nhiều dòng.
  const slideW = (c: MarqueeBlock['marquee'][number]) => (c.note ? Math.max(imgW(c), b.minWidth ?? 0) : imgW(c));
  const len = b.marquee.reduce((s, c) => s + slideW(c) + gap, 0);
  const slides = (copy: number) =>
    b.marquee.map((c) => (
      <figure
        key={`${copy}-${c.image}`}
        className="marquee__slide"
        style={{ width: u(slideW(c)), marginRight: u(gap) }}
        aria-hidden={copy > 0 || undefined}
      >
        <Picture img={c} ctx={ctx} style={{ width: u(imgW(c)), marginInline: 'auto' }} />
        {c.note && <figcaption className="item__note item__note--box">{c.note}</figcaption>}
        {c.button && (
          <p className="pill-btn__wrap is-center marquee__btn">
            {c.button.href ? (
              <a className="pill-btn" href={c.button.href} target="_blank" rel="noopener noreferrer" tabIndex={copy > 0 ? -1 : undefined}>
                {c.button.text}
              </a>
            ) : (
              <span className="pill-btn">{c.button.text}</span>
            )}
          </p>
        )}
      </figure>
    ));
  return (
    <div
      className={`marquee${reduce ? ' is-static' : ''}`}
      role="group"
      aria-roledescription="carousel"
      aria-label="Gallery"
      tabIndex={reduce ? 0 : undefined}
      style={{ '--marquee-dur': `${(len / MARQUEE_SPEED).toFixed(1)}s` } as CSSProperties}
    >
      <div className="marquee__track">
        {slides(0)}
        {!reduce && slides(1)}
      </div>
    </div>
  );
}

/** Trình chiếu full chiều ngang (Photography Portfolio): tự lật trang mỗi SLIDE_INTERVAL, luôn trượt
 *  cùng một chiều (sau trang cuối là bản sao trang đầu, tới đó thì nhảy thầm về trang đầu).
 *  Chỉ chạy khi khung đang hiện trong màn hình (thẻ mở); dừng khi rê chuột / focus; phím ←/→ vẫn lật được.
 *  Chỉ tải trang đang xem và trang kế tiếp; trang đã tải thì giữ lại. */
const SLIDE_INTERVAL = 3000;
function Slideshow({ block: b, ctx }: { block: SlideshowBlock; ctx: Ctx }) {
  const n = b.slideshow.length;
  const [i, setI] = useState(0); // 0..n (n = bản sao trang đầu)
  const [instant, setInstant] = useState(false);
  const [seen, setSeen] = useState(() => new Set([0, 1 % n]));
  const [visible, setVisible] = useState(false);
  const [hold, setHold] = useState(false);
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting && e.intersectionRatio > 0.3), {
      threshold: [0, 0.3, 0.6],
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const go = (d: number) => {
    setInstant(false);
    setI((x) => {
      const cur = x % n;
      if (d < 0) return (cur - 1 + n) % n;
      return reduce ? (cur + 1) % n : cur + 1; // giảm chuyển động: đổi trang tức thì, không cần bản sao
    });
  };
  const page = i % n;
  useEffect(() => {
    setSeen((s) => (s.has(page) && s.has((page + 1) % n) ? s : new Set([...s, page, (page + 1) % n])));
  }, [page, n]);

  useEffect(() => {
    if (!visible || hold || n < 2) return;
    const t = window.setTimeout(() => go(1), SLIDE_INTERVAL);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, visible, hold, n]);

  const aspect = imageEntry(b.slideshow[0]?.image ?? '')?.aspect ?? 16 / 9;
  const sizes = vwSizes(CONTENT_W);
  const slides = [...b.slideshow, b.slideshow[0]];
  return (
    <div
      ref={ref}
      className="slideshow"
      role="group"
      aria-roledescription="carousel"
      aria-label={b.label ?? 'Slideshow'}
      tabIndex={0}
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={() => setHold(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') go(-1);
        else if (e.key === 'ArrowRight') go(1);
      }}
    >
      <div className="slideshow__viewport" style={{ aspectRatio: aspect }}>
        <motion.div
          className="slideshow__track"
          animate={{ x: `${-i * 100}%` }}
          initial={false}
          transition={{ duration: reduce || instant ? 0 : DUR.expand, ease: EASE }}
          onAnimationComplete={() => {
            if (i === n) {
              setInstant(true);
              setI(0);
            }
          }}
        >
          {slides.map((img, k) => (
            <div key={k} className="slideshow__slide" aria-hidden={k % n !== page || k === n}>
              <Img id={img.image} alt={img.alt} sizes={sizes} load={ctx.load && seen.has(k % n)} fill className="slideshow__img" />
            </div>
          ))}
        </motion.div>
      </div>
      <p className="slideshow__count" aria-live={hold ? 'polite' : 'off'}>
        {page + 1} / {n}
      </p>
    </div>
  );
}

/** Lấy mã video từ link YouTube (hoặc mã trần). */
function youtubeId(v?: string) {
  if (!v) return null;
  const m = v.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return m ? m[1] : /^[\w-]{11}$/.test(v) ? v : null;
}

function Video({ block: b, ctx }: { block: VideoBlock; ctx: Ctx }) {
  const id = youtubeId(b.video.youtube);
  const [playing, setPlaying] = useState(false);
  return (
    <div className="video" style={{ width: u(b.width) }}>
      {playing && id ? (
        <iframe
          className="video__frame"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={b.video.alt}
          style={{ aspectRatio: imageEntry(b.video.poster)?.aspect }}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <>
          <Picture img={{ image: b.video.poster, alt: b.video.alt }} ctx={ctx} />
          {/* Chừa khung: khi có link YouTube (trường "youtube" trong content) sẽ bấm để phát. */}
          {id && (
            <button type="button" className="video__play" aria-label={`Play video: ${b.video.alt}`} onClick={() => setPlaying(true)}>
              <svg viewBox="0 0 68 48" aria-hidden="true">
                <path d="M66.5 7.7a8.5 8.5 0 0 0-6-6C55.3.3 34 .3 34 .3s-21.3 0-26.5 1.4a8.5 8.5 0 0 0-6 6C.1 13 .1 24 .1 24s0 11 1.4 16.3a8.5 8.5 0 0 0 6 6C12.7 47.7 34 47.7 34 47.7s21.3 0 26.5-1.4a8.5 8.5 0 0 0 6-6C67.9 35 67.9 24 67.9 24s0-11-1.4-16.3z" fill="#f00" />
                <path d="M27 34V14l18 10z" fill="#fff" />
              </svg>
            </button>
          )}
        </>
      )}
    </div>
  );
}

// ---------- Bố cục My Journey ----------
function LegacyContent({ item, ctx }: { item: Item; ctx: Ctx }) {
  return (
    <div className="item__legacy">
      {toRows(item).map((row, i) => {
        if (row.kind === 'text') return <p key={i} className="item__text">{row.block.text}</p>;
        if (row.kind === 'images')
          return (
            <div key={i} className="item__row">
              {row.blocks.map((b) => (
                <Picture key={b.image} img={b} ctx={ctx} />
              ))}
            </div>
          );
        const imgFirst = isImage(row.blocks[0]);
        return (
          <div key={i} className={`item__pair${imgFirst ? ' is-img-first' : ''}`}>
            {row.blocks.map((b) =>
              isImage(b) ? (
                <Picture key={b.image} img={b} ctx={ctx} />
              ) : (
                <p key="t" className="item__text">
                  {isText(b) ? b.text : null}
                </p>
              ),
            )}
          </div>
        );
      })}
    </div>
  );
}
