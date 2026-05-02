import Login from './Login';

export default {
  title: 'Pages/Auth/Login', // Đường dẫn trên menu Storybook
  component: Login,
  parameters: {
    // Để component hiển thị tràn viền giống như trên web thật
    layout: 'fullscreen',
  },
};

// Story mặc định
export const Default = () => <Login />;

// Bạn có thể tạo thêm các kịch bản test khác nếu muốn
// Ví dụ: Test giao diện trên màn hình điện thoại
export const MobileView = () => <Login />;
MobileView.parameters = {
  viewport: {
    defaultViewport: 'mobile1',
  },
};