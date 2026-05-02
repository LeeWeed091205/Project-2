import ClinicCard from './ClinicCard';

export default {
  title: 'Components/Clinic/ClinicCard',
  component: ClinicCard,
  parameters: {
    // Đặt component vào giữa màn hình Storybook để dễ quan sát
    layout: 'centered',
  },
  // Tự động tạo bảng điều khiển cho các props
  argTypes: {
    clinicId: { control: 'text' },
    name: { control: 'text' },
    address: { control: 'text' },
  },
};

// 1. Trạng thái hiển thị cơ bản
export const Default = {
  args: {
    clinicId: '01',
    name: 'Phòng khám Thú y Alpha',
    address: '123 Cầu Giấy, Hà Nội',
  },
};

// 2. Trường hợp tên phòng khám và địa chỉ quá dài (Test xem giao diện có bị vỡ không)
export const LongContent = {
  args: {
    clinicId: '99',
    name: 'Bệnh viện Đa khoa Thú y Quốc tế Chất lượng cao chi nhánh miền Bắc',
    address: 'Tòa nhà Landmark 81, Phường 22, Quận Bình Thạnh, Thành phố Hồ Chí Minh, Việt Nam',
  },
};

// 3. Trường hợp thiếu thông tin địa chỉ
export const NoAddress = {
  args: {
    clinicId: '02',
    name: 'Phòng khám Pet Love',
    address: '',
  },
};

// 4. Test danh sách nhiều Card (để xem khoảng cách m-2 bạn đặt có ổn không)
export const ListPreview = () => (
  <div className="w-[500px] border border-dashed border-gray-300 p-4">
    <ClinicCard clinicId="01" name="Clinic A" address="Hà Nội" />
    <ClinicCard clinicId="02" name="Clinic B" address="Đà Nẵng" />
    <ClinicCard clinicId="03" name="Clinic C" address="TP.HCM" />
  </div>
);