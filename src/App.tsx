import { lazy, Suspense, useState } from 'react';
import { createBrowserRouter, RouterProvider, ScrollRestoration, useLocation, useOutlet } from 'react-router';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import Home from './pages/Home';
import { Img } from './components/Img';
import { SECTIONS, loadSectionPage } from './sections';
import { DUR, EASE } from './motion';

const SectionPage = lazy(loadSectionPage);

/** Nền ảnh thuyền giấy (mờ) của các trang thành phần: một lớp cố định phủ kín màn hình, nằm ngoài lớp
 *  đang chuyển cảnh → không nháy màu nền khi đổi trang. (Không dùng background-attachment: fixed — hỏng trên iPhone.) */
function SectionBackground() {
  return (
    <div className="section-bg" aria-hidden="true">
      <Img id="home-new/background" alt="" sizes="(max-aspect-ratio: 1/1) 178vh, 100vw" loading="eager" fill />
    </div>
  );
}

// Trang chủ → trang thành phần: trang chủ tắt ngay (trang chủ không có hiệu ứng), trang mới hiện + trượt lên.
// Quay về trang chủ: trang thành phần mờ dần, trang chủ hiện ngay.
function RootLayout() {
  const location = useLocation();
  const outlet = useOutlet();
  const key = location.pathname === '/' ? 'home' : 'section';
  const half = DUR.page / 2;
  // Nền trang thành phần giữ đến khi trang thành phần mờ hẳn (lúc quay về trang chủ).
  const [sectionShown, setSectionShown] = useState(key === 'section');
  if (key === 'section' && !sectionShown) setSectionShown(true);
  return (
    <MotionConfig reducedMotion="user">
      <ScrollRestoration />
      {sectionShown && <SectionBackground />}
      <AnimatePresence mode="wait" initial={false} onExitComplete={() => setSectionShown(key === 'section')}>
        <motion.div
          key={key}
          initial={key === 'home' ? { opacity: 1 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, transition: { duration: key === 'home' ? 0 : half, ease: EASE } }}
          exit={key === 'home' ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, transition: { duration: half, ease: EASE } }}
        >
          <Suspense fallback={null}>{outlet}</Suspense>
        </motion.div>
      </AnimatePresence>
    </MotionConfig>
  );
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [{ index: true, element: <Home /> }, ...SECTIONS.map((s) => ({ path: s.path, element: <SectionPage /> }))],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
