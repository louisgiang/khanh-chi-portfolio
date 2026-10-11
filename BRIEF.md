
## 0. Tổng quan

- Website portfolio gồm **trang chủ hình bông hoa 5 cánh** và **5 trang thành phần**: My Journey, Applied Science, Craft Villages, Stage & Screen, My Little Village.
- Thiết kế: Ảnh chụp thiết kế nằm trong  từng thư mục. thư mục assets chứa các thư mục con, mỗi thư mục là 1 trang. Mỗi thư mục nhỏ gồm các ảnh thành phần và thư mục 'ref/' ảnh bố cục rộng để so sánh và lấy nội dung text
- Web có khoảng **50–60 ảnh**. Hai ưu tiên hàng đầu: **dung lượng ảnh nhỏ** và **mọi chuyển động (lật cánh hoa, chuyển trang, mở/thu nội dung) phải mượt**.
- Công nghệ: Vite + React + TypeScript, React Router, thư viện `motion` (motion.dev) cho chuyển động, `sharp` cho xử lý ảnh. CSS thuần hoặc CSS Modules. Không cần backend. `npm run build` ra thư mục tĩnh để đưa lên Vercel/Netlify.

## 1. Quy tắc cứng

1. **Nguồn dữ liệu chính:** `/ref/` (ảnh chụp thiết kế), `assets/` (ảnh gốc), `fonts/` (font chữ). Figma chỉ để tra thêm, **không chỉnh sửa file Figma**.
2. **Không đoán ảnh, không dùng ảnh tạm trong bản giao.** Thiếu ảnh hoặc chữ thì liệt kê và dừng.
4. **Chữ chép đúng nguyên văn** từ ảnh. Thấy lỗi chính tả rõ ràng thì **không tự sửa**, ghi vào `NOTES.md` để tôi quyết.
5. **Không bao giờ đưa ảnh gốc vào bản build.** Chỉ dùng ảnh đã qua bước tối ưu (mục 5).
6. **Làm theo từng chặng và dừng lại ở mỗi điểm dừng** (mục 9).
7. Mọi chỗ phải đoán hoặc tự quyết đều ghi vào `NOTES.md`.
8. Mỗi chặng được duyệt: commit git (và push nếu repo có remote).

## 2. Trang chủ: bông hoa 5 cánh

**Bố cục:** nền xanh nhạt; bên trái là bông hoa gồm ngôi sao 8 cánh viền vàng phía sau và 5 cánh hoa màu gradient phía trước; mũi tên cong và chữ "My Story"; bên phải là tiêu đề "Welcome to my Portoflio" (giữ nguyên chữ như thiết kế, xem quy tắc 4) và khối "Khanh Chi / a discoverer by curiosity, …".

**Hình dạng:** ngôi sao nền và 5 cánh hoa vẽ bằng **SVG** (có ảnh png từng phần, nên dựng lại theo `ref/` và ghi chú độ lệch). Không dùng ảnh PNG cho các hình này.

**Hover một cánh hoa → lật cánh đó:**

- Cánh xoay 3D quanh trục dọc của chính nó (rotateY 180°), khoảng 500ms, ease-in-out. Mặt trước: gradient + tên mục. Mặt sau: **ảnh tương ứng, cắt đúng theo hình cánh hoa** (dùng `clipPath` SVG cùng path với cánh), có thể kèm tên mục chữ trắng có bóng mờ để vẫn đọc được.
- Rời chuột thì lật lại.
- **Vùng nhận hover/click phải theo đúng hình cánh hoa**, không theo khung chữ nhật bao quanh, vì các cánh chồng lên nhau.
- Cánh đang lật nổi lên trên các cánh khác (z-index), có bóng nhẹ.
- Bàn phím: Tab tới cánh nào thì cánh đó lật (focus = hover); Enter để vào trang.
- Điện thoại (không có hover): **chạm lần 1 lật cánh, chạm lần 2 vào trang**. Chạm chỗ khác thì lật lại.
- `prefers-reduced-motion`: không xoay 3D, chỉ hiện dần ảnh (crossfade 200ms).

**Click một cánh → vào trang thành phần tương ứng** (hiệu ứng chuyển trang ở mục 6).

**Ảnh mặt sau 5 cánh phải sẵn sàng trước khi người xem hover:** sau khi trang chủ hiện xong, tải sẵn 5 ảnh này (bản nhỏ vừa kích thước cánh, xem mục 5). Không bao giờ để lật ra một mặt trắng.

## 3. Trang thành phần (5 trang, cùng một khuôn)

**Đầu trang:**
- Viên thuốc "Khánh Chi's Portfolio" giữa hai đường kẻ ngang: bấm vào thì về trang chủ.
- Thanh tab 5 mục: mục đang mở có nền xanh dương chữ trắng; mục khác chữ xanh dương. Bấm tab là chuyển trang. **Nền xanh của tab trượt sang mục mới** (không nhảy cóc).

