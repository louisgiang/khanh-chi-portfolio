# Báo cáo sửa web — đợt 13/10

Nhánh `sua-13-10`, **chưa push**. Xem trên máy: `npm run dev` → http://localhost:5173

## 1. Việc đã làm (theo số mục trong README-SUA-WEB.md)

**1. Nền tảng**
- 1.1 Đã thêm `vercel.json`. Chỉ kiểm được sau khi deploy: mở thẳng `/applied-science`, F5 ở trang con.
- 1.2 Thêm `src/components/RichText.tsx`, không dùng `dangerouslySetInnerHTML`. Hỗ trợ `*nghiêng*`, `**đậm**`, `***đậm nghiêng***`, `[chữ](url)`. Link `/…` hoặc `#…` là link nội bộ (router), link ngoài mở tab mới. Đã áp cho intro, text, note, caption, entry, chú thích marquee và My Journey.
  - Font chỉ có Light Italic. Để chữ nghiêng giữ đúng độ đậm của đoạn văn, chữ nghiêng do trình duyệt tự tạo (họ font "Helvetica Neue Upright" trong `fonts.css`).
- 1.3 Thêm trường `view` (link) và `viewLabel` (tên report). Trường này dùng được trên entry, ô ảnh, hoặc làm một khối riêng. Mỗi link hiện thành dòng `[View here]` riêng ở cuối khối. Đã bỏ `href` trên tiêu đề, `meta.href` và `link` dưới ảnh.
- 1.4 Cỡ chữ và giãn dòng làm đúng theo bảng. Đo ở 1440px: đoạn văn ≈ 18px (trước ≈ 15px), caption ≈ 14px (trước ≈ 11px). Điện thoại: đoạn văn 17px, caption/note 15px. Đoạn văn căn đều hai bên, có `hyphens: auto`. Tiêu đề, lead, caption video và ô tên giải vẫn căn giữa. Trang đã có sẵn `lang="en"`.
- 1.5 Đã tách ảnh và chữ ở Community (2 hàng) và Pa Co (`pa-co-6`). Tìm thêm trong các trang khác: không còn hàng nào trộn chữ với ảnh.
- Sửa thêm:
  - Hàng chỉ có một ảnh dọc (WICO) không phủ hết bề ngang, do tổng flex-grow < 1.
  - Hàng ảnh có độ rộng riêng bị tràn khung trên điện thoại.
  - Băng ảnh Layers of Light và Cleen có ảnh dọc hẹp, chú thích chữ to bị dồn nhiều dòng. Đã đặt độ rộng chú thích tối thiểu (`minWidth`).

**2. Homepage và nền** (ảnh trong `assets-src/home-new/`, không phải `assets-src/home/home-boats.png` / `assets-src/backgrounds/` như README ghi)
- 2.1 Trang chủ thuyền giấy:
  - Ảnh `home-background.png` chỉ có mặt nước + thuyền, **không có chữ**. Vì vậy mình làm theo kiểu lai giữa 2 cách trong README: ảnh là nền; 5 vùng bấm là đa giác SVG theo đường bao từng thuyền (2 thuyền gần nhau không chồng vùng bấm); tên mục và chữ góc trái là chữ thật (HTML/SVG).
  - "my **Portfolio**" đã gõ đúng chính tả. Ảnh thiết kế `home-ref.png` ghi sai "Portoflio" nhưng không cần xin lại ảnh.
  - Cỡ chữ, vị trí, góc nghiêng đo từ `home-ref.png`. Đã so bằng Chrome headless ở 3840×2160: mọi dòng chữ lệch < 1px so với thiết kế.
  - Không hiệu ứng: không animation vào trang (kể cả ảnh không mờ dần), không hover; chỉ con trỏ tay và viền trắng khi focus bằng bàn phím. Thứ tự Tab theo thanh tab.
  - Đã xoá `src/components/flower/*`, `useBacksReady`, mũi tên "My Story". Ảnh mặt sau cánh hoa vẫn giữ trong `public/img` (không xoá ảnh).
  - Máy tính: ảnh phủ kín màn hình nhưng cắt tối đa 10% (5% mỗi bên). Màn 16:10 (1440×900) chữ góc trái được đẩy vào trong, 5 thuyền nguyên vẹn. Màn vuông hơn (iPad ngang 4:3) hoặc dài hơn (21:9): phần thiếu tô màu nước, không cắt mất thuyền.
  - Ảnh xuất 828/1280/1920. Bản 1920 AVIF 100KB (mục tiêu < 350KB). Được preload ngay trong `index.html`, chỉ khi mở trang chủ.
