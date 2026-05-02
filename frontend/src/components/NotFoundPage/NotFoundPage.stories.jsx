import React from 'react';
import { Button, Result } from 'antd';
// Import component gốc của bạn (nếu bạn đã tách ra file riêng)
// import NotFoundPage from './NotFoundPage'; 

export default {
  title: 'Pages/NotFoundPage', // Tên hiển thị trên menu Storybook
};

// Đây là cách định nghĩa một "Story"
export const Default = () => (
  <Result
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist."
    extra={<Button type="primary">Back Home</Button>}
  />
);