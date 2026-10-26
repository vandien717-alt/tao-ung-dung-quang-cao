# AI Quảng Cáo Việt

Web app viết quảng cáo tiếng Việt, ưu tiên điện thoại Android.

## Cấu trúc
- `index.html`: toàn bộ giao diện và chế độ demo (không cần mạng, không cần API).
- `api/generate.js`: tùy chọn, chỉ để bật AI thật. API key nằm ở máy chủ.

## Việc bạn cần làm
1. Mở `index.html`, tìm dòng `var SO_ZALO = "";` và điền số Zalo, ví dụ `"0901234567"`.

## Chạy thử trên máy
Cách nhanh nhất: bấm đúp `index.html` để mở trong Chrome. Chế độ demo chạy ngay.
(Nút sao chép có thể kém ổn định khi mở bằng file. Dùng địa chỉ https sẽ chắc chắn hơn, xem phần triển khai.)

## Triển khai miễn phí
**Chỉ chạy demo (đơn giản nhất): Cloudflare Pages, Netlify hoặc GitHub Pages**
- Netlify: vào app.netlify.com/drop, kéo thả thư mục dự án. Có link https ngay.
- Cloudflare Pages / GitHub Pages: tải thư mục lên GitHub, kết nối, để trống lệnh build, thư mục gốc là `/`.

**Bật AI thật: Vercel (gói Hobby miễn phí cho dự án cá nhân)**
1. Đưa thư mục lên GitHub, import vào vercel.com.
2. Settings → Environment Variables → thêm `GEMINI_API_KEY` (key lấy từ Google AI Studio; không dán key vào file nào).
3. Deploy lại. Trên web sẽ hiện nhãn "Đang dùng AI thật".

Lưu ý: Gemini có hạn mức miễn phí nhưng giới hạn lượt và có thể thay đổi; vượt hạn mức hoặc bật thanh toán thì tính phí. Hãy kiểm tra trong Google AI Studio. Gói miễn phí của Vercel/Netlify chỉ là phần lưu trữ web.

## Kiểm thử trên Android (Chrome)
- [ ] Mở trang, các chữ đọc được không cần phóng to.
- [ ] Bấm "Điền mẫu demo" rồi "Tạo quảng cáo" ra đủ: tiêu đề, nội dung, lời kêu gọi, hashtag.
- [ ] "Tạo lại" cho ra nội dung khác.
- [ ] "Sao chép bài viết" rồi dán vào Zalo/Facebook thấy đúng nội dung.
- [ ] "Xóa form" xóa sạch.
- [ ] Để trống ô sản phẩm, bấm tạo: hiện thông báo nhắc nhập.
- [ ] Thử mỗi phong cách và mỗi nền tảng.
- [ ] Tab "Ý tưởng thiết kế" có poster mẫu, bảng màu, bố cục.
- [ ] Nút Zalo: khi chưa điền số thì báo chưa cấu hình; điền số thì mở Zalo.
- [ ] Xoay ngang màn hình vẫn dùng được.

## Chưa làm / hạn chế
- Chưa có đăng nhập, thanh toán, cơ sở dữ liệu, lưu lịch sử bài.
- Chế độ demo dùng mẫu câu có sẵn, không phải AI. Nội dung đơn giản, cần người dùng đọc lại.
- Hàm AI thật (`api/generate.js`) chưa được chạy thử với API key thật. Hãy thử trước khi công bố.
- Giới hạn lượt gọi chỉ là bộ đếm trong bộ nhớ, chống lạm dụng ở mức cơ bản.
- Poster chỉ là gợi ý bố cục, chưa xuất ra ảnh.
