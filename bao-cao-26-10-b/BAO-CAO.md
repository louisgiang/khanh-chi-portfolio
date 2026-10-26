# Báo cáo sửa web — đợt 26/10 (tối)

Nhánh `sua-26-10-b` (tạo từ `main` mới nhất), **chưa push**. Mỗi mục 1 commit. `npm run build` không lỗi.

## 1. Trang chủ — tagline to hơn ✅
- Cỡ chữ `--u * 56` → **`--u * 70`**, dòng `--u * 57` → **`--u * 84`** (1.2). Giữ màu, chữ thường.
- Chữ to hơn thì dòng 3 cũ ("storyteller in frames, and a") đè lên buồm thuyền Applied Science ở màn 1440×900 → ngắt lại thành dòng ngắn, **không đổi chữ, giữ `/` đầu và cuối**:
  ```
  /a discoverer by curiosity,
  a water healer with care,
  a storyteller in frames,
  and a villager
  at heart/
  ```
  Bản 4 dòng gợi ý trong README vẫn chạm sát mép buồm ở 1440×900 (dòng "and a villager at heart/" cách buồm ~9px). Lý do: màn 16:10 cắt mép ảnh nên khối chữ bị đẩy vào trong 16px. Vì vậy mình tách thêm 1 dòng.
- Kiểm bằng điểm ảnh thật của thuyền: mọi dòng cách thuyền ≥ 42 đơn vị (khung 3840) ở 1440×900; xa hơn nữa ở 1920×1080 và trên điện thoại.
- Điện thoại (375×812): chữ 26px, dòng dài nhất kết thúc ở 316px (< 375), không đè thuyền.
- Ảnh: `truoc-home-1440.jpg` / `sau-home-1440.jpg`, `truoc-home-375.jpg` / `sau-home-375.jpg`.

## 2. Applied Science › Community — 2 cột như Research ⚠ (1 hàng đạt, 1 hàng không đạt được)
- Thêm khối mới `split` (không đụng `entry` của Research). Khối có cột chữ và cột ảnh (các ảnh cạnh nhau, cao bằng nhau), căn giữa theo chiều dọc. Khoảng cách cột, cỡ chữ, màu, giãn dòng giống Research.
- Ở 1440px: cột chữ 419px (mức tối thiểu ~420 của README), cột ảnh 341px. Hai hàng xen kẽ: X-Interval ảnh trái, Youth for Impact ảnh phải.
- **Hàng X-Interval: đạt.** Ảnh webinar được cắt khung về ô của diễn giả **Loh Wai Lam** (README cho phép "cover, không mất mặt diễn giả"). Giấy chứng nhận giữ nguyên. Chiều cao ảnh / chữ = **1.00** ở 1280, 1440 và 1920px.
- **Hàng Youth for Impact: không đạt mức chênh ≤ 10%, ảnh chỉ cao ≈ 0.53 lần đoạn chữ.** Lý do là giới hạn hình học, không phải lỗi code. Hai ảnh đều nằm ngang (~1.5:1); đặt cạnh nhau trong cột ảnh thì tổng bề ngang rất lớn so với chiều cao. Với cột chữ ≥ 420px, chiều cao ảnh tối đa chỉ ~0.6 lần chữ, dù chia cột thế nào. Muốn đạt thì phải cắt giấy chứng nhận AIESEC (README cấm) hoặc cắt slide "Leadership with a Global Compass" (mất chữ trên slide). **Cần chủ dự án chọn hướng**, xem mục "Cần quyết định".
- Hai câu chữ giữ nguyên văn. Đoạn văn không còn khoảng hở lớn do căn đều (cột chữ rộng hơn trước: ~28% → ~54% bề ngang).
- Điện thoại: ảnh lên trên (xếp dọc, mỗi ảnh hết bề ngang, **không cắt** ảnh webinar), chữ xuống dưới. Không có cuộn ngang.
- Ảnh: `truoc-/sau-community-x-interval.jpg`, `truoc-/sau-community-youth-for-impact.jpg`.

## 3. My Little Village › Youth For Community — video nhúng ✅
- Bỏ nút "[YOUTH FOR COMMUNITY] Recap Video →". Thay bằng video `kBUT5B0IGnI`, rộng 637, đúng cách đã làm ở Colors of FLSS / Aria Project. Caption là **YOUTH FOR COMMUNITY**.
- Ảnh bìa: `maxresdefault` chính thức (1280×720), lưu ở `assets-src/My Little Village/yfc-video.jpg` (thư mục thật trên máy tên có chữ hoa, id ảnh vẫn là `my-little-village/yfc-video`) → `npm run images`. Manifest chỉ thêm đúng ảnh này.
- Đã bấm thử: nút play tải trình phát YouTube (`youtube-nocookie.com/embed/kBUT5B0IGnI`). YouTube xác nhận video cho phép nhúng.
- Ảnh: `truoc-/sau-youth-for-community.jpg`.

