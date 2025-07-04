# EDUCATION-KOTARO-AI

1. CSS cần kế thừa
assets/css/main.css
→ Đây là file CSS chính, chứa toàn bộ style, responsive, layout, icon, màu sắc, v.v.
assets/css/fontawesome-all.min.css
→ Được import trong main.css, dùng cho icon Font Awesome.
(Tùy chọn) assets/css/noscript.css
→ Dùng cho trường hợp trình duyệt không hỗ trợ JavaScript (nên thêm trong thẻ <noscript>).
Cách nhúng:
Apply to index.html


2. JS cần kế thừa
assets/js/jquery.min.js
→ Thư viện jQuery, bắt buộc cho các hiệu ứng động.
assets/js/jquery.scrolly.min.js
→ Hiệu ứng cuộn mượt.
assets/js/jquery.dropotron.min.js
→ Menu đa cấp.
assets/js/jquery.scrollex.min.js
→ Hiệu ứng khi cuộn tới section.
assets/js/browser.min.js
→ Phát hiện trình duyệt, thiết bị.
assets/js/breakpoints.min.js
→ Quản lý responsive breakpoint.
assets/js/util.js
→ Các hàm tiện ích.
assets/js/main.js
→ Script chính, khởi tạo hiệu ứng, menu, responsive, v.v.
Cách nhúng (nên để cuối trang, trước thẻ </body>):
Apply to index.html




3. Lưu ý khi kế thừa
Cấu trúc HTML: Nên giữ cấu trúc các class, id (ví dụ: .spotlight, .wrapper, #header, #footer, ...) để CSS/JS hoạt động đúng.
Icon: Nếu dùng icon Font Awesome, chỉ cần kế thừa main.css là đủ.
Responsive: Tự động hoạt động nếu bạn giữ đúng class/lưới như index.html.
