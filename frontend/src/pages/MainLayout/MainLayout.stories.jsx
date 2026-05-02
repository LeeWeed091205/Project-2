import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './MainLayout';
// Nhớ import component Feed từ đường dẫn tương ứng trong project của bạn
import { Feed } from '../FeedPage/Feed'; 

// Mock Data chuẩn khớp với ảnh bạn gửi
const MOCK_API_RESPONSE = [
  {
    id: "post_1",
    username: "Minh Anh",
    avatarUrl: "https://i.pravatar.cc/150?img=32",
    content: "Mochi vừa mới được tỉa lông xong nè mọi người. Trông giống cục bông gòn không cơ chứ! 🌸 #poodle #petlover",
    images: ["https://images.unsplash.com/photo-1591768575198-88dac53fbd0a?q=80&w=800&auto=format&fit=crop"],
    commentsCount: 45,
    likes: 128,
    timestamp: "2 giờ trước • 🌍"
  },
  {
    id: "post_2",
    username: "Hoàng Nam",
    avatarUrl: "https://i.pravatar.cc/150?img=11",
    content: "Sáng nay đi dạo ở công viên Verdant, không khí trong lành cực kỳ. Các sen có ai ở gần đây không giao lưu nào!",
    images: [
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=600&auto=format&fit=crop", 
      "https://images.unsplash.com/photo-1537151608804-ea6f112e4431?q=80&w=600&auto=format&fit=crop"
    ],
    commentsCount: 12,
    likes: 56,
    timestamp: "5 giờ trước • 🌍"
  }
];

export default {
  title: 'Pages/MainLayout',
  component: MainLayout,
  parameters: {
    layout: 'fullscreen', // Xóa padding mặc định của Storybook để Navbar bám viền
  },
  // Sử dụng Decorator để bọc MainLayout trong một Router giả lập
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <Story />
      </MemoryRouter>
    ),
  ],
};

// Cấu hình Render tùy chỉnh để lồng Feed vào trong MainLayout (vị trí Outlet)
export const StandardUserFeed = {
  render: (args) => (
    <Routes>
      <Route element={<MainLayout userAvatarUrl={args.userAvatarUrl} />}>
        {/* Route index sẽ tự động chui vào <Outlet /> của MainLayout */}
        <Route index element={
          <Feed userAvatarUrl={args.userAvatarUrl} mockApiData={args.mockApiData} />
        } />
      </Route>
    </Routes>
  ),
  args: {
    userAvatarUrl: "https://i.pravatar.cc/150?img=68",
    mockApiData: MOCK_API_RESPONSE
  },
};

export const EmptyStateFeed = {
  render: (args) => (
    <Routes>
      <Route element={<MainLayout userAvatarUrl={args.userAvatarUrl} />}>
        <Route index element={
          <Feed userAvatarUrl={args.userAvatarUrl} mockApiData={args.mockApiData} />
        } />
      </Route>
    </Routes>
  ),
  args: {
    userAvatarUrl: "https://i.pravatar.cc/150?img=68",
    mockApiData: [] // Trạng thái chưa có ai đăng bài
  },
};