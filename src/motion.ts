// Thời lượng & easing dùng chung cho cả site (brief mục 6).
export const EASE_IN_OUT = [0.45, 0, 0.55, 1] as const; // lật cánh hoa
// Khởi đầu êm, tăng tốc vừa phải, hãm dài: trượt đều tay, không "bật" ra ở khung đầu.
export const EASE = [0.4, 0, 0.2, 1] as const; // mở/thu thẻ, chuyển trang

export const DUR = {
  flip: 0.5,
  flipReduced: 0.2,
  page: 0.4, // trang chủ ↔ trang thành phần (tổng)
  tab: 0.3, // giữa các tab
  expand: 0.55, // mở/thu thẻ (450–550ms)
  contentDelay: 0.1,
} as const;

// Đưa cùng easing/thời lượng sang CSS (transition của border-radius, nền, màu chữ).
export function applyMotionCssVars() {
  const r = document.documentElement.style;
  r.setProperty('--ease', `cubic-bezier(${EASE.join(',')})`);
  r.setProperty('--dur-expand', `${DUR.expand}s`);
}
