# Sửa web Khánh Chi's Portfolio — đợt 13/10

Tài liệu giao việc cho agent (Claude Code). Nguồn yêu cầu: Google Doc "sửa web portfolio - kchi" (bản 13/10) + nhận xét của mẹ Khánh Chi.

## 0. Quy tắc làm việc — đọc trước

- **Chỉ làm trên máy (local). KHÔNG `git push`, KHÔNG deploy.** Vercel tự build khi push, nên push = lên web thật. Chờ chủ dự án duyệt trên local rồi mới push.
- Tạo nhánh riêng: `git checkout -b sua-13-10`. Commit theo từng nhóm việc bên dưới (mỗi mục lớn 1 commit) để dễ xem lại và hoàn tác.
- Chạy local:
  ```bash
  npm ci
  npm run dev        # http://localhost:5173
  npm run build      # phải chạy được, không lỗi TypeScript
  npm run preview    # kiểm tra bản build
  ```
- Kiểm tra mỗi trang ở **2 khổ**: máy tính 1440×900 và điện thoại 375×812.
- **Chữ tiếng Anh trong tài liệu này là bản chốt → chép nguyên văn**, không tự sửa câu chữ. Chỗ nào ghi **(ĐỀ XUẤT — chờ duyệt)** là bản nháp mình viết, vẫn đưa vào nhưng liệt kê lại trong báo cáo cuối để Khánh Chi duyệt.
- Không đụng vào câu chữ của những đoạn không được nhắc trong tài liệu này.
- **Ảnh:** đọc `NOTES.md` (phần script ảnh) trước khi chạy `npm run images`. Chỉ chạy khi có ảnh mới trong `assets-src/`. Không xoá ảnh trong `public/img/`.
- Mục nào cần ảnh/link/số liệu mà chưa có → **không bịa, không để khung rỗng trên trang**. Ghi `TODO` trong code (comment hoặc trường `"$todo"` trong JSON) và đưa vào báo cáo cuối.
- Nội dung nằm trong `content/*.json`. Hiển thị: `src/components/section/Blocks.tsx`, `ItemList.tsx`, `src/pages/SectionPage.tsx`. Kiểu chữ: `src/components/section/section.css` (có phần riêng cho mobile khoảng dòng 610–745).

---

## 1. Nền tảng (làm trước, các mục sau dùng lại)

### 1.1 Lỗi 404 khi mở thẳng trang con
Hiện mở `/applied-science`, `/craft-villages`… trực tiếp (hoặc F5 ở trang con) → Vercel báo **404 NOT_FOUND**. Thêm `vercel.json` ở thư mục gốc:
```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```
Không kiểm được trên `npm run dev` (Vite tự xử lý) — chỉ cần thêm file, ghi vào báo cáo để kiểm sau khi deploy.

### 1.2 Định dạng chữ trong nội dung (inline markup)
Nhiều mục cần in nghiêng / in đậm / link **bên trong một câu**. Hiện các trường `text`, `note`, `caption`, `intro` là chuỗi thuần. Viết 1 hàm nhỏ (vd. `src/components/RichText.tsx`) hỗ trợ đúng 3 cú pháp, **không dùng `dangerouslySetInnerHTML`**:
- `*chữ*` → `<em>`
- `**chữ**` → `<strong>`
- `[chữ](url)` → `<a>`; url bắt đầu bằng `/` hoặc `#` là link nội bộ (dùng `Link` của react-router, không mở tab mới); url ngoài thì `target="_blank" rel="noopener noreferrer"`.

Áp dụng cho: `intro` (SectionPage), `text`, `note`, `caption.title`, `caption.text`, `entry.text`, chú thích trong marquee/gallery.

