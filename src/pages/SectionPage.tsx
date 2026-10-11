// Tạm thời cho Bước 3 — khuôn trang thành phần làm ở Bước 4.
import { Link, useLocation } from 'react-router';
import { SECTIONS } from '../sections';

export default function SectionPage() {
  const { pathname } = useLocation();
  const s = SECTIONS.find((x) => x.path === pathname);
  return (
    <main style={{ padding: 48 }}>
      <Link to="/">← Khánh Chi's Portfolio</Link>
      <h1 style={{ fontSize: 64 }}>{s?.title}</h1>
      <p>(Trang thành phần — làm ở Bước 4)</p>
    </main>
  );
}
