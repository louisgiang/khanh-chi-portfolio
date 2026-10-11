import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, ScrollRestoration, useLocation, useOutlet } from 'react-router';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import Home from './pages/Home';
import { SECTIONS, loadSectionPage } from './sections';
import { DUR, EASE } from './motion';

const SectionPage = lazy(loadSectionPage);

// Trang chủ → trang thành phần: cũ mờ + thu nhẹ, mới hiện + trượt lên (~400ms tổng).
// Quay về trang chủ: chỉ hiện dần, không trượt (trượt làm cả bông hoa trông như bị giật).
function RootLayout() {
  const location = useLocation();
  const outlet = useOutlet();
  const key = location.pathname === '/' ? 'home' : 'section';
  const half = DUR.page / 2;
  return (
    <MotionConfig reducedMotion="user">
      <ScrollRestoration />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={key}
          initial={key === 'home' ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: half, ease: EASE } }}
          exit={{ opacity: 0, scale: 0.97, transition: { duration: half, ease: EASE } }}
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