- 2.2 Nền trang con:
  - `background.png` là lớp mờ trong suốt ~30% (thiết kế đặt trên nền trắng). Script ảnh trộn sẵn lên trắng nên ảnh không cần alpha: bản 1920 AVIF chỉ 6KB. Không dùng CSS blur.
  - Lớp `position: fixed` nằm ở RootLayout, ngoài lớp chuyển cảnh. Nền giữ đến khi trang con mờ hẳn rồi mới đổi sang trang chủ, nên không nháy màu be. Đứng yên khi cuộn.
  - Viên thuốc đóng: chỉ còn viền gradient, lòng trong suốt (dùng mask). Thẻ mở giữ nền cam/hồng; nền này mờ dần khi thu lại.
  - Bỏ màu nền cứng trên body. Lý do: body có nền thì nó vẽ đè lên lớp ảnh. Màu chờ khi ảnh chưa tải là #C3EBFC (tông trung bình của ảnh). `theme-color` đổi thành #BBEFFF.
- Script ảnh: thêm nhóm `home-new`; bỏ qua `*-ref.png`. **Không còn tự xoá file "mồ côi" trong public/img** (trước đây xoá mất bản 1600px cố ý giữ). Muốn xoá thật: `npm run images -- --prune`.

**3. My Journey:** đoạn mở đầu bỏ in nghiêng, chỉ nghiêng chữ *cốm*. Giãn dòng trong các ô là 1.7.

**4. Applied Science**
- 4.1 Achievements đã dựng lại theo thứ tự trong README. Ô tên giải có dòng `International`/`State`, dòng dưới là `Tên giải | Tên cuộc thi`. Các ô tên giải cùng hàng cao bằng nhau. Bố cục ảnh:
  - Hàng 3 giải đầu.
  - WICO đứng riêng, rộng 320 đơn vị thiết kế.
  - 4 giải cuối chia 2 hàng × 2.
  - Điện thoại: 1 ảnh/hàng.
- 4.2 Research: bài 2, 4, 5 có `[View here]`. Bài 1 và 3 chưa có link nên không hiện dòng này.
- 4.3 Đã thêm câu Cleen Project kèm link nội bộ. Đã kiểm: bấm link mở trang My Little Village, ô Cleen Project tự mở và cuộn tới.
- 4.4 Caption X-Interval đã thay bằng câu mới. Các giấy chứng nhận nằm hàng riêng, chữ nằm dòng riêng.
- 4.5 Internship đã chia thành 3 phần: (1a) thầy Trung, (1b) thầy Đức, (2) Red River. Đã bỏ đoạn "In collaboration with…". Đoạn "Stepping into…" nằm dưới hàng ảnh + video lab. Mỗi report là tên report + `[View here]`.

**5. Craft Villages**
- 5.1 Personal Product: link report thành dòng `Report` + `[View here]`.
- 5.2 Pa Co:
  - Video 2 đã điền link XjCz2YIwhzs. Ảnh bìa cũ là ảnh chụp trình phát YouTube, nay thay bằng ảnh bìa chính thức `maxresdefault`. Đã kiểm qua oEmbed: video tồn tại và cho phép nhúng.
  - Đã sửa câu "By evening…".
  - Ảnh chú Huy chuyển xuống gallery Traditional Attire: ảnh một dòng, chữ một dòng.
  - Đã tách `pa-co-6`.
