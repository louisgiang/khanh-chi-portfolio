import { useEffect, useState } from 'react';
import { Flower } from '../components/flower/Flower';
import './Home.css';

/** Sau khi trang chủ hiện xong (load + lúc rảnh) mới tải 5 ảnh mặt sau cánh hoa. */
function useBacksReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let idle = 0;
    const go = () => {
      const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
      idle = ric(() => setReady(true), { timeout: 1500 } as IdleRequestOptions);
    };
    if (document.readyState === 'complete') go();
    else window.addEventListener('load', go, { once: true });
    return () => {
      window.removeEventListener('load', go);
      (window.cancelIdleCallback ?? window.clearTimeout)(idle);
    };
  }, []);
  return ready;
}

export default function Home() {
  const backsReady = useBacksReady();
  return (
    <main className="home">
      <div className="home__stage">
        <nav className="home__flower" aria-label="Portfolio sections">
          <Flower backsReady={backsReady} />
        </nav>

        <svg className="home__arrow" viewBox="850 225 185 78" aria-hidden="true">
          <path d="M1029.5 268 C1004 225 903 207 863 287" fill="none" stroke="currentColor" strokeWidth="3.3" strokeLinecap="round" />
          <polygon points="854.5,298.5 853,284 868.5,291.5" fill="currentColor" />
        </svg>
        <p className="home__story">My Story</p>

        <h1 className="home__welcome">
          Welcome to
          <br />
          my Portfolio
        </h1>

        <h2 className="home__name">Khanh Chi</h2>
        <p className="home__tagline">
          /a discoverer by curiosity,
          <br />
          a water healer with care,
          <br />
          a storyteller in frames,
          <br />
          and a villager at heart/
        </p>
      </div>
    </main>
  );
}
