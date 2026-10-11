# NOTES

## Bước 1 — Kiểm kê (2026-10-11)

### Thông số chung
- Khổ thiết kế: **1920px** (ref xuất @4x = 7680px). Trang chủ 1920×1080 (16:9).
- Màu nền toàn site: **#F5FFF0** (anh/chị chốt trong chat).
- Thẻ mở rộng: nền **linear-gradient trái → phải #FC656B (0%) → #FFAE51 (100%)** (theo ảnh thông số anh/chị gửi).
- Không có thư mục `design-ref/`; ảnh bố cục nằm trong `assets-src/<trang>/ref/` → dùng chỗ đó.
- `content/` đang **trống** → chữ hiện chỉ chép được từ ảnh ref.

### Ảnh theo trang
| Trang | Ref | Ảnh có | Thiếu |
|---|---|---|---|
| Trang chủ | 1 | 5 cánh (mặt trước, có chữ), 5 mặt sau "- hover", 5 mảnh ngôi sao (Group 11–15), arrow | — |
| My Journey | 5 | Applied Science 1–2, Stage & Screen 1–3, My Little Village 1–3 | **Craft Villages: 2 ảnh** (ảnh bờ sông, ảnh xưởng sơn mài) |
| Applied Science | 0 | 0 | toàn bộ: ref, chữ, ảnh |
| Craft Villages | 0 | 0 | toàn bộ |
| Stage & Screen | 0 | 0 | toàn bộ |
| My Little Village | 0 | 0 | toàn bộ |

- **Ảnh mặt sau 5 cánh hoa: có đủ**, nhưng là PNG **đã cắt sẵn theo hình cánh** (nền trong suốt), không phải ảnh gốc chưa cắt. Kế hoạch: dùng chúng làm ảnh mặt sau + vẫn bọc `clipPath` SVG cùng path cánh (an toàn nếu lệch vài px).
- Ảnh trong My Journey là bản xuất Figma (PNG, **góc bo đã "nướng" sẵn**, nền trong suốt). Kế hoạch: cắt bỏ alpha khi tối ưu? — không cắt được vì góc bo là alpha; sẽ giữ alpha trong AVIF/WebP (vẫn nhẹ) và bo góc bằng CSS cho chắc.
- Ref bị **đặt tên lệch**: `My Journey-Craft Villages.png` thực ra là ô Applied Science đang mở; `-Applied Science` = Stage & Screen mở; `-My Little Village` = Craft Villages mở; `-Stage & Screen` = My Little Village mở. Tôi đọc theo nội dung ảnh, không theo tên file.

### Font
- `fonts/`: Helvetica Neue Thin / Light / Roman / Medium / Bold (.otf), đủ dấu tiếng Việt, cờ fsType cho phép nhúng.
- File COPYRIGHT ghi bản quyền Linotype — **bản quyền webfont cần anh/chị xác nhận** (xem câu hỏi).
- **Thiếu bản Italic** — đoạn giới thiệu My Journey là chữ nghiêng (Light/Roman Italic). Nếu không có, trình duyệt sẽ tự nghiêng giả (faux italic).

### Chữ / chính tả (không tự sửa)
- "Welcome to my **Portoflio**" (trang chủ) — giữ nguyên theo brief.
- "Thuong Tin", "Bat Trang", "Vong" viết không dấu, trong khi "cốm" và "Khánh Chi's Portfolio" có dấu — giữ nguyên.
- Trang chủ ghi "Khanh Chi" (không dấu), header ghi "Khánh Chi" — giữ nguyên.
- Đoạn giới thiệu My Journey xuống dòng khác nhau giữa ref "base" và các ref mở rộng → chỉ do độ rộng khung, chữ giống nhau.

### Bố cục ô ở My Journey (theo ref)
- Craft Villages: chữ trái + ảnh phải / ảnh trái + chữ phải (so le).
- Applied Science: 2 ảnh ngang hàng, chữ dưới.
- Stage & Screen: chữ trên, 3 ảnh dọc ngang hàng, chữ dưới.
- My Little Village: 2 ảnh ngang hàng, 1 ảnh rộng, chữ dưới.
- Thứ tự ô trên trang: Craft Villages, Applied Science, Stage & Screen, My Little Village (là ô mở tại chỗ, không phải link).

### Quyết định sau Bước 1 (anh/chị trả lời 2026-10-11)
- Trang mẫu ở Bước 4: dùng **My Journey** (các trang khác chờ nội dung).
- "Portoflio" → **"Portfolio"**. Tên có dấu / không dấu giữ đúng theo thiết kế.
- Font Helvetica Neue: anh/chị xác nhận có license; đã bổ sung các bản Italic (.ttf).
- Git: chỉ commit local, push khi anh/chị báo.

## Bước 2 — Tối ưu ảnh
- `npm run images` → `scripts/images.mjs` (sharp). Ra `public/img/**` + `src/generated/images.json`.
- Bỏ qua: mọi thư mục `ref/`; ở `home/` chỉ lấy ảnh `- hover` (mặt sau cánh). Cánh mặt trước, mảnh ngôi sao, mũi tên dựng lại bằng SVG nên không đưa PNG vào build.
- Chiều rộng: 480/800/1200/1600 (không phóng to; thêm bản gốc nếu gốc < 1600 và lệch > 200px). Ảnh mặt sau cánh hoa: 420/840.
- AVIF q55, WebP q75. Metadata bị xóa (đã kiểm: không còn EXIF/ICC/XMP). Ảnh mờ 20px base64 + màu chủ đạo.
- Cache theo hash SHA-1 nội dung trong `.image-cache.json`; chạy lại khi không đổi: 0.1s. Tự xóa output mồ côi.
- Mọi ảnh My Journey là PNG có **alpha (góc bo sẵn)** → giữ alpha trong AVIF/WebP; CSS vẫn bo góc.
- `assets-src/` không commit (nặng ~100MB); `public/img/` **có** commit để deploy không cần ảnh gốc.
