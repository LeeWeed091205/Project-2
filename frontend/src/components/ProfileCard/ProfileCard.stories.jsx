import React from 'react';
import ProfileCard from './ProfileCard'; // Đảm bảo đường dẫn import đúng

export default {
  title: 'Components/ProfileCard',
  component: ProfileCard,
  parameters: {
    layout: 'centered', // Hiển thị card ở giữa màn hình Storybook
  },
  // Bọc card trong một thẻ div có độ rộng cố định để test vì thẻ đang có class w-full
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

// Trạng thái 1: Có đầy đủ Avatar
export const DefaultWithAvatar = {
  args: {
    userId: "USR-8472",
    username: "Nguyễn Gia Huy",
    avatarUrl: "https://i.pravatar.cc/150?img=11",
  },
};

// Trạng thái 2: Không có Avatar (Sẽ hiển thị chữ cái đầu của tên)
export const WithoutAvatar = {
  args: {
    userId: "USR-9102",
    username: "Hoàng Mochi",
    avatarUrl: "", 
  },
};

// Trạng thái 3: Tên rất dài (Test xem layout có bị vỡ không)
export const LongName = {
  args: {
    userId: "USR-3391",
    username: "Trần Lê Nguyễn Nguyễn Hoàng Tôn Thất Dũng",
    avatarUrl: "https://i.pravatar.cc/150?img=32",
  },
};