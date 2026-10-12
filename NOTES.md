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

## Bước 3 — Trang chủ + lật cánh hoa
- **Hình học đo tự động** (script tạm, không nằm trong repo): lấy đa giác 4 đỉnh từ alpha của từng PNG cánh/tia sao, dò vị trí trong ảnh ref (khớp màu cho cánh, khớp viền vàng cho tia sao), lấy màu gradient ở các đỉnh. Kết quả: `src/components/flower/geometry.ts`. Render SVG so với ref: lệch ≤ ~1px ở mép, chỉ khác ở khử răng cưa.
- Viền vàng tia sao #FFF551, dày 8.7px. Gradient mỗi cánh: 2 điểm dừng nối 2 đỉnh đối diện có màu khác nhau nhất (ước lượng; đoạn giữa có thể lệch nhẹ so với Figma).
- Thứ tự chồng cánh gần như không ảnh hưởng (chỗ chồng rất nhỏ). Thứ tự Tab theo thanh tab: My Journey → Applied Science → Craft Villages → Stage & Screen → My Little Village.
- Cỡ chữ đo từ độ rộng chữ trong ref: nhãn cánh Bold 35; "Welcome to / my Portfolio" & "Khanh Chi" Bold 65; "My Story" Bold 34; 4 dòng giới thiệu **Medium 43**. Màu xanh #3C88F8, chữ giới thiệu #2C2D2C. Vị trí chữ chỉnh theo baseline đo trên trình duyệt.
- Mũi tên "My Story": vẽ lại bằng 1 đường cong + đầu tam giác, lệch ≤1px so với ref.
- Mặt sau cánh: ảnh "- hover" (đã cắt sẵn) + CSS `clip-path: polygon()` cùng toạ độ với cánh (thay cho `<clipPath>` SVG vì cho phép dùng `<picture>` AVIF/WebP + srcset). Vùng hover/click là lớp SVG đa giác riêng nằm trên cùng.
- Mặt sau cánh: chỉ ảnh, không chèn chữ (anh/chị chốt).
- **Alt ảnh mặt sau: bản nháp, cần duyệt** (trong `Flower.tsx`, hằng `ALT`).
- Ảnh mặt sau tải sau sự kiện `load` + lúc rảnh, bản 420px (AVIF, tổng ~111KB). Nếu hover trước khi tải xong: hiện ảnh mờ, không bao giờ mặt trắng.
- Trang thành phần hiện là trang tạm để thử click (Bước 4 làm thật).
- Build thử: lần tải đầu trang chủ ≈ **179KB** (HTML + CSS + JS brotli 131KB + 2 font 47KB), chưa tính ảnh mặt sau.
- Quay về trang chủ: chỉ hiện dần (bỏ trượt lên 16px — gây cảm giác cả trang giật).