### 1.3 Link dạng [View here]
Quy tắc chung cho **mọi link bài báo, report, bài viết** (Research, Personal Product ở Applied Science, Personal Product ở Craft Villages, Internship):
- **Không** gắn link vào tên đề tài / tiêu đề.
- Xuống một dòng riêng **ở cuối khối**, hiển thị chữ **`[View here]`** (giữ cả dấu ngoặc vuông) là link.
- Tạo kiểu dữ liệu chung, vd. trường `"view": "https://…"` trên block/entry, render thành 1 dòng `[View here]` ở cuối. Bỏ cách dùng `href` trên `entry.title` và `link` dưới ảnh hiện tại.

### 1.4 Cỡ chữ, giãn dòng, căn đều
Mẹ nhận xét: caption nhỏ, dòng sát, chữ "thò thụt". Đo trên web hiện tại ở màn 1440px: caption dưới giải ≈ 11px, đoạn văn ≈ 15px, `line-height: 1`.

Trong `section.css` (số theo đơn vị thiết kế `--s`, 1920px):

| Class | Hiện tại | Đổi thành |
|---|---|---|
| `.item__text` | 20, line-height 1 | **24**, line-height **1.45** |
| `.item__note` | 16, line-height 1 | **20**, line-height **1.45** |
| `.item__note--box` | 16 | **19**, line-height 1.4 |
| `.item__caption` | 15, line-height 1 | **19**, line-height **1.35** |
| `.item__img-title` | 20 | **22** |
| `.entry__meta` | 25 | giữ |
| `.page__lead` | 20 | **22**, line-height 1.45 |

Mobile (media query): đoạn văn 15px → **17px**, caption/note 13px → **15px**, line-height như trên.

- Thêm `text-align: justify; hyphens: auto;` (và `lang="en"` cho vùng nội dung nếu chưa có) cho `.item__text`, `.item__note`, `.entry__text`, `.page__lead`. **Ngoại lệ giữ căn giữa:** `.item__text--title`, `.item__text--lead`, `.item__caption` (ô tên giải), tiêu đề gallery.
- Sau khi tăng cỡ chữ, kiểm tra không có ô nào bị tràn chữ / che ảnh, nhất là `.item__note--box` nằm đè lên ảnh.

### 1.5 Ảnh và caption không nằm cạnh nhau
Nhận xét chung: caption không để bên lề trái/phải ảnh mà để dòng riêng; ảnh để dòng riêng cho to. Rà tất cả `row` đang trộn `text` với `image` (tìm `"text"` nằm trong mảng `row`) và tách thành: **1 hàng ảnh** + **1 đoạn chữ bên dưới** (full width). Danh sách đã biết:
- `applied-science.json` → Community: hàng `community-7, community-8 + text` và hàng `text + community-9, community-10`.
- `craft-villages.json` → Pa Co: hàng `pa-co-6 + text` (align center).
Nếu thấy chỗ khác cùng kiểu → tách tương tự và ghi vào báo cáo.

---

## 2. Homepage và nền
**Chưa làm** — chờ thiết kế mới. Chỉ để TODO. Không sửa `src/pages/Home.*`, `src/components/flower/*`.

---

## 3. My Journey (`content/my-journey.json`)

1. **Bỏ in nghiêng đoạn mở đầu, chỉ in nghiêng chữ "cốm":** xoá `"introStyle": "italic"`; sửa `intro` thành:
   > I was born in the heart of Vong, the village of \*cốm\*, where every morning began with the rhythm of pestles pounding young green rice. My maternal hometown, Thuong Tin, rests beside the Red River; my paternal one is only a five-minute ride from Bat Trang Ceramic Village. Between them, I grew up wrapped in sounds, spices, and colors, never guessing that this was where my story with villages was quietly beginning.

   (`*cốm*` theo cú pháp mục 1.2.)
2. **Caption của My Journey giãn dòng rộng hơn các trang khác:** thêm class theo trang (vd. `.page--my-journey .item__text { line-height: 1.7; }`).

---

## 4. Applied Science (`content/applied-science.json`)