**Thân trang:**
- Cột trái: tiêu đề trang lớn + đoạn giới thiệu (trang My Journey dùng chữ nghiêng như thiết kế).
- Cột phải: danh sách **ô dạng viên thuốc**: viền gradient vàng → hồng → đỏ, tên mục chữ gradient đỏ → cam, nền trắng mờ.

**Bấm một ô → mở rộng nội dung (như ảnh "Craft Villages" mở ra):**

- Ô biến đổi liền mạch thành **thẻ lớn**: bo góc từ viên thuốc thành góc tròn nhỏ hơn, nền chuyển sang gradient đỏ → cam, tên mục chuyển sang chữ trắng, chiều cao giãn ra để lộ nội dung (đoạn chữ xen kẽ ảnh, bố cục như thiết kế).
- Nội dung bên trong hiện dần và trượt nhẹ lên sau khi khung bắt đầu giãn (lệch khoảng 100ms).
- **Mỗi lúc chỉ mở một ô**: mở ô mới thì ô đang mở thu lại cùng lúc.
- Bấm lại tiêu đề của thẻ đang mở thì thu lại.
- Sau khi mở, nếu đầu thẻ bị khuất thì cuộn mượt để đầu thẻ nằm trong màn hình.
- Thời lượng: mở/thu khoảng 450–550ms, cùng một kiểu easing cho cả site.
- Ô có thể bấm bằng bàn phím (Enter/Space), có `aria-expanded`.
- Địa chỉ trang ghi lại ô đang mở (ví dụ `/applied-science#research`) để gửi link được; mở link đó thì ô tự mở sẵn.

> Lưu ý: ở trang My Journey, các ô mang tên các trang khác (Craft Villages, Applied Science…) nhưng **vẫn là ô mở rộng nội dung tại chỗ**, không phải link sang trang khác. Nếu nội dung trong `content/` cho thấy khác đi, dừng lại hỏi tôi.

## 4. Nội dung

- Mỗi trang một file trong `content/` (tôi cung cấp). Đề xuất cấu trúc dữ liệu (ví dụ `content/applied-science.json`: tiêu đề, đoạn giới thiệu, danh sách ô; mỗi ô gồm tên và danh sách khối nội dung theo thứ tự, mỗi khối là đoạn chữ hoặc ảnh) và **chuyển chữ tôi đưa sang cấu trúc đó, không sửa chữ**.
- Mỗi ảnh cần chữ mô tả (alt). Nếu tôi chưa cung cấp, viết bản nháp ngắn và đánh dấu để tôi duyệt.

## 5. Tối ưu ảnh (bắt buộc)

**Quy trình:** ảnh gốc đặt trong `assets-src/` (không vào bản build). Viết script `npm run images` dùng `sharp`:

1. Xoay đúng chiều theo EXIF rồi **xóa toàn bộ metadata** (EXIF, GPS: ảnh chụp điện thoại thường chứa vị trí chụp).
2. Tạo mỗi ảnh ở **nhiều chiều rộng** (ví dụ 480, 800, 1200, 1600px; không phóng to quá ảnh gốc) và **hai định dạng: AVIF và WebP**. Chất lượng khởi điểm: AVIF ~55, WebP ~75; chỉnh nếu thấy vỡ.
3. Tạo **ảnh mờ siêu nhỏ** (~20px, nhúng base64) hoặc màu chủ đạo để hiện trong lúc chờ tải.
4. Xuất file `manifest` ghi kích thước gốc, tỉ lệ khung, các bản đã tạo, để component ảnh tự dùng.
5. Chỉ xử lý lại ảnh mới hoặc ảnh đã đổi (không chạy lại toàn bộ mỗi lần).

**Hiển thị:**

- Một component ảnh dùng chung: `<picture>` với AVIF → WebP, `srcset` + `sizes` đúng kích thước hiển thị thực tế, `decoding="async"`.
- **Luôn giữ chỗ đúng tỉ lệ khung** (`width`/`height` hoặc `aspect-ratio`) để trang và thẻ đang mở không bị giật khi ảnh tải xong. Đây là điều kiện để hiệu ứng mở rộng mượt.
- Ảnh trong các ô thu gọn **không tải** cho đến khi người xem sắp mở: bắt đầu tải khi chuột di vào ô hoặc ô được focus; chạm trên điện thoại thì tải ngay lúc mở. Ảnh trong thẻ đang mở dưới màn hình dùng `loading="lazy"`.
- Ảnh mờ hiện trước, ảnh thật hiện dần đè lên khi tải xong.

**Ngân sách dung lượng (kiểm tra ở bước cuối, báo con số thực tế):**

