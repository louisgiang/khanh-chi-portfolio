import { useState, type CSSProperties } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { Block, Cell, Entry, ImageRef, Item, RowBlock, VideoBlock } from '../../content';
import { isEntry, isImage, isImageCell, isRow, isText, isVideo } from '../../content';
import { Img, imageEntry } from '../Img';
import { DUR, EASE } from '../../motion';
import { imageWidths, rowGrows, toRows, vwSizes } from './sizes';

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
  if (isImage(b)) return <Picture img={b} ctx={ctx} />;
  if (isRow(b)) return <Row row={b} ctx={ctx} />;
  if (isEntry(b)) return <EntryView entry={b.entry} ctx={ctx} last={last} />;
  if (isVideo(b)) return <Video block={b} ctx={ctx} />;
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
        {c.note && <p className="item__note">{c.note}</p>}
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
