import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { useNavigate } from 'react-router';
import { PETALS, RAYS } from './geometry';
import { Img } from '../Img';
import { DUR, EASE_IN_OUT } from '../../motion';
import { prefetchSection, SECTIONS, sectionPath, type SectionId } from '../../sections';
import './flower.css';

// Khung bông hoa trong toạ độ thiết kế 1920×1080.
const FX = 90;
const FY = 110;
const FW = 880;
const FH = 890;
const VIEWBOX = `${FX} ${FY} ${FW} ${FH}`;

type Pt = readonly [number, number];
type Petal = (typeof PETALS)[number];

// Thứ tự Tab: theo thanh tab (My Journey → … → My Little Village), không theo thứ tự vẽ.
const TAB_ORDER = SECTIONS.map((s) => PETALS.find((p) => p.id === s.id)!);

const pts = (q: readonly Pt[], dx = 0, dy = 0) => q.map(([x, y]) => `${x + dx},${y + dy}`).join(' ');
const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(3)}%`;

const ALT: Record<SectionId, string> = {
  // TODO(duyệt alt): bản nháp, xem NOTES.md
  'my-journey': 'Khánh Chi đứng trên bãi cỏ ven sông, tay dang rộng',
  'applied-science': 'Khánh Chi cùng các bạn và thầy cô tại cuộc thi VSIC 2026',
  'craft-villages': 'Khánh Chi ngồi bên bờ nước, cầm thiết bị đo chất lượng nước',
  'stage-and-screen': 'Khánh Chi lúc nhỏ trong trang phục múa, trước băng rôn cuộc thi tài năng',
  'my-little-village': 'Khánh Chi hướng dẫn một em nhỏ làm thủ công',
};

export function Flower({ backsReady }: { backsReady: boolean }) {
  const navigate = useNavigate();
  const [active, setActive] = useState<SectionId | null>(null);
  const pointerType = useRef<string>('mouse');
  const root = useRef<HTMLDivElement>(null);

  // Chạm ra ngoài bông hoa → lật lại.
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (!(e.target as Element).closest?.('.flower__link')) setActive(null);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, []);

  const open = (id: SectionId) => {
    prefetchSection(id);
    setActive(id);
  };

  return (
    <div className="flower" ref={root}>
      <svg className="flower__rays" viewBox={VIEWBOX} aria-hidden="true">
        <defs>
          {RAYS.map((r, i) => (
            <linearGradient key={i} id={`ray-g${i}`} gradientUnits="userSpaceOnUse" x1={r.grad.x1} y1={r.grad.y1} x2={r.grad.x2} y2={r.grad.y2}>
              <stop offset="0" stopColor={r.grad.from} />
              <stop offset="1" stopColor={r.grad.to} />
            </linearGradient>
          ))}
        </defs>
        {RAYS.map((r, i) => (
          <g key={i}>
            <path fill="#FFF551" fillRule="evenodd" d={`M${pts(r.outer)}Z M${pts(r.inner)}Z`} />
            <polygon fill={`url(#ray-g${i})`} points={pts(r.fill)} />
          </g>
        ))}
      </svg>

      {PETALS.map((p, i) => (
        <PetalCard key={p.id} petal={p} index={i} flipped={active === p.id} backsReady={backsReady} />
      ))}

      {/* Lớp nhận chuột/chạm/bàn phím: đúng hình cánh hoa */}
      <svg className="flower__hit" viewBox={VIEWBOX}>
        {TAB_ORDER.map((p) => {
          const path = sectionPath(p.id);
          return (
            <a
              key={p.id}
              href={path}
              className="flower__link"
              aria-label={p.label.lines.join(' ')}
              onPointerDown={(e) => (pointerType.current = e.pointerType)}
              onPointerEnter={(e) => e.pointerType === 'mouse' && open(p.id)}
              onPointerLeave={(e) => e.pointerType === 'mouse' && setActive((a) => (a === p.id ? null : a))}
              onFocus={() => open(p.id)}
              onBlur={() => setActive((a) => (a === p.id ? null : a))}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                e.preventDefault();
                // Điện thoại: chạm lần 1 lật cánh, lần 2 vào trang.
                if (pointerType.current !== 'mouse' && e.detail > 0 && active !== p.id) {
                  open(p.id);
                  return;
                }
                navigate(path);
              }}
            >
              <polygon points={pts(p.poly, p.box[0], p.box[1])} />
            </a>
          );
        })}
      </svg>
    </div>
  );
}

function PetalCard({ petal: p, index, flipped, backsReady }: { petal: Petal; index: number; flipped: boolean; backsReady: boolean }) {
  const reduce = useReducedMotion();
  const [settling, setSettling] = useState(false);
  const [x, y, w, h] = p.box;
  const raised = flipped || settling;

  // Đang lật về: vẫn nổi trên các cánh khác cho tới khi xong.
  const wasFlipped = useRef(false);
  useEffect(() => {
    if (wasFlipped.current && !flipped) setSettling(true);
    wasFlipped.current = flipped;
  }, [flipped]);

  const g = p.grad;
  const clip = `polygon(${p.poly.map(([px, py]) => `${pct(px, w)} ${pct(py, h)}`).join(', ')})`;
  const label = (
    <text x={p.label.cx - x} textAnchor="middle" className="petal__label">
      {p.label.lines.map((l, i) => (
        <tspan key={i} x={p.label.cx - x} y={p.label.base[i] - y}>
          {l}
        </tspan>
      ))}
    </text>
  );
  const transition = { duration: reduce ? DUR.flipReduced : DUR.flip, ease: EASE_IN_OUT };

  return (
    <div
      className={`petal${raised ? ' is-raised' : ''}${reduce ? ' is-reduced' : ''}`}
      style={{ left: pct(x - FX, FW), top: pct(y - FY, FH), width: pct(w, FW), height: pct(h, FH), zIndex: raised ? 10 : index + 1 }}
      aria-hidden="true"
    >
      <motion.div
        className="petal__card"
        initial={false}
        animate={reduce ? { rotateY: 0 } : { rotateY: flipped ? 180 : 0 }}
        transition={transition}
        onAnimationComplete={() => !flipped && setSettling(false)}
      >
        <motion.div className="petal__face petal__front" initial={false} animate={{ opacity: reduce && flipped ? 0 : 1 }} transition={transition}>
          <svg viewBox={`0 0 ${w} ${h}`}>
            <defs>
              <linearGradient id={`pg-${p.id}`} gradientUnits="userSpaceOnUse" x1={g.x1} y1={g.y1} x2={g.x2} y2={g.y2}>
                <stop offset="0" stopColor={g.from} />
                <stop offset="1" stopColor={g.to} />
              </linearGradient>
            </defs>
            <polygon points={pts(p.poly)} fill={`url(#pg-${p.id})`} />
            {label}
          </svg>
        </motion.div>
        <motion.div
          className="petal__face petal__back"
          initial={false}
          animate={{ opacity: reduce ? (flipped ? 1 : 0) : 1 }}
          transition={transition}
          onAnimationComplete={() => reduce && !flipped && setSettling(false)}
        >
          <div className="petal__shadow">
            <div className="petal__clip" style={{ clipPath: clip }}>
              <Img
                id={`home/${p.id}-back`}
                alt={ALT[p.id]}
                sizes={`${((w / 1920) * 100).toFixed(1)}vw`}
                load={backsReady || flipped}
                loading="eager"
                fetchPriority="low"
                fill
              />
            </div>
          </div>
          <svg viewBox={`0 0 ${w} ${h}`} className="petal__back-label">
            {label}
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}
