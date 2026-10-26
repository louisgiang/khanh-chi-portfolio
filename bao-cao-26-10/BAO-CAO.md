# Báo cáo sửa web — đợt 26/10

Nhánh `sua-26-10` (tách từ `main` @ `aa62a50`), mỗi mục 1 commit. **Chưa push** — chờ chủ dự án duyệt.
Kiểm tra trên máy: `npm run dev` (http://localhost:5173), `npm run build` không lỗi, `npm run preview` (http://localhost:4173) xem lại cả 5 trang ở 1440×900 và 375×812: không trang nào tràn ngang, không ảnh nào lỗi.

Ảnh chụp trước/sau ở 1440px nằm cùng thư mục (`truoc-*.jpg`, `sau-*.jpg`; thêm `sau-*-375.jpg` cho điện thoại).

## 1. Việc đã làm

| Mục | Việc | Ảnh |
|---|---|---|
| 1. Trang chủ | Đổi `id` thuyền theo thứ tự câu chuyện, giữ nguyên ảnh nền, `shape`, toạ độ và góc chữ. Mảng `BOATS` sắp lại theo thứ tự My Journey → Applied Science → Craft Villages → Stage & Screen → My Little Village (= thứ tự phím Tab). Đã kiểm: 5 tên đều nằm trọn trong thân thuyền, bấm đúng trang. | `truoc-trang-chu.jpg`, `sau-trang-chu.jpg`, `sau-trang-chu-375.jpg` |
| 2. Achievements | Chữ tên giải 19 → **24**, dòng International/State **22** (giữ in đậm vừa); điện thoại 15 → **17px**, dòng cấp giải 16px. JSON không đổi. | `truoc-achievements.jpg`, `sau-achievements.jpg` |
| 3. Internship | Xoá 2 tiêu đề "Worked with…", 2 đoạn chi tiết, 2 hàng ảnh và 2 dòng view riêng. Thêm **1 dải ảnh chạy 4 phần tử**: `internship-1` + FTIR report [View here], `internship-2` + Results/Discussion report [View here], `internship-7` (không caption), video `internship-3` (YouTube Zi3fMPmyXrU). Mở rộng `MarqueeBlock` + `Blocks.tsx` cho phép video trong dải: dải **dừng khi video đang phát** (và khi rê chuột/focus); bản sao lặp chỉ có ảnh bìa, link trong bản sao `tabIndex=-1`. Phần Red River giữ nguyên. | `truoc-internship.jpg`, `sau-internship.jpg` |
| 4. Community | Trả về 2 hàng như bản 12/10: `[webinar community-7][giấy chứng nhận community-8][caption mới]` và `[Whether in a workshop…][community-9][community-10]`. Caption chép nguyên văn từ tài liệu. | `truoc-community.jpg`, `sau-community.jpg` |
| 5. Pa Co | 5.1: 3 ảnh mới thay `pa-co-3/4/5` (ảnh cũ chuyển sang `assets-src/craft-villages/_cu/`), xoá `$todo`. 5.2: gallery cổ phục sắp lại: tiêu đề → ảnh chú Huy + "Returning to the city…" → 3 ảnh cổ phục → "These vibrant colors…" (khớp nguyên văn). `mt`: tiêu đề→ảnh 30, ảnh→chữ 17, chữ→3 ảnh 28, 3 ảnh→đoạn màu 17. | `truoc-pa-co.jpg`, `sau-pa-co.jpg` |
| 6. Stage & Screen | 2 nút "[Sắc Màu CNN]…" và "[Aria Project]…" → 2 khung video (ảnh bìa YouTube **maxresdefault** 1280×720, bấm để phát), rộng 637 như video Internship. Chữ trên nút cũ giữ làm caption nhỏ dưới video; alt tiếng Việt mới (bản nháp). Hai nút CEC Oscar không thuộc mục này → giữ nguyên. | — |
| 7. Cleen Project | Thay đoạn mở đầu (khớp nguyên văn). | — |
| 8. Summer Programs | Ô mới **đầu tiên** của My Little Village (`#summer-programs` mở sẵn được, đóng/mở như các ô khác): caption tổng → **Summer@Brown** → dải ảnh chạy 5 ảnh + bảng điểm (1 ảnh/hàng, rộng 760 cho đọc được) → caption Brown → **Stanford Pre-Collegiate Summer Institutes** → thư trúng tuyển (1 ảnh/hàng, rộng 860) → hàng 2 ảnh (slide nhóm, lớp học online) → caption Stanford. Các ô khác không có ảnh bìa/mặt sau → không thêm. | `truoc-my-little-village.jpg`, `sau-summer-programs.jpg`, `sau-summer-programs-375.jpg` |

Ngoài 8 mục, sửa nhỏ `scripts/images.mjs` (commit riêng, không đổi ảnh nào):
- Bỏ qua thư mục bắt đầu bằng `_` (`_moi-26-10`, `_cu`) để ảnh chờ xếp / ảnh cũ cất đi không bị xuất bản.
- Cache ảnh trên máy này cũ hơn git ở 6 ảnh bìa video (đã được thay ở máy khác). Trước đây chạy `npm run images` sẽ **ghi đè ngược** 6 ảnh đó về bản cũ; giờ script giữ bản trong git. Đã chạy thử trước khi làm: 172/172 ảnh không đổi.

**Ảnh:** chỉ thêm ảnh mới (66 file) và thay đúng 3 ảnh mờ Pa Co theo mục 5 (18 file `pa-co-3/4/5-*` được ghi đè, bản cũ vẫn trong lịch sử git và ảnh gốc ở `_cu/`). Không xoá file nào trong `public/img/`. Không sửa/đổi tên file trong `assets-src/_moi-26-10/` (chỉ sao chép). Ảnh mới lớn nhất 181KB (< 400KB).

## 2. Chỗ phải tự quyết

1. **Caption video Internship:** câu "Stepping into the chemistry lab at HNUE…" (2 câu) vừa với chiều ngang video trong dải (~570px ở 1440) → đặt làm caption dưới video, bỏ đoạn văn riêng.
2. **Chia ảnh Brown/Stanford:** ảnh đã chia sẵn thư mục, nội dung khớp (logo, thẻ Brown, bảng điểm Brown; thư Stanford, slide wetlands, lớp online Stanford) → không có ảnh nào phải để lại.
3. **Che thông tin cá nhân — Brown/3 (thẻ sinh viên):** thẻ có Banner ID, Brown ID, mã vạch, số thẻ và hạn thẻ → đã **làm mờ các số này** trên bản sao (`summer-brown-3`); giữ tên, ảnh, chữ "BROWN Summer Student". File gốc không sửa. Thư Stanford không có mã hồ sơ / email / số điện thoại → không che. Bảng điểm Brown chỉ có tên + điểm → không che.
4. **Ảnh lớp học online Stanford (`summer-stanford-3`):** có mặt nhiều bạn học khác (giống các ảnh tập thể khác trên web). Nếu muốn tránh đưa mặt người khác lên, báo để bỏ hoặc làm mờ.
5. **Bố cục Brown:** 6 ảnh → 5 ảnh chụp vào dải chạy, bảng điểm tách riêng 1 hàng cho đủ to để đọc.
6. **Trang chủ:** không phải chỉnh vị trí/cỡ chữ thuyền nào — cả 5 tên đều nằm trong thân thuyền mới. Trang con không có màu nào theo thuyền (chỉ có ảnh nền thuyền giấy mờ) → không có gì để báo.
7. **Pa Co ảnh 3 mới:** cảnh thứ 3 là băm củ/rễ trên thớt (không phải "cho lá vào thùng nước") → cập nhật `alt` cho đúng ảnh.

## 3. Cần chủ dự án xem / TODO

- **Achievements ở 1440px:** chữ to hơn làm một số ô tên giải dài hơn 3 dòng (đếm cả dòng International/State): Silver Medal 8, Special Prize 8, Very High Commendation 7, Gold Award (ICPC) 6, Special Award 5, Gold Medal 5, Great Special Award 4, Bronze Award 3 (cỡ cũ: 2–6 dòng). Không ô nào bị cắt/tràn. Ảnh: `sau-achievements.jpg`. Nếu thấy dài: có thể giảm còn ~22 hoặc nới rộng ô hẹp.
- **Community ở 1440px:** caption X-Interval (dài hơn bản gốc) cao ~284px so với ảnh ~166px dù tăng `grow`: chữ càng rộng thì ảnh càng nhỏ, không có giá trị nào làm chữ thấp hơn ảnh (thử grow 1.71 → 7: chữ 284 → 155, ảnh 166 → 77). Giữ `grow: 1.71` như bản gốc (ảnh đủ to, chữ chạy dài hơn ảnh). Hàng Leadership/AIESEC cũng vậy (đã như thế từ bản gốc). Cần quyết: giữ, hay rút gọn chữ / chuyển caption xuống dưới hàng ảnh.
- Các `$todo` cũ không thuộc đợt này vẫn còn (vd. ảnh cổ phục thêm, certificate Red River).

## 4. Điểm chờ xác nhận từ đợt trước

- **Ni(II)** ở đoạn Internship ("rice-husk activated carbon for Ni(II) removal") vs **Cu(II)/Pb(II)** ở tên đề tài WICO trong Achievements ("Rice husk-derived Activated Carbon for the Removal of Cu(II) and Pb(II) from Wastewater") — vẫn chép nguyên văn cả hai, chờ Khánh Chi xác nhận.