- 5.3 Đổi tên ô thành **Ha Thai & Ninh So Villages**, id `ha-thai-ninh-so-villages`. Đã grep: không còn chỗ nào dùng id cũ. Đoạn "Again, I zoom…" giữ nguyên bản gốc (chủ dự án chốt không đổi). Video phỏng vấn nghệ nhân đưa lên trên ảnh 4–5. cả cụm **_Áo dài (Vietnam's national dress)_** in đậm nghiêng, kèm giải nghĩa.

**7. Kiểm tra**
- `npm run build` không lỗi. Đã thử bản build bằng `npm run preview`.
- Mở tất cả các ô của cả 5 trang ở 1440px và 375px bằng script: trang không bị cuộn ngang, không có chữ hay ảnh tràn khung (sau khi sửa lỗi hàng ảnh tràn trên điện thoại).

## 2. Câu ĐỀ XUẤT — chờ duyệt
1. (Achievements) "These recognized materials were built for craft village wastewater – one removes methyl orange and methylene blue from the dyeing effluent of Pa Co Brocade Village, the other captures copper and lead from the lacquer wastewater of Ha Thai Village and the varnish wastewater of Ninh So Village."
2. (Personal Product, ảnh hộp) "The batteries collected in these units were later treated under the Cleen Project."
3. (Internship 1a, câu cuối) "The material was then applied to treat wastewater in Pa Co Brocade Village."
4. (Pa Co) "By the end of those days, the gaps between my fingers were stained with the color of those roots."

Trong JSON, các câu này có ghi chú `"$note"` để dễ tìm.

## 3. TODO — cần tư liệu
Mỗi mục có trường `"$todo"` trong `content/*.json`, trừ mục 6 (My Little Village).
- [ ] Research 1: link bài của cô Nhung, và file bài để đưa cả bài vào (dạng carousel).
- [ ] Research 3: link bài của cô Hà, và file bài.
- [ ] Research 5: ảnh các trang bài.
- [ ] Personal Product (Applied Science): link video phần trình bày (cắt từ 3:30). Link trong tài liệu chỉ là `drive.google.com/drive/my-drive`.
- [ ] Internship 1b: ảnh nhóm thầy Đức, thay `internship-2` và `internship-7` đang dùng tạm.
- [ ] Internship: certificate thực tập Red River.
- [ ] Pa Co: 3 ảnh thay cho ảnh mờ `pa-co-3/4/5`.
- [ ] Pa Co: ảnh cổ phục (buổi chụp, ảnh chú Huy biểu diễn trên sân khấu, cảnh ngoài trời).
- [ ] Ha Thai & Ninh So: 1 hàng 3 ảnh thuyền ở các ao gần nhà anh Hải.
- [ ] Ha Thai: video cảnh mài nước màu nâu. Ảnh sơn mài có trong Photography Portfolio: có dùng lại không?
- [ ] Xoi Tri: ảnh tiền quyên góp cho Hội Bại não.
- [ ] My Little Village (mục 6, chưa đụng):
  - Số đèn và số tiền donate của Y4C.
  - Ảnh giải và poster ICPC.
  - Hoạt động xử lý pin của Cleen.
  - Summer Programme (Brown, Stanford).
  - Hoạt động từ thiện (triển lãm tranh, Hội Bại não).
  - Chỗ đặt chủ đề Môi trường / bền vững.
- [ ] Trang chủ trên điện thoại: hiện ảnh ngang phủ chiều cao màn hình, vuốt ngang để thấy 5 thuyền (chữ chào co vừa màn hình). Cần ảnh thiết kế dọc riêng (`home-boats-mobile`, ~1080×1920), hoặc 5 thuyền PNG tách nền để xếp lại 2 cột như README đề xuất.
- [ ] Report thuyền năng lượng mặt trời trên Drive (thêm Pà Cò, đổi Thường Tín → Ninh Sở, căn đều): chủ dự án tự sửa trên Drive.

## 4. Cần xác nhận
- **Độ dễ đọc trên nền mới:** chữ tab menu xanh #3C88F8 trên nền xanh nhạt có độ tương phản ~2.8:1, hơi thấp (chuẩn cho chữ to là 3:1). Chữ cam của tên ô trên vùng thuyền hồng nhạt cũng hơi chìm. Chưa thêm lớp phủ trắng mỏng `rgba(255,255,255,0.35)` vì README dặn hỏi trước.
- **Ni(II) hay Cu(II)/Pb(II):** đoạn Internship 1b ghi Ni(II), nhưng tên đề tài WICO ở Achievements ghi Cu(II) và Pb(II). Đang chép nguyên văn cả hai.
- **"3 nơi Intern":** đang hiểu là 2 thầy ở lab ĐHSP (1a, 1b) + Red River.
- **Độ rộng ảnh WICO:** README ghi "≈ 1 ảnh hàng trên × 1.3". Hiểu theo chiều rộng thì ảnh quá to, nên đang để rộng 320 (cao ≈ bằng 4 giải bên dưới). Có thể đổi số `"width"` trong JSON.
- **Căn đều trên điện thoại:** cột chữ hẹp nên đôi chỗ khoảng trắng giữa các từ hơi rộng. Nếu thấy xấu, có thể chỉ căn đều từ tablet trở lên.

## 5. Ảnh trước / sau (1440px)
- Thư mục này: `truoc-*.jpg` (nhánh main) và `sau-*.jpg` (nhánh sua-13-10), cho Achievements, Community, Internship.
- Ảnh `sau-achievements.jpg` chụp bằng Chrome headless nên thiếu 3 ảnh (WICO, ICPC, John Locke): headless chưa tải xong ảnh lazy. Trên trình duyệt thật cả 8 ảnh đều hiện, đã kiểm.

## Ghi chú kỹ thuật
- Đã chạy `npm run images` một lần cho ảnh bìa video Pa Co 2. Script tự xoá các bản 1600px "mồ côi" của ảnh bìa video, mà commit 57e9025 đã cố ý giữ lại. Đã khôi phục bằng git. Lần sau chạy script sẽ lại xoá, cần kiểm `git status` sau mỗi lần chạy.
- `.claude/launch.json`: thêm cấu hình `preview` (cổng 4173).
