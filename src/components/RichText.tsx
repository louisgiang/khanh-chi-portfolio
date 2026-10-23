import type { ReactNode } from 'react';
import { Link } from 'react-router';

/** Định dạng chữ trong nội dung (content/*.json), không dùng HTML thô:
 *  `***chữ***` → đậm + nghiêng, `**chữ**` → đậm, `*chữ*` → nghiêng,
 *  `[chữ](url)` → link (url bắt đầu bằng `/` hoặc `#` là link nội bộ, còn lại mở tab mới). */
const TOKEN = /\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*([^*\s][^*]*?)\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

function parse(s: string, key: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let n = 0;
  for (const m of s.matchAll(TOKEN)) {
    if (m.index > last) out.push(s.slice(last, m.index));
    const k = `${key}.${n++}`;
    const [, bi, b, i, linkText, href] = m;
    if (bi !== undefined)
      out.push(
        <strong key={k}>
          <em>{parse(bi, k)}</em>
        </strong>,
      );
    else if (b !== undefined) out.push(<strong key={k}>{parse(b, k)}</strong>);
    else if (i !== undefined) out.push(<em key={k}>{parse(i, k)}</em>);
    else if (/^[/#]/.test(href))
      out.push(
        <Link key={k} to={href} className="item__link">
          {parse(linkText, k)}
        </Link>,
      );
    else
      out.push(
        <a key={k} href={href} target="_blank" rel="noopener noreferrer" className="item__link">
          {parse(linkText, k)}
        </a>,
      );
    last = m.index + m[0].length;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}

export function RichText({ text }: { text?: string }) {
  if (!text) return null;
  return <>{parse(text, 'r')}</>;
}
