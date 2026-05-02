import PostCard from './PostCard';

export default {
  title: 'Components/Post/PostCard',
  component: PostCard,
  parameters: {
    layout: 'centered',
    // Thêm background xám nhạt để làm nổi bật cái Card màu trắng
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f8fafc' },
      ],
    },
  },
};

// --- DATA SEED (Dữ liệu mẫu) ---

export const MultipleImages = {
  args: {
    username: "Gia Huy",
    createdAt: "15 phút trước",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=GiaHuy",
    content: "Cuối tuần dẫn mấy bé đi dạo ở công viên. Không gian ở đây rất thoáng và thân thiện với thú cưng. Mọi người có địa điểm nào hay ho nữa không? 🐶🐱✨",
    commentTotal: 24,
    postImages: [
      "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg",
      "https://images.pexels.com/photos/160846/french-bulldog-summer-smile-joy-160846.jpeg",
      "https://images.pexels.com/photos/58997/pexels-photo-58997.jpeg",
      "https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg",
      "https://images.pexels.com/photos/356378/pexels-photo-356378.jpeg"
    ]
  }
};

export const SingleImage = {
  args: {
    username: "Pet Lover",
    createdAt: "2 giờ trước",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    content: "Nhìn biểu cảm của nó kìa, ghét chưa cơ chứ! 😂",
    commentTotal: 5,
    postImages: ["https://images.pexels.com/photos/45201/kitty-cat-baby-psit-45201.jpeg"]
  }
};

export const TextOnly = {
  args: {
    username: "Admin System",
    createdAt: "Hôm qua lúc 18:30",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
    content: "Thông báo: Hệ thống sẽ bảo trì vào lúc 12h đêm nay để cập nhật thêm các tính năng mới cho cộng đồng chia sẻ thực phẩm. Mong mọi người thông cảm! 🛠️",
    commentTotal: 0,
    postImages: []
  }
};

export const LongContent = {
  args: {
    username: "Cộng Đồng Thú Cưng",
    createdAt: "3 giờ trước",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Community",
    content: "Đây là một bài viết rất dài để kiểm tra xem layout của PostCard có bị vỡ không khi nội dung vượt quá mong đợi. Chúng ta cần đảm bảo rằng khoảng cách dòng (line-height) và font-size vẫn giữ được sự tinh tế của theme Pink-Purple. \n\nHy vọng mọi người sẽ thích giao diện mới này của ứng dụng! Đừng quên thả tim và để lại bình luận góp ý nhé.",
    commentTotal: 99,
    postImages: [
      "https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg",
      "https://images.pexels.com/photos/1543793/pexels-photo-1543793.jpeg"
    ]
  }
};