- Lần tải đầu trang chủ (HTML + CSS + JS + font + ảnh) **dưới ~500KB**, không tính 5 ảnh mặt sau cánh hoa tải sẵn sau đó.
- Mỗi ảnh ở kích thước hiển thị trên máy tính **thường dưới ~150KB**; ảnh nào vượt 300KB phải báo.
- Báo tổng dung lượng `dist/`, 10 ảnh nặng nhất, và điểm Lighthouse (Performance) của trang chủ và một trang thành phần, cả máy tính lẫn điện thoại.

## 6. Chuyển trang và độ mượt

- **Trang chủ → trang thành phần:** trang chủ mờ dần và thu nhẹ, trang mới hiện dần và trượt nhẹ lên, tổng khoảng 400ms. Có thể dùng View Transitions API nếu trình duyệt hỗ trợ, nhưng phải có cách dự phòng chạy được trên mọi trình duyệt (ví dụ `AnimatePresence` của motion).
- **Giữa các tab:** đầu trang (viên thuốc + thanh tab) **đứng yên**, chỉ phần thân chuyển: nội dung cũ mờ đi, nội dung mới hiện ra, khoảng 300ms; nền xanh của tab trượt sang tab mới.
- **Tải trước:** di chuột vào một cánh hoa hoặc một tab thì tải sẵn code của trang đó và ảnh đầu tiên của nó, để bấm vào là chuyển ngay.
- Khi vào trang mới thì cuộn về đầu trang; nút Back quay lại đúng vị trí cuộn cũ.
- **Nguyên tắc mượt:**
  - Chuyển động chỉ dùng `transform` và `opacity`, trừ chiều cao của thẻ đang mở/thu (dùng cách đo chiều cao của motion hoặc kỹ thuật `grid-template-rows: 0fr → 1fr`, không dùng `max-height` cố định).
  - Không có chuyển động nào phải chờ ảnh tải.
  - Gom easing và thời lượng vào một file cấu hình chung.
  - Kiểm tra bằng Chrome DevTools, tab Performance, bật giảm tốc CPU 4x: lật cánh, chuyển trang, mở/thu thẻ không rơi khung hình rõ rệt. Báo kết quả.
- `prefers-reduced-motion`: thay mọi chuyển động bằng hiện dần ngắn hoặc chuyển tức thì.

## 7. Font

- Thiết kế dùng font sans-serif kiểu Helvetica. Xác định tên font chính xác (Figma hoặc hỏi tôi).
- Nếu là Helvetica Neue: font này có bản quyền, **không tự tải font về nhúng**. Dừng hỏi tôi: dùng font hệ thống (`"Helvetica Neue", Helvetica, Arial, sans-serif`, Windows sẽ hiện Arial) hay thay bằng font miễn phí gần giống trên Google Fonts.
- Font nhúng (nếu có) dùng `.woff2`, chỉ các độ đậm thực sự dùng, có tiếng Việt, `font-display: swap`.

## 8. Responsive

- Trên máy tính bám sát thiết kế (khổ 16:9).
- Điện thoại: bông hoa co lại vừa chiều ngang màn hình, khối chữ chuyển xuống dưới; thanh tab cuộn ngang được (tab đang mở luôn nằm trong tầm nhìn); cột trái và cột phải xếp chồng; thẻ mở rộng chiếm hết chiều ngang, ảnh và chữ trong thẻ xếp thành một cột.
- Đề xuất bố cục điện thoại và **dừng lại cho tôi duyệt** trước khi làm hết.

## 9. Thứ tự làm và điểm dừng

1. **Bước 1:** đọc `design-ref/`, `assets-src/`, `content/` (và Figma nếu cần). Báo: số ảnh đã có / còn thiếu theo từng trang và từng ô; ảnh mặt sau của 5 cánh hoa đã có chưa; font; chiều rộng thiết kế; chữ còn thiếu; lỗi chính tả thấy được → **dừng**
2. Script tối ưu ảnh (mục 5) chạy trên toàn bộ ảnh, báo dung lượng trước/sau → **dừng**
3. Trang chủ + hiệu ứng lật cánh hoa → **dừng**
4. Khuôn trang thành phần + thanh tab + chuyển trang + mở/thu thẻ, làm trên **một trang** (Applied Science) với nội dung thật → **dừng** cho tôi thử độ mượt
5. Bốn trang còn lại (báo sau mỗi trang, chỉ dừng nếu có điểm cần hỏi)
6. Bố cục điện thoại → **dừng**
7. Kiểm tra cuối: `npm run build` không lỗi; ngân sách dung lượng và Lighthouse (mục 5); kiểm tra độ mượt (mục 6); kiểm tra ở 1920, 1440, 1366, tablet, điện thoại; link có `#`, nút Back; cập nhật `NOTES.md`.
