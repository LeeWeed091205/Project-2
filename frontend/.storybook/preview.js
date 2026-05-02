/** @type { import('@storybook/react-vite').Preview } */

// 1. Import Tailwind CSS (Đường dẫn có thể là ./src/index.css tùy dự án của bạn)
import '../src/index.css'; 

// 2. Import Ant Design CSS (Nếu bạn có dùng các component Antd khác)
import 'antd/dist/reset.css';

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Giúp component Login hiển thị sát viền màn hình (giống thực tế)
    layout: 'fullscreen',
    a11y: {
      test: "todo"
    }
  },
};

export default preview;