# Seed Data Files

Các file JSON này là dữ liệu mẫu cho backend:

- `users.json`: người dùng, bao gồm tài khoản admin và các user mẫu.
- `posts.json`: bài đăng với tiêu đề, nội dung, danh mục và liên kết đến `userId`.
- `postImages.json`: ảnh bài viết liên kết `postId`.
- `comments.json`: bình luận cho các bài, liên kết `postId` và `userId`.
- `clinics.json`: phòng khám thú y mẫu.
- `clinicImages.json`: ảnh phòng khám liên kết `clinicId`.
- `reviews.json`: đánh giá phòng khám liên kết `clinicId` và `userId`.
- `lostPets.json`: dữ liệu thú cưng bị lạc/có thể tìm thấy, liên kết `userId`.
- `lostPetImages.json`: ảnh cho các lost pet, liên kết `lostPetId`.

> Các file này chưa được tự động nạp vào database. Bạn có thể dùng script/import thủ công hoặc cập nhật backend để đọc JSON và ghi vào database khi khởi động.