## Cần quyết định (Community, hàng Youth for Impact)
1. **Giữ như hiện tại:** 2 cột, ảnh nhỏ hơn chữ (~0.53), căn giữa theo chiều dọc.
2. **Cắt slide "Leadership with a Global Compass"** về phần tiêu đề + gạch đầu dòng bên trái: đạt khoảng 0.65, vẫn chưa tới mức chênh 10%, và mất phần "7 days / 17 goals / 1 mission".
3. **Hàng này để như bản gốc:** 2 ảnh cạnh nhau phủ hết bề ngang, đoạn chữ ở dòng dưới. Ảnh to, chữ không bị hẹp; chỉ hàng X-Interval theo kiểu 2 cột.

---

## Mục 2 — làm lại theo bố cục mới (bản v2, thay bản 2 cột ở trên)
- **Hàng 1 X-Interval:**
  - Ảnh webinar đứng một mình một hàng, hết bề ngang, đúng tỉ lệ gốc (bỏ `square`, không cắt).
  - Bên dưới là 2 cột: giấy chứng nhận bên trái, caption bên phải.
- **Hàng 2 Youth for Impact:** 2 cột, đoạn chữ bên trái; bên phải là Leadership (trên) và AIESEC (dưới) xếp chồng, cùng bề rộng.
- **Đo tỉ lệ cao ảnh / cao chữ:** đều đạt (≤ 10%).

  | Màn | Hàng 1 | Hàng 2 | Cột chữ |
  |---|---|---|---|
  | 1280px | 1.02 | 1.01 | 585–594px |
  | 1440px | 1.02 | 1.01 | 659–669px |
  | 1920px | 1.02 | 1.01 | 881–894px |

- **Hệ quả:** ảnh nhỏ. Vì đoạn chữ chỉ cao ~5 dòng khi cột chữ rộng, ảnh cũng phải thấp theo:
  - Giấy chứng nhận X-Interval rộng ~**100px** ở 1440.
  - Mỗi ảnh hàng 2 rộng ~**90px** ở 1440, chữ trên slide và giấy chứng nhận AIESEC gần như không đọc được.
  - Đây là giới hạn của yêu cầu "cao bằng nhau", không phải lỗi.
- **Điện thoại:** xếp dọc hết bề ngang, không cuộn ngang. Mình chọn **ảnh trước, chữ sau** cho cả 2 hàng: hàng 1 là webinar → giấy chứng nhận → caption; hàng 2 là Leadership → AIESEC → đoạn chữ. Cách này đọc giống hàng 1 và giống các mục khác.
- **Ảnh 1440px:** `sau-v2-community-x-interval.jpg`, `sau-v2-community-youth-for-impact.jpg` (ảnh trước: `truoc-community-*.jpg`).

---

## Mục 2 — bản v3 (theo mẫu Research, 2 ảnh cạnh nhau) — thay bản v2
- **Bố cục:** 2 cột như Research, căn giữa theo chiều dọc, xen kẽ.
  - Hàng X-Interval: ảnh trái (webinar giữ tỉ lệ gốc, **bỏ `square`**, không cắt + certificate), chữ phải.
  - Hàng Youth for Impact: chữ trái, ảnh phải (Leadership + AIESEC).
  - Ở 1440px: cột ảnh **380px**, cột chữ **380px**.
- **Bỏ ngắt chữ giữa từ:** đã xoá `hyphens: auto` (chỉ có 1 chỗ trong `section.css`), giữ `text-align: justify`.
  - Lưu ý: "X-Interval" vẫn có thể xuống dòng ngay sau dấu "-". Đó là dấu gạch thật trong chữ, không phải ngắt từ tự động. Muốn chặn thì phải đổi ký tự thành gạch nối không ngắt (U+2011), tức là đổi chữ, nên chưa làm.
- **Không đạt "chênh ≤ 10%":** cụm ảnh cao **0.62** (X-Interval) và **0.52** (Youth for Impact) lần đoạn chữ. Số này giống nhau ở 1280 / 1440 / 1920px.
  - **Đây là mức cao nhất có thể** khi giữ các điều kiện: 2 ảnh cạnh nhau, không cắt ảnh, cột chữ ≥ 360px.
  - Lý do: 2 ảnh đặt ngang thành một dải rất dẹt (webinar 2.1:1 + certificate 0.77:1; Leadership 1.5:1 + AIESEC 1.5:1). Nới cột ảnh thì cột chữ hẹp lại và đoạn chữ cao lên tương ứng, nên tỉ lệ không vượt quá ~0.62 / ~0.53 dù chia cột thế nào.
  - Muốn đạt ≤ 10%:
    - Hàng X-Interval: chỉ cần cho phép **cắt khung ảnh webinar** về ô diễn giả (như bản v1, đã đạt 1.00).
    - Hàng Youth for Impact: không có cách nào nếu không cắt giấy chứng nhận AIESEC.
