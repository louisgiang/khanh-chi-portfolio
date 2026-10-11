import { useEffect, useRef, useState, type CSSProperties } from 'react';
import manifest from '../generated/images.json';
import './Img.css';

type Variant = { w: number; src: string; bytes: number };
type Entry = {
  width: number;
  height: number;
  aspect: number;
  alpha: boolean;
  color: string;
  placeholder: string;
  avif: Variant[];
  webp: Variant[];
};
const IMAGES = manifest as Record<string, Entry>;

export const hasImage = (id: string) => id in IMAGES;
export const imageEntry = (id: string) => IMAGES[id];

const srcset = (v: Variant[]) => v.map((x) => `${x.src} ${x.w}w`).join(', ');

/** Tải sẵn ảnh (đúng biến thể trình duyệt sẽ chọn) mà không cần render. */
export function preloadImage(id: string, sizes: string) {
  const e = IMAGES[id];
  if (!e || typeof document === 'undefined') return;
  const key = `pl:${id}`;
  if (document.head.querySelector(`link[data-k="${CSS.escape(key)}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.type = 'image/avif';
  link.setAttribute('imagesrcset', srcset(e.avif));
  link.setAttribute('imagesizes', sizes);
  link.dataset.k = key;
  document.head.appendChild(link);
}

type Props = {
  id: string;
  alt: string;
  /** Giá trị `sizes` khớp kích thước hiển thị thực tế. */
  sizes: string;
  /** false = chưa được tải (chỉ hiện ảnh mờ). */
  load?: boolean;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  className?: string;
  style?: CSSProperties;
  /** Không giữ tỉ lệ khung (khi khung ngoài đã định kích thước). */
  fill?: boolean;
};

export function Img({ id, alt, sizes, load = true, loading = 'lazy', fetchPriority, className, style, fill }: Props) {
  const e = IMAGES[id];
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (load && ref.current?.complete && ref.current.naturalWidth > 0) setLoaded(true);
  }, [load]);

  if (!e) {
    if (import.meta.env.DEV) console.error(`[Img] thiếu ảnh trong manifest: ${id}`);
    return null;
  }

  const fallback = e.webp.find((v) => v.w >= 800) ?? e.webp.at(-1)!;
  return (
    <span
      className={`img${loaded ? ' is-loaded' : ''}${fill ? ' img--fill' : ''}${className ? ' ' + className : ''}`}
      style={{ aspectRatio: fill ? undefined : `${e.width} / ${e.height}`, ...style }}
    >
      <img className="img__ph" src={e.placeholder} alt="" aria-hidden="true" decoding="async" />
      {load && (
        <picture>
          <source type="image/avif" srcSet={srcset(e.avif)} sizes={sizes} />
          <source type="image/webp" srcSet={srcset(e.webp)} sizes={sizes} />
          <img
            ref={ref}
            className="img__main"
            src={fallback.src}
            alt={alt}
            width={e.width}
            height={e.height}
            loading={loading}
            decoding="async"
            fetchPriority={fetchPriority}
            onLoad={() => setLoaded(true)}
          />
        </picture>
      )}
    </span>
  );
}
