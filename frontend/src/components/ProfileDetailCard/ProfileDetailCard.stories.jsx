import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import ProfileDetailCard from './ProfileDetailCard';

// ================= MOCK DATA BÀI VIẾT =================
const MOCK_API_POSTS = [
  {
    id: "post_1",
    username: "Nguyễn Gia Huy",
    avatarUrl: "https://i.pravatar.cc/150?img=11",
    content: "Hôm nay dẫn Mochi đi dạo, bé vui lắm chạy nhảy tung tăng khắp nơi! 🐶🐾",
    images: ["https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=600&auto=format&fit=crop"],
    commentsCount: 24,
    timestamp: "2 giờ trước"
  },
  {
    id: "post_2",
    username: "Nguyễn Gia Huy",
    avatarUrl: "https://i.pravatar.cc/150?img=11",
    content: "Các sen cho mình hỏi thời tiết dạo này ẩm ương, cún nhà mình hay bị bỏ ăn thì nên đổi loại hạt nào nhỉ? 🥺",
    images: [],
    commentsCount: 12,
    timestamp: "Hôm qua"
  },
  {
    id: "post_3",
    username: "Nguyễn Gia Huy",
    avatarUrl: "https://i.pravatar.cc/150?img=11",
    content: "Góc tự hào: Mochi vừa học được lệnh bắt tay và xoay vòng! 🥰",
    images: ["https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600&auto=format&fit=crop"],
    commentsCount: 56,
    timestamp: "3 ngày trước"
  }
];

// ================= CẤU HÌNH STORYBOOK =================
export default {
  title: 'Components/ProfileDetailCard',
  component: ProfileDetailCard,
  parameters: {
    layout: 'centered', // Hiển thị ra giữa màn hình
  },
  decorators: [
    (Story) => (
      // Bọc Router để chống lỗi nếu PostCard có dùng thẻ Link
      <MemoryRouter>
        {/* Set chiều rộng cố định và màu nền tối nhẹ để làm nổi bật Card màu trắng */}
        <div style={{ width: '100%', minWidth: '600px', backgroundColor: '#f9fafb', padding: '40px 20px' }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
};

// ================= CÁC TRẠNG THÁI (STORIES) =================

// Trạng thái 1: Đầy đủ thông tin và có bài viết (Test Infinite Scroll)
export const FullProfileWithPosts = {
  args: {
    username: "Nguyễn Gia Huy",
    avatarUrl: "https://i.pravatar.cc/150?img=11",
    email: "giahuy.petlover@example.com",
    bio: "Yêu động vật, đặc biệt là Corgi và Poodle. Thường xuyên chia sẻ kinh nghiệm nuôi dạy cún cưng.",
    mockApiPosts: MOCK_API_POSTS
  },
};

// Trạng thái 2: Profile mới tạo, chưa có bài viết nào
export const EmptyPosts = {
  args: {
    username: "Hoàng Mochi",
    avatarUrl: "https://i.pravatar.cc/150?img=32",
    email: "mochi.hoang@example.com",
    bio: "Thành viên mới gia nhập Blossom Community! Rất vui được làm quen với mọi người.",
    mockApiPosts: [] // Truyền mảng rỗng để test UI trạng thái "Chưa có bài đăng"
  },
};

// Trạng thái 3: Người dùng không có ảnh đại diện (Test Avatar fallback) và không có bio
export const WithoutAvatarAndBio = {
  args: {
    username: "Lê Văn Sen",
    avatarUrl: "", // Sẽ tự động lấy chữ 'L' làm avatar
    email: "sen.le99@example.com",
    bio: "", 
    mockApiPosts: [MOCK_API_POSTS[0]] // Chỉ truyền 1 bài viết
  },
};