import { useNavigate } from 'react-router';
import { Img } from '../components/Img';
import { prefetchSection, sectionPath, SECTIONS, type SectionId } from '../sections';
import './Home.css';

/** Ảnh nền 16:9 (mặt nước + 5 thuyền, không chữ). Mọi toạ độ dưới đây theo ảnh thiết kế 3840×2160
 *  (assets-src/home-new/home-ref.png). Chữ là chữ HTML/SVG thật, không nằm trong ảnh. */
export const HOME_IMAGE = 'home-new/home-background';
/** `sizes` của ảnh nền — khớp với bề rộng khung (xem Home.css) và với thẻ preload trong index.html. */
export const HOME_SIZES = '(max-aspect-ratio: 1/1) 178vh, 100vw';

type Boat = {
  id: SectionId;
  /** Vùng bấm: đường bao thân + buồm (đo từ ảnh), để hai thuyền gần nhau không chồng vùng bấm. */
  shape: string;
  /** Tên mục: tâm dòng chữ (x, y = đường chân chữ) và góc nghiêng theo thân thuyền (độ). */
  label: { x: number; y: number; angle: number };
};

// Thứ tự = thứ tự Tab bàn phím, theo thanh tab của trang con (My Journey → … → My Little Village).
// Toạ độ chữ đã so khớp với ảnh thiết kế (lệch < 1px ở khổ 3840).
const BOATS: Boat[] = [
  // Thứ tự câu chuyện (cũng là thứ tự phím Tab): My Journey → Applied Science → Craft Villages → Stage & Screen → My Little Village.
  { id: 'my-journey', shape: '223,1586 787,1371 1413,1613 1114,1908 480,1908', label: { x: 772, y: 1887, angle: 0.8 } }, // dưới trái, xanh lá
  { id: 'applied-science', shape: '611,983 1102,668 1713,902 1283,1263 1137,1283 826,1210', label: { x: 1068, y: 1111, angle: 1.2 } }, // giữa trái, hồng tím
  { id: 'craft-villages', shape: '1490,584 1908,323 2093,492 2423,472 2208,787 1651,795', label: { x: 1939, y: 660, angle: -4.5 } }, // trên giữa, xanh ngọc
  { id: 'stage-and-screen', shape: '2557,618 3080,296 3602,472 3487,829 2957,914 2834,872', label: { x: 3162, y: 818, angle: -4.25 } }, // trên phải, cam
  { id: 'my-little-village', shape: '2024,1321 2726,1056 3310,1298 3041,1820 2246,1724 2070,1417', label: { x: 2632, y: 1727, angle: 6 } }, // dưới phải, hồng
];

const titleOf = (id: SectionId) => SECTIONS.find((s) => s.id === id)!.title;

// Trang chủ tĩnh: không hiệu ứng vào trang, không hover — chỉ con trỏ tay trên thuyền và viền focus khi dùng bàn phím.
export default function Home() {
  const navigate = useNavigate();
  return (
    <main className="home">
      <div className="home__stage">
        <Img id={HOME_IMAGE} alt="" sizes={HOME_SIZES} loading="eager" fetchPriority="high" fill className="home__bg" />

        <nav className="home__nav" aria-label="Portfolio sections">
          <svg className="home__boats" viewBox="0 0 3840 2160">
            {BOATS.map((b) => (
              <a
                key={b.id}
                className="home__boat"
                href={sectionPath(b.id)}
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; // mở tab mới: để trình duyệt xử lý
                  e.preventDefault();
                  navigate(sectionPath(b.id));
                }}
                onPointerEnter={() => prefetchSection(b.id)}
                onFocus={() => prefetchSection(b.id)}
              >
                <polygon className="home__hit" points={b.shape} />
                <text
                  className="home__label"
                  x={b.label.x}
                  y={b.label.y}
                  transform={`rotate(${b.label.angle} ${b.label.x} ${b.label.y})`}
                  textAnchor="middle"
                >
                  {titleOf(b.id)}
                </text>
              </a>
            ))}
          </svg>
        </nav>

        <div className="home__intro">
          <h1 className="home__welcome">
            Welcome to
            <br />
            my Portfolio
          </h1>
          <p className="home__name">Khanh Chi</p>
          <p className="home__tagline">
            {/* Ngắt dòng ngắn để chữ không chạm buồm thuyền Applied Science */}
            /a discoverer by curiosity,
            <br />
            a water healer with care,
            <br />
            a storyteller in frames,
            <br />
            and a villager
            <br />
            at heart/
          </p>
        </div>
      </div>
    </main>
  );
}