### 4.1 Achievements — dựng lại khối
Thứ tự mới:

1. Giữ đoạn mở đầu ("Honored with national and international…").
2. Tiêu đề (variant `heading`): **Polyaniline hydroxyapatite materials for environmental treatment**
3. Hàng 3 giải: `achievements-1` (iCAN Special Award), `achievements-2` (iCAN Silver), `achievements-3` (HIUF Great Special Award).
4. Tiêu đề (variant `heading`): **Rice husk-derived Activated Carbon for the Removal of Cu(II) and Pb(II) from Wastewater**
5. Hàng riêng: `achievements-4` (WICO Gold).
6. Caption chung cho 4 giải trên, **đặt sát ngay dưới** (mt nhỏ, ~12), và **cách xa** nhóm 4 giải cuối (mt nhóm sau ~56) để không bị lẫn:
   > These recognized materials were built for craft village wastewater – one removes methyl orange and methylene blue from the dyeing effluent of Pa Co Brocade Village, the other captures copper and lead from the lacquer wastewater of Ha Thai Village and the varnish wastewater of Ninh So Village. **(ĐỀ XUẤT — chờ duyệt)**
7. Hàng 4 giải còn lại: `achievements-5` (Vinschool), `-6` (ICPC), `-7` (IEO), `-8` (John Locke).

**Ô tên giải** (áp cho cả 8 giải):
- Dòng trên, căn giữa: loại giải. **Tất cả là `International`, riêng Vinschool Science & Innovation Challenge là `State`.** Thêm trường `"level"` vào `caption`.
- Dòng dưới: `Tên giải | Tên cuộc thi` trên **một dòng** (inline), vd.
  ```
                International
  Special Award | International Invention Innovation Competition in Canada
  ```
- Chữ to hơn (theo bảng mục 1.4).

**Ảnh giấy chứng nhận to và rõ hơn:** bỏ kiểu ép 4 ảnh/1 hàng. Hàng 3 giải đầu: 3 ảnh; WICO: 1 ảnh rộng vừa phải (≈ bằng 1 ảnh của hàng trên × 1.3, căn giữa); 4 giải cuối: chia **2 hàng × 2 ảnh**. Mobile: 1 ảnh/hàng.

### 4.2 Research
Mỗi bài: bỏ link trên tên đề tài, thêm `[View here]` ở cuối bài (mục 1.3).

| Bài | Link [View here] | Ghi chú |
|---|---|---|
| 1. Bioremediation of Polluted Waters using Microorganisms | **TODO** — chờ link bài của cô Nhung | "Đưa cả bài nghiên cứu vào": chờ file bài; khi có thì thêm các trang dạng `carousel` như bài 4 |
| 2. Green-Synthesized Ag-ZnO Nanoparticles… | `https://www.sciencedirect.com/science/article/pii/S2773207X26000151` | bỏ link ở `meta.href`, chuyển xuống [View here] |
| 3. Traffic-Aware Deep Reinforcement Learning… | **TODO** — chờ link bài của cô Hà | như bài 1 |
| 4. Why No Single Discount Rate Fits… | `https://drive.google.com/file/d/1QRc_7J5GdvGjlMEePiFRIwN48T-uWiqM/view` | bỏ `href` trên tiêu đề |
| 5. Building Cities That Can Breathe… | `https://drive.google.com/file/d/1rqRKzf3hnqYs82mbQc2ULhdzWW2fZ4Tp/view` | bỏ `href` trên tiêu đề; "đưa cả bài vào": TODO chờ ảnh các trang |

Nếu bài chưa có link thì **không hiện** dòng [View here].

