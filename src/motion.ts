// Thời lượng & easing dùng chung cho cả site (brief mục 6).
export const EASE_IN_OUT = [0.45, 0, 0.55, 1] as const; // lật cánh hoa
export const EASE = [0.32, 0.72, 0, 1] as const; // mở/thu thẻ, chuyển trang

export const DUR = {
  flip: 0.5,
  flipReduced: 0.2,
  page: 0.4, // trang chủ ↔ trang thành phần (tổng)
  tab: 0.3, // giữa các tab
  expand: 0.5, // mở/thu thẻ (450–550ms)
  contentDelay: 0.1,
} as const;