- **Điện thoại (375px):** đặt cạnh nhau thì mỗi ảnh < 150px (certificate X-Interval ~80px, Leadership/AIESEC ~147px), nên theo quy tắc → **xếp dọc**, ảnh trên, chữ dưới, full ngang. Không cuộn ngang.
- **Ảnh 1440px:** trước `truoc-v3-community-*.jpg` (bản v2), sau `sau-v3-community-*.jpg`.

---

## Mục 2 — bản v4 (khung ảnh tự trượt, layout `entry` của Research) — thay các bản v1–v3
- **Đã gỡ khối `split`** (bố cục v1–v3) và phần cắt khung ảnh đi kèm, vì không còn chỗ nào dùng.
- **Mỗi hàng là một `entry`** như Research, không có title/meta.
  - Đã cho phép bỏ trống `title`/`meta`; không hiện dòng trống.
  - Khung ảnh là `carousel` rộng như cột carousel của Research (`--s * 397`).
  - X-Interval: khung trái (webinar → certificate). Youth for Impact: khung phải (Leadership → AIESEC). Chữ giữ nguyên, kiểu chữ giống Research.
- **Khung cố định tỉ lệ 1.38** (hơi dẹt hơn 4:3). Ảnh khác tỉ lệ thu vừa khung (`contain`), không cắt chữ trên giấy chứng nhận, không nhảy khung khi đổi ảnh.
- **Cân chiều cao khung / đoạn chữ: 1.00** ở cả 1280, 1440, 1920px (cả 2 hàng).
- **Tự trượt** (`"autoplay": true` trên entry, mặc định tắt → **Research bài 4 không đổi**, đã kiểm). Đã kiểm bằng Chrome headless:
  - Đổi ảnh mỗi 3.5 giây, trượt ngang, hết ảnh cuối thì tiến tiếp sang ảnh đầu (không tua ngược).
  - Dừng khi rê chuột / focus vào khung, khi khung không nằm trong màn hình, khi ô Community đóng.
  - Bấm ◀ ▶ vẫn chạy và đếm lại thời gian.
  - `prefers-reduced-motion: reduce` thì không tự chạy.
- **Nền phần trống trong khung:** mặc định `rgba(0,0,0,.15)` bo góc như ảnh khác. Ảnh chụp cả 2 kiểu:
  - `sau-v4-*-nen-toi.jpg` (nền tối nhẹ)
  - `sau-v4-*-trong-suot.jpg` (trong suốt)

  Đổi sang trong suốt chỉ cần sửa 1 dòng CSS (`.carousel.is-frame .carousel__viewport`).
- **Điện thoại (375px):** khung hết bề ngang phía trên, chữ bên dưới, vẫn tự trượt, không cuộn ngang (`sau-v4-community-375.jpg`).
- **`hyphens: auto` đã xoá** (từ bản v3), giữ `text-align: justify`. Trên điện thoại cột hẹp nên vài dòng căn đều có khoảng trắng rộng hơn.
- **Ảnh 1440px:**
  - Trước (bản v3): `truoc-v4-community-*.jpg`.
  - Sau: `sau-v4-{x-interval,youth-for-impact}-anh{1,2}-{nen-toi,trong-suot}.jpg`.

---

## Mục 2 — chỉnh v5 (chia đôi 50/50 + zoom ảnh webinar)
- **Chia đôi:** khung ảnh và đoạn chữ mỗi bên nửa bề ngang (ở 1440px: 380px / 380px).
- **Tỉ lệ khung chỉnh riêng từng hàng** để khung cao bằng đoạn chữ:
  - X-Interval: 1.61
  - Youth for Impact: 1.44

  Đo được 1.00 ở cả 1280, 1440, 1920px.
- **Ảnh webinar phóng ×1.18 trong khung** (trường `"zoom"`), để bớt khoảng hở trên/dưới:
  - Hai mép trái/phải bị cắt bớt ~9% mỗi bên; vẫn thấy mặt Cecilia S. Dewi, Loh Wai Lam và ô Nguyễn Minh Anh.
  - Phóng kín hẳn (cover) đã thử, nhưng cắt mất nửa mặt bà Cecilia nên không dùng.
- Giấy chứng nhận và slide không phóng (giữ đủ chữ).
- **Ảnh 1440px:** `sau-v5-{x-interval,youth-for-impact}-anh{1,2}.jpg`.
