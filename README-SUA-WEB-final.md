# Sửa web Khánh Chi's Portfolio — đợt 26/10 (tối)

Tài liệu giao việc cho agent (Claude Code). Chỉ có **3 mục** dưới đây. Mọi thứ khác giữ nguyên.

## 0. Quy tắc
- `git checkout main && git pull` rồi tạo nhánh `sua-26-10-b`. Mỗi mục 1 commit.
- Làm và kiểm trên máy (`npm run dev`). **Không push** cho tới khi chủ dự án duyệt.
- Kiểm ở **1440×900** và **375×812**. Trước khi báo xong: `npm run build` không lỗi.
- Không sửa câu chữ tiếng Anh.

---

## 1. Trang chủ — dòng tagline to hơn

Dòng `/a discoverer by curiosity, a water healer with care, a storyteller in frames, and a villager at heart/` (`.home__tagline` trong `src/pages/Home.css`, chữ trong `src/pages/Home.tsx`).

- Hiện `font-size: calc(var(--u) * 56)`, `line-height: calc(var(--u) * 57)` (≈ 21px ở màn 1440 — nhỏ hơn hẳn chữ "Khanh Chi" 80).
- Đổi thành khoảng **`--u * 70`**, `line-height` ≈ 1.2 (`--u * 84`). Giữ màu, giữ kiểu chữ thường (không nghiêng, không đậm).
- **Không được đè lên thuyền**: chữ to hơn → dòng dài và xuống thấp hơn, có thể chạm thuyền "Applied Science" (thuyền hồng tím ở giữa bên trái, buồm bắt đầu khoảng x≈900, y≈668 theo khung 3840). Nếu chạm thì **ngắt dòng lại thành dòng ngắn hơn** (đổi vị trí `<br />`), vd.:
  ```
  /a discoverer by curiosity,
  a water healer with care,
  a storyteller in frames,
  and a villager at heart/
  ```
  Không đổi chữ, không đổi dấu `/` ở đầu và cuối.
- Điện thoại (`@media (max-aspect-ratio: 1/1)`): tăng tương ứng, kiểm tra không tràn khỏi màn hình và không đè thuyền.
- Chụp ảnh trước/sau trang chủ ở 1440×900.

## 2. Applied Science › Community — cân ảnh với caption như mục Research

**Vấn đề hiện tại** (đo ở 1440px): 2 hàng "ảnh + chữ" đang chia 3 cột bằng `row` với `grow` → cột chữ hẹp (~28% bề ngang), chữ cao hơn ảnh nhiều, và vì căn đều (justify) nên có khoảng trắng lớn giữa các chữ ("webinar ␣␣␣ X-Interval, ␣␣␣ inviting"). Ảnh thì nhỏ.

**Mẫu cần theo: mục Research** (`entry` trong `content/applied-science.json`, CSS `.entry`, `.entry--left/right`): 2 cột — chữ một bên, ảnh một bên; ở 1440px cột chữ ≈ 485px, cột ảnh ≈ 275–290px; **chiều cao khối chữ ≈ chiều cao ảnh**, hai cột căn giữa theo chiều dọc; các bài xen kẽ trái/phải.

Áp dụng cho 2 hàng của Community:

| Hàng | Ảnh (giữ thứ tự) | Chữ | Vị trí |
|---|---|---|---|
| X-Interval | `community-7` (chụp webinar) + `community-8` (Certificate X-Interval) | "Beyond the experiments, … carry forward." | **ảnh bên trái, chữ bên phải** (như hiện tại) |
| Youth for Impact | `community-9` (Leadership with a Global Compass) + `community-10` (Certificate AIESEC) | "Whether in a workshop … villages I came from." | **chữ bên trái, ảnh bên phải** (như hiện tại) |

Yêu cầu:
- Mỗi hàng thành **2 cột**: cột chữ và **cột ảnh** (2 ảnh đặt cạnh nhau trong cột ảnh, cùng chiều cao). Có thể làm bằng khối mới (vd. `"media"` gồm 2 ảnh + `"text"` + `"side"`), hoặc mở rộng `entry` cho phép nhiều ảnh — chọn cách gọn nhất, không phá mục Research.
- Tỉ lệ cột: canh sao cho **chiều cao 2 ảnh ≈ chiều cao đoạn chữ (chênh ≤ 10%)** ở 1440px, cột chữ không hẹp hơn ~420px (để justify không bị hở). Gợi ý khởi điểm: cột chữ ~50%, cột ảnh ~50%, khoảng cách giữa 2 cột bằng mục Research.
- Ảnh không méo, không cắt mất chữ trên giấy chứng nhận (`object-fit: contain` nếu cần; ảnh webinar có thể `cover` nhưng không mất mặt diễn giả).
- Cỡ chữ, màu, giãn dòng của đoạn văn giống đoạn văn trong Research.
- Kiểm thêm ở 1280px và 1920px: vẫn cân. Điện thoại: ảnh lên trên (2 ảnh cạnh nhau hoặc xếp dọc), chữ xuống dưới, full width.
- Chụp ảnh trước/sau ở 1440px cả 2 hàng.

## 3. My Little Village › Youth For Community — nhúng video thay nút link

Trong `content/my-little-village.json`, ô `youth-for-community`, khối:
```json
{ "mt": 25, "button": { "text": "[YOUTH FOR COMMUNITY] Recap Video →", "href": "https://www.youtube.com/watch?v=kBUT5B0IGnI" } }
```
→ thay bằng video nhúng, **làm giống hệt cách đã làm ở Colors of FLSS / Aria Project** (`content/stage-and-screen.json`):
```json
{ "mt": 25, "video": { "poster": "my-little-village/yfc-video", "alt": "Video: tổng kết hoạt động Youth For Community", "draft": true, "youtube": "https://www.youtube.com/embed/kBUT5B0IGnI" }, "width": 637 },
{ "mt": 16, "variant": "caption", "text": "YOUTH FOR COMMUNITY" }
```
- Ảnh bìa: ảnh bìa chính thức YouTube (`maxresdefault`, nếu không có thì `hqdefault`) → `assets-src/my-little-village/yfc-video.jpg` → `npm run images`.
- Caption dưới video là đúng chữ **YOUTH FOR COMMUNITY** (không còn "[…] Recap Video →").
- Kiểm tra video phát được, nút cũ không còn.

---

## 4. Kiểm tra & báo cáo
- [ ] Tagline trang chủ to hơn, không đè thuyền (1440 & 375).
- [ ] Community: 2 hàng cân giữa ảnh và chữ như Research, không còn khoảng hở do justify.
- [ ] Youth For Community: video nhúng phát được, caption "YOUTH FOR COMMUNITY".
- [ ] `npm run build` OK, commit trên nhánh `sua-26-10-b`, chưa push.

Báo cáo ngắn vào `bao-cao-26-10-b/BAO-CAO.md` kèm ảnh trước/sau (trang chủ, 2 hàng Community, Youth For Community).