### 4.3 Personal Product (hộp xử lý pin)
- Ảnh số 3 (`personal-product-3`, hình cái hộp): thêm câu vào cuối `note`:
  > The batteries collected in these units were later treated under the [Cleen Project](/my-little-village#cleen-project). **(ĐỀ XUẤT — chờ duyệt)**

  Link nội bộ phải mở đúng trang My Little Village và tự mở ô Cleen Project (kiểm tra hash `#cleen-project` có mở ô không; nếu không thì sửa `ItemList` để đọc hash khi vào trang).
- Video phần trình bày của Khánh Chi (cắt từ 3:30 đến hết) + `[View here]`: **TODO** — link trong tài liệu chỉ là `drive.google.com/drive/my-drive`, không phải link file. Chờ link thật. Nếu là YouTube thì dùng tham số `?start=210`.

### 4.4 Community
- Sửa caption X-Interval thành (nguyên văn):
  > Beyond the experiments, I set out to change how youngsters approach the environment, as a shared responsibility. I hosted webinar X-Interval, inviting speaker Loh Wai Lam from National University of Singapore, turning experts’ knowledge about carbon and the energy transition into conversations that anyone could join and carry forward.
- 3 ảnh **giấy chứng nhận X-Interval (`community-8`), Leadership with a Global Compass (`community-9`), giấy chứng nhận AIESEC (`community-10`)**: to ra, caption để dòng riêng (mục 1.5).

### 4.5 Internship — tách 3 nơi thực tập
Hiện ảnh + link + chữ của 2 lab và Red River đang trộn lẫn ("hầm bà làng"). Dựng lại:

0. Giữ nguyên đoạn mở đầu ("Alongside achievements and research, I ventured…").

**(1) Intern at Hanoi National University of Education – Nanotechnology Lab** (tiêu đề variant `subtitle`)

- **(1a) Tiêu đề phụ:** Worked with Prof. Dr. Quoc Trung Vu
  > Researched fish-scale-derived HAp/PANI nanocomposites using room-temperature green chemistry for textile dye removal; achieved superior adsorption, 50% lower cost than commercial activated carbon, and high reusability; won a Special Award at iCAN and HIUF. The material was then applied to treat wastewater in Pa Co Brocade Village.

  (Câu cuối dịch từ "Sau đó, ứng dụng trong xử lý nước thải tại Pa Co Brocade Village" — **ĐỀ XUẤT — chờ duyệt**.)
  - Ảnh: `internship-1`; video lab `internship-3` (YouTube `Zi3fMPmyXrU`) giữ như hiện tại.
  - Report: tên **FTIR Analysis of HAp-PANi Composite Report** + `[View here]` → `https://drive.google.com/file/d/1OZY34QlfvbtxTpRNWeCB-44AlPgieZAn/view?usp=sharing`

- **(1b) Tiêu đề phụ:** Worked with Dr. Minh Duc Tran
  > Developed rice-husk-derived activated carbon for sustainable Ni(II) wastewater treatment, achieving 80% removal under optimized Langmuir model conditions; won Gold at WICO and applied the method to treat bamboo/rattan weaving and lacquer painting wastewater in Ha Thai Lacquer and Ninh So Bamboo/Rattan Weaving Villages.

  ⚠ Ghi vào báo cáo: đoạn này ghi **Ni(II)** nhưng tên đề tài WICO ở Achievements ghi **Cu(II) và Pb(II)** — cần Khánh Chi xác nhận. Chép nguyên văn, không tự sửa.
  - Ảnh: `internship-2`, `internship-7` tạm thời; **TODO** thay bằng ảnh nhóm thầy Đức.
  - Report: tên **Results/Discussion Report of Chitosan-Modified Rice Husk Activated Carbon** + `[View here]` → `https://drive.google.com/file/d/1xi6BYpvQlV0xybVnYT0lxQ66il6QW4md/view?usp=sharing`

- Bỏ đoạn cũ "In collaboration with Prof. Dr. Quoc Trung Vu and Prof Minh Duc Tran at the HNUE…" (nội dung đã nằm trong 1a/1b, và có chữ "Thuong Tin’s craft villages" không còn đúng). Đoạn "Stepping into the chemistry lab at HNUE…" đặt dưới video lab.

**(2) Intern at Red River Recycling** (tiêu đề variant `subtitle`)
- Giữ nguyên: ảnh `internship-4`, `internship-5`, đoạn "As an intern at Red River Recycling…", video `internship-6` và caption.
- **TODO:** Certificate thực tập Red River (chờ ảnh).

(Tài liệu ghi "3 nơi": ở đây hiểu là 2 thầy ở lab ĐHSP + Red River. Ghi rõ cách hiểu này trong báo cáo.)

---

## 5. Craft Villages (`content/craft-villages.json`)

### 5.1 Personal Product (thuyền năng lượng mặt trời)
- Đổi link "Report" dưới ảnh `personal-product-1` thành dòng `Report` + `[View here]` → `https://drive.google.com/file/d/143r7EEeMPhhZX2vsxjmqXdAEMEJ_d9tO/view?usp=sharing`.
- Nội dung file report trên Drive (thêm Pà Cò, đổi Thường Tín → Ninh Sở, căn đều) là việc của chủ dự án — **ngoài phạm vi code**, chỉ ghi vào báo cáo.

### 5.2 Pa Co Brocade Village
1. **Video 2 không chạy:** `pa-co-video-2` đang có `"youtube": ""` → điền `https://www.youtube.com/embed/XjCz2YIwhzs`. Kiểm tra ảnh bìa có khớp video không; nếu không, lấy ảnh bìa YouTube (`maxresdefault`) như cách đã làm ở Internship (xem NOTES.md).
2. **Thay 3 ảnh mờ** `pa-co-3`, `pa-co-4`, `pa-co-5`: **TODO** chờ ảnh mới.
3. **Sửa câu "By evening…"** (không hợp lý vì nhuộm tự nhiên mất nhiều ngày). Thay câu cuối đoạn đó bằng:
   > By the end of those days, the gaps between my fingers were stained with the color of those roots. **(ĐỀ XUẤT — chờ duyệt)**
4. **Chuyển ảnh chú Huy:** bỏ `pa-co-gallery-6` (cùng `note` "Returning to the city, I met Mr. Huy…") khỏi marquee **Gallery: Patterns of the H'Mong**, đưa xuống mục **Gallery: Traditional Attire in Natural Color** (đặt ngay sau đoạn giới thiệu màu, trước hàng `pa-co-attire-*`), ảnh + caption dòng riêng.
   **TODO:** thêm ảnh cổ phục (ảnh buổi chụp, ảnh chú Huy gửi biểu diễn trên sân khấu, cảnh ngoài trời).
5. Tách hàng `pa-co-6 + text` thành ảnh dòng riêng + chữ dòng riêng (mục 1.5).

### 5.3 Đổi "Thuong Tin Villages" → tên theo 2 làng
Người nước ngoài đọc sẽ hiểu nhầm Thuong Tin là tên làng. Đổi `title` thành **Ha Thai & Ninh So Villages**. Đổi `id` thành `ha-thai-ninh-so-villages` và `grep -rn "thuong-tin-villages"` để sửa mọi chỗ tham chiếu (link, hash). Giữ nguyên tên file ảnh `thuong-tin-*`.

Đoạn mở đầu giữ nguyên (đã nói Ha Thai và Ninh So nằm trong Thuong Tin).

**Đoạn "Again, I zoom into the water…"** — không logic (một con sông vừa ô nhiễm sơn mài vừa ô nhiễm mây tre). Sửa thành:
> Again, I zoom into the water. It is hard to believe that the lacquer paintings and woven baskets on the shelves come from the same villages as these murky canals and ponds, and the sight gave me goosebumps. So I brought my solar-powered boat onto them, loaded with rice-husk activated carbon, to draw out what each craft leaves behind. **(ĐỀ XUẤT — chờ duyệt)**

Ảnh: giữ hàng 3 ảnh cũ (`thuong-tin-1/2/3`); **TODO** thêm 1 hàng 3 ảnh mới (thuyền ở mấy ao gần nhà anh Hải).

**1. Ha Thai Lacquer Village**
- Đưa **video phỏng vấn nghệ nhân** (`thuong-tin-video-1`) và caption của nó **lên trên** hàng 2 ảnh `thuong-tin-4`, `thuong-tin-5` (Khánh Chi chụp tranh sơn mài).
- **TODO:** video quay cảnh mài nước màu nâu; ảnh sơn mài (có trong Photography Portfolio — hỏi chủ dự án có dùng lại không).

**Gallery: Layers of Light** — in đậm + in nghiêng chữ Áo dài, kèm giải nghĩa:
- `thuong-tin-gallery-2`: "Women in áo dài, their faces…" → "Women in \*\*\*Áo dài\*\*\* (Vietnam's national dress), their faces…"
- Ảnh có note "Orange, white, blue, green, yellow: women in ao dai and conical hats…" → "…women in \*\*\*Áo dài\*\*\* (Vietnam's national dress) and conical hats…"

(`***chữ***` = đậm + nghiêng; nếu hàm ở mục 1.2 chưa hỗ trợ thì viết `**\*Áo dài\***`, miễn render ra `<strong><em>`.)

### 5.4 Xoi Tri Glass Village
**TODO:** ảnh tiền quyên góp cho Hội Bại não (đặt cạnh đoạn "…to support the Vietnam Cerebral Palsy Association").

---

## 6. My Little Village (`content/my-little-village.json`) — toàn bộ chờ tư liệu
- Youth For Community (Y4C): ghi cụ thể số đèn đã lắp, donate trẻ K… → **TODO** chờ số liệu từ CV.
- Business & Economic Simulation: thêm ảnh giải + poster ICPC → **TODO**.
- Cleen Project: thêm hoạt động xử lý pin → **TODO** (nhớ là đích của link ở mục 4.3).
- Mục mới Summer Programme (Brown: ảnh thẻ, ảnh lớp học, certificate…; Stanford: email trúng tuyển, ảnh thầy…) → **TODO**.
- Hoạt động từ thiện gắn với dự án (triển lãm tranh – Hội Bại não…) → **TODO** xem CV.
- Chủ đề Môi trường / bền vững chưa được nhắc rõ → để chủ dự án quyết định chỗ đặt, chỉ ghi vào báo cáo.

---

## 7. Kiểm tra trước khi báo xong
- [ ] `npm run build` không lỗi.
- [ ] Cả 5 trang, mở từng ô, ở 1440px và 375px: không tràn chữ, không ảnh vỡ, caption căn đều, ảnh và caption tách dòng.
- [ ] Mọi `[View here]` mở đúng link, tab mới. Không còn link nào nằm trên tên đề tài.
- [ ] Link Cleen Project (mục 4.3) mở đúng trang và đúng ô.
- [ ] Video Pa Co 2 phát được.
- [ ] My Journey: đoạn mở đầu không nghiêng, chỉ "cốm" nghiêng.
- [ ] Đổi tên mục Ha Thai & Ninh So: không còn link/hash cũ bị gãy.
- [ ] `git status` sạch, các commit nằm trên nhánh `sua-13-10`, **chưa push**.

## 8. Báo cáo cuối (gửi lại cho chủ dự án)
1. Danh sách việc đã làm (theo số mục).
2. Danh sách câu **ĐỀ XUẤT — chờ duyệt** (chép nguyên câu).
3. Danh sách **TODO** cần tư liệu: ảnh, link, số liệu — gom thành 1 checklist.
4. Điểm cần xác nhận: Ni(II) vs Cu(II)/Pb(II); cách hiểu "3 nơi Intern".
5. Ảnh chụp màn hình trước/sau của Achievements, Internship, Community (1440px).
