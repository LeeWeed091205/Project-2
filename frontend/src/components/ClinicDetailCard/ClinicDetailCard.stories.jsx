import ClinicDetailCard from './ClinicDetailCard';

export default {
  title: 'Components/Clinic/ClinicDetailCard',
  component: ClinicDetailCard,
  parameters: {
    layout: 'centered', // Hiển thị component ở giữa màn hình Storybook
  },
  // Định nghĩa các kiểu dữ liệu cho bảng Controls để bạn test nhanh
  argTypes: {
    createdAt: { control: 'date' },
  },
};

// Dữ liệu mẫu (Mock Data)
const mockData = {
  clinicId: "C01",
  name: "Phòng khám Thú y PetCare",
  address: "123 Đường Láng, Đống Đa, Hà Nội",
  description: "Chuyên cung cấp các dịch vụ chăm sóc sức khỏe, tiêm phòng và phẫu thuật thẩm mỹ cho thú cưng với đội ngũ bác sĩ tận tâm.",
  phone: "0987.654.321",
  createdAt: "20/04/2026",
  clinicImages: [
    "https://picsum.photos/id/237/200/300", 
    "https://picsum.photos/id/1025/200/300",
    "https://picsum.photos/id/1062/200/300",
    "https://picsum.photos/id/1062/200/300",
    "https://picsum.photos/id/1062/200/300"
  ]
};

// Kịch bản 1: Hiển thị đầy đủ thông tin
export const Default = {
  args: {
    ...mockData
  },
};

// Kịch bản 2: Khi phòng khám chưa có ảnh
export const NoImages = {
  args: {
    ...mockData,
    clinicImages: [],
    description: "Phòng khám mới thành lập, đang cập nhật hình ảnh cơ sở vật chất."
  },
};

// Kịch bản 3: Tên cơ sở quá dài (để test xem Row/Col của Antd có bị vỡ không)
export const LongName = {
  args: {
    ...mockData,
    name: "Hệ thống Bệnh viện Thú y Quốc tế Chất lượng cao chi nhánh khu vực miền Bắc",
  },
};