## Bước 4 — Khuôn trang thành phần (làm trên My Journey)
- Nội dung: `content/my-journey.json` (chép nguyên văn từ ref, giữ cả dấu "–" ở Applied Science và " - " ở Craft Villages, ngoặc kép thẳng). Câu đầu Stage & Screen **không có dấu chấm cuối** — giữ nguyên như thiết kế.
- **Alt ảnh trong thẻ: bản nháp** (`"draft": true` trong JSON) — cần duyệt.
- Số đo (khung 1920, co theo chiều rộng màn hình): kẻ ngang 2px, x 102–1818; viên "Khánh Chi's Portfolio" 273×46, Bold 20; tab Bold 32, cao 87, đệm ngang 40 (nền xanh #3C88F8); tiêu đề trang Bold 80; giới thiệu Light Italic 20 / dòng 24; ô viên thuốc 1138×116, cách nhau 25, viền 3px; tên ô Bold 50.
- Viền ô thu gọn: gradient ngang vàng #FFD952 → hồng #FFADA6 → vàng #FFD559 → cam #FEAA5C → đỏ #FC656B (đo từ ref). Nền "trắng mờ": giả lập bằng bóng đổ trong + vệt sáng đáy.
- Thẻ mở: nền #FC656B → #FFAE51 (theo ảnh thông số), **viền 3px #FC656B → #FFD952** (đo từ ref), bo góc 58 → 40, chữ Medium 20 / dòng 20, ảnh bo 20, khoảng cách khối 25, ảnh cùng hàng cách 20.
- So pixel (Chrome headless) với 5 ảnh ref: trùng gần khít, cả vị trí xuống dòng; lệch 1–2px ở vài chỗ.
- Chuyển động: chiều cao thẻ animate bằng motion (`height: auto`), nền/viền/màu chữ crossfade bằng opacity, bo góc bằng CSS transition — cùng easing/thời lượng trong `src/motion.ts`. Nội dung thẻ dựng sẵn (ẩn) để lúc bấm không phải dựng DOM.
- Đo trên bản build, Chrome headless, CPU giảm tốc 4x: đổi tab 0 khung rơi; mở/thu thẻ tối đa 1–2 khung ~50ms (lần mở đầu tiên), các lần sau ≤ 1 khung; lật cánh hoa 1–2 khung ~50–67ms lần đầu.
- Địa chỉ ghi ô đang mở (`/my-journey#craft-villages`), dùng `history.replaceState` (không tạo mục lịch sử, router không tự cuộn). Mở link có `#` → thẻ mở sẵn và cuộn tới.
- Trang chưa có nội dung (4 trang còn lại) hiện tiêu đề, chưa có ô — chờ nội dung.
- Thêm font Light Italic (18KB) cho đoạn giới thiệu My Journey.

## Sửa sau Bước 4 + trang Applied Science (Bước 5, trang 1/4)
- **Lỗi co trang khi mở/thu thẻ:** mở thẻ → trang dài ra → hiện thanh cuộn → bề ngang hẹp đi ~15px → mọi kích thước (co theo bề ngang) nhỏ lại. Sửa: `scrollbar-gutter: stable` (luôn chừa chỗ thanh cuộn). Đã kiểm: viên "Khánh Chi's Portfolio" giữ đúng kích thước khi mở/thu.
- Nội dung: `content/applied-science.json` (chép nguyên văn từ 6 ảnh ref). Cấu trúc khối mở rộng: chữ (thường / tiêu đề đậm căn giữa / tiêu đề phụ / chú thích), hàng ảnh (ảnh cao bằng nhau, có ô chú thích hoặc đoạn ghi chú dưới ảnh, có thể xen ô chữ), mục nghiên cứu (ảnh tài liệu + tiêu đề + "Published/Awarded" + đoạn văn, có link), băng chuyền 3 trang, khung video.
- **Giữ nguyên theo thiết kế (không sửa, chờ anh/chị quyết):**
  - "In conversation with Mr. Duc on how glass is collected, prepared, **crashed**, decorated…" — có lẽ là "crushed".
  - Dấu nháy lẫn lộn: "I've", "maker's" (nháy thẳng) bên cạnh "I’ve", "Tin’s", "experts’" (nháy cong).
  - "Foreign Language Specialize School" chỉ nằm trong ảnh, không phải chữ web.
- Link (anh/chị cung cấp): "Hybrid Advances (Elsevier) - Scopus Q1" → ScienceDirect; 2 tiêu đề bài luận gạch chân → Google Drive. Mở tab mới.
- **Video:** 2 khung Internship hiện ảnh chụp trình phát; khi có link YouTube, điền vào trường `"youtube"` trong JSON → tự hiện nút phát, bấm mới tải trình phát (youtube-nocookie). Hiện để trống.
- Băng chuyền Research 4: mũi tên ◀ ▶ (bấm được bằng bàn phím, có nhãn cho trình đọc màn hình, báo "Page x of 3"), trượt 400ms, vòng lại.
- Alt ảnh: bản nháp (`draft: true`), cần duyệt.
- Font thêm: Helvetica Neue Roman (giới thiệu trang, chú thích, chữ sau "Published:").
- So pixel 6 ref: khớp gần khít, kể cả vị trí xuống dòng. Viên thuốc: chỉnh lại bóng trong cho khớp ref (sai lệch màu trung bình 7.9 → 1.6).
- **Độ mượt (đo kỹ hơn):** máy này dùng GPU AMD Radeon tích hợp. Thẻ Applied Science dài 2000–3500px, lúc đầu GPU bận ~600ms/900ms khi mở thẻ (khung tới 56–78ms ở tốc độ thường). Nguyên nhân: 2 lớp nền gradient cao bằng cả thẻ đổi opacity → GPU vẽ lại mỗi khung. Sửa: nền viên thuốc chỉ cao 116px, nền đỏ cam luôn đục nằm dưới → khung chậm nhất còn 22–33ms. Thêm: chỉ thẻ đổi trạng thái mới render lại (React memo) — xử lý lúc bấm 30ms → 12ms (CPU 4x); nội dung thẻ chỉ dựng khi hover/focus/mở → chuyển tab sang Applied Science 211ms → 44ms (CPU 4x).
- Còn lại: lần bấm đầu (nếu không hover trước, ví dụ chạm trên điện thoại) phải dựng nội dung ngay lúc bấm → 1 khung chậm.
- Ngân sách ảnh Applied Science: ảnh nặng nhất ở kích thước hiển thị ~55KB (1x), ~120KB (2x). Không ảnh nào > 150KB.

## Làm mượt mở/thu viên thuốc (theo phản hồi "giật quá")
- Đo từng khung: khi mở ô B mà ô A phía trên đang mở, A thu lại làm B bị đẩy vọt ra khỏi màn hình (top 622 → −484px) rồi trang cuộn ngược lại → cú giật lớn nhất. Sửa: ghim đầu ô vừa bấm tại chỗ suốt lúc chuyển (cuộn bù trong cùng khung hình, tắt neo cuộn của trình duyệt khi đó).
- Thẻ dài (Applied Science tới 3500px): trước đây phần nhìn thấy lộ hết trong ~50ms đầu (trông như bật ra). Giờ chỉ animate chiều cao trong phạm vi màn hình (+40px), phần dưới màn hình đặt thẳng khi xong (đã kiểm: bước nhảy nằm dưới mép màn hình). Thu lại cũng vậy.
- Easing chung đổi sang cubic-bezier(0.4, 0, 0.2, 1), thời lượng mở/thu 550ms (vẫn trong khoảng 450–550ms của brief).
- Kết quả (tốc độ thường, máy này): khung chậm nhất khi mở 22–44ms, 1–4 khung > 20ms mỗi lần mở.
- Font: repo có 4 file woff2 Helvetica Neue (Light Italic, Roman, Medium, Bold — chỉ ký tự Latin + tiếng Việt) trong `src/assets/fonts/`; file gốc .otf/.ttf chỉ giữ trên máy (`fonts/` không đưa lên git). Chạy `npm run fonts` để tạo lại woff2 từ file gốc.

## Craft Villages (Bước 5, trang 2/4) — 2026-10-12
- Nội dung: `content/craft-villages.json`. Chữ chép nguyên văn từ 6 ảnh ref; chú thích ảnh 3–6 của "Gallery: Patterns of the H'Mong" do anh/chị gửi trong chat. Tiêu đề trang theo ref: **"Crafted Villages"** (tab vẫn là "Craft Villages").
- Ảnh gốc anh/chị gửi tên "Personal Product 5…20" nhưng **đều thuộc ô Pa Co Brocade Village** → đổi tên trong `assets-src/craft-villages/` (pa-co-1…6, pa-co-video-1…3, pa-co-gallery-1…6, pa-co-attire-1…3, pa-co-workshop-1…3). Thứ tự gallery: 14, 14-1, 14-2 (cô gái), 14-3 (măng đắng), 14-4 (mặt trời đỏ), 14-5 (anh Huy).
- Ô Personal Product: dùng ảnh gốc `Personal Product 1–4.png` (anh/chị bổ sung; bản cắt tạm từ ref đã bỏ).
- Khối mới: băng ảnh trượt ngang tự động (`marquee`): dãy ảnh lặp 2 lần, CSS `translateX` chạy vòng (chỉ transform → mượt), tốc độ 45 đơn vị thiết kế/giây; chỉ chạy khi thẻ mở, dừng khi rê chuột/focus; `prefers-reduced-motion` → đứng yên, cuộn tay. Ảnh cao 316, cách 10. Ảnh dọc hẹp (cô gái H'Mong) đặt trong khung rộng tối thiểu 420 (`minWidth`, chỉ gallery H'Mong) để ô chú thích không quá dài (tự quyết).
- Khối mới: đường kẻ ngăn (`divider`), tiêu đề mục căn giữa Bold 30 (`variant: "title"`), ô chú thích có khung (`box: true`).
- Chú thích có khung: dùng Helvetica Neue Roman 16 (ref Personal Product trông như Light, nhưng không có font Light thẳng — chỉ có Light Italic).
- 3 khung video (pa-co-video-1…3) là ảnh chụp trình phát YouTube như ref; khi có link thì điền `"youtube"`.
- Alt ảnh: bản nháp (`draft: true`), cần duyệt.
- **Script ảnh:** `assets-src/` không có trong git nên máy mới chỉ có ảnh gốc của vài trang; trước đây chạy `npm run images` sẽ **xoá ảnh đã tối ưu của các trang khác**. Đã sửa: trang không có thư mục gốc trên máy → giữ nguyên ảnh + manifest cũ.
- Ngân sách ảnh: ở kích thước hiển thị (1x) ảnh nặng nhất ~110KB AVIF; không ảnh nào > 150KB. JS chính tăng ~37KB (manifest ảnh có ảnh mờ base64).

### Thuong Tin Villages (2026-10-12)
- Chữ chép nguyên văn từ `Home - Crafted Villages (3).png`; chú thích ảnh hộp sơn mài và rối nước của gallery do anh/chị gửi.
- Ảnh: `Thuong Tin Villages 1–12` → `thuong-tin-1…9`, `thuong-tin-video-1/2` (ảnh 6, 8), gallery theo thứ tự ảnh anh/chị gửi kèm: 7-3 (hộp), 7 (áo dài), 7-1 (Chùa Một Cột), 7-2 (tượng nón lá), 7-4 (rối nước).
- Chú thích ảnh áo dài (7) và tượng nón lá (7-2): anh/chị gửi bản đầy đủ (ref bị cắt mép). Giữ nguyên "áo dài" (có dấu) ở ảnh 7 và "ao dai" (không dấu) ở ảnh 7-2 như anh/chị gửi.
- Câu "Above all, let my gallery guide you through the works." Bold 25 căn giữa (`variant: "lead"`, đo từ ref).
- Băng ảnh: chú thích rộng bằng ảnh như ref (không đặt `minWidth`).
- Video "Làng Hạ Thái" / "Làng Ninh Sở" rộng 619 như ref; chưa có link YouTube.
- Ảnh gốc trong thư mục `Crafted Villages/` chỉ được sao chép sang `assets-src/`, không sửa/đổi tên file gốc.

### Xoi Tri Glass Village (2026-10-12)
- Chữ chép nguyên văn từ `Home - Crafted Villages (4).png`; 6 chú thích gallery "Vietnam in Splendor" do anh/chị gửi.
- Ảnh: `Xoi Tri Glass Village 1–11` → `xoi-tri-1…11` (ảnh 11 = bàn triển lãm, nằm trong hàng ảnh thứ 4). Gallery theo thứ tự chú thích: `11-1` (vách đá), `11 -1` (thiếu nữ áo đỏ — tên file có dấu cách, khác `11-1`), `11-2`, `11-3`, `11-4`, `11-5`.
- Gallery: ảnh cao 493, cách 10, chú thích rộng bằng ảnh (đúng ref). Tiêu đề gallery 2 dòng (xuống dòng theo ref).
- So vị trí với ref: lệch ≤ 6px.

### Photography Portfolio (2026-10-12)
- Ảnh: `Photography Portfolio.png` (bìa) → `photography-1`; `2.png … 14.png` → `photography-2…14` (các trang photobook, chữ in sẵn trong ảnh).
- Trình chiếu (anh/chị chốt): bìa là trang 1, **tự lật mỗi 3 giây**, không có mũi tên. Luôn trượt cùng chiều (sau trang 14 là bản sao bìa, tới đó nhảy thầm về bìa). Chỉ chạy khi khung hiện trong màn hình (thẻ mở); dừng khi rê chuột / focus; phím ←/→ vẫn lật được; số trang "1 / 14" góc dưới phải. Giảm chuyển động: đổi trang tức thì.
- Chỉ tải trang đang xem + trang kế tiếp (bìa tải sẵn khi hover ô).
- Đã đo thời gian thật bằng Chrome headless (DevTools Protocol): lật đều ~3s/trang, nối vòng liền, rê chuột thì dừng.
- Kích thước khớp ref (ảnh 1053 rộng, thẻ cao ~730).
- **Ngân sách ảnh:** ở 1920px trình duyệt chọn bản 1200px: 148–314KB AVIF (ảnh có hạt nhiễu kiểu film + chữ nhỏ nên khó nén). **`photography-14` = 314KB > 300KB.** Bìa 99KB. Chỉ tải khi lật tới gần nên không ảnh hưởng lần tải đầu. Nếu cần nhẹ hơn: hạ chất lượng AVIF riêng cho nhóm ảnh này (chữ nhỏ có thể nhoè) — chờ anh/chị quyết.
