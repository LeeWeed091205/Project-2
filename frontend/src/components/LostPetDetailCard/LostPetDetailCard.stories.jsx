import LostPetDetailCard from './LostPetDetailCard';

export default {
  title: 'Components/Pet/LostPetDetailCard',
  component: LostPetDetailCard,
  parameters: {
    // Để card hiển thị đẹp nhất trên Storybook
    layout: 'padded',
  },
  argTypes: {
    status: {
      options: ['Lost', 'Found'],
      control: { type: 'radio' },
    },
    lostdate: {
      control: 'date',
    }
  },
};

// Dữ liệu mẫu chung (Seed Data)
const commonData = {
  lostpetId: "PET-8899",
  petname: "Bánh Bao",
  species: "Mèo Anh Lông Ngắn",
  location: "Chung cư Blue Star, Gia Lâm, Hà Nội",
  phone: "0334.556.789",
  lostdate: "20/04/2026", // Hiển thị rõ trường ngày lạc
  description: "Bé Bánh Bao nhà mình đi lạc khi cửa sổ không đóng kỹ. Bé nặng khoảng 4kg, lông màu xám xanh, rất nhát người lạ nên khả năng cao bé đang trốn trong các hốc tối. Bé có đặc điểm là đuôi hơi ngắn và có đeo một vòng cổ màu đỏ. Ai thấy bé ở đâu xin vui lòng giữ lại và gọi cho mình ngay lập tức, gia đình xin chân thành cảm ơn.",
  petImage: [
    "https://images.pexels.com/photos/45201/kitty-cat-baby-psit-45201.jpeg",
    "https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg",
    "https://images.pexels.com/photos/1543793/pexels-photo-1543793.jpeg",
    "https://images.pexels.com/photos/1314550/pexels-photo-1314550.jpeg",
    "https://images.pexels.com/photos/1741205/pexels-photo-1741205.jpeg"
  ]
};

// 1. Kịch bản mặc định: Đang tìm kiếm
export const Default = {
  args: {
    ...commonData,
    status: "Lost",
  },
};

// 2. Kịch bản: Đã tìm thấy bé
export const FoundStatus = {
  args: {
    ...commonData,
    status: "Found",
    description: "TIN VUI: Bé Bánh Bao đã được tìm thấy tại tầng hầm của tòa nhà bên cạnh! Bé hơi đói và hoảng loạn nhưng hiện đã an toàn ở nhà. Cảm ơn mọi người đã quan tâm chia sẻ.",
  },
};

// 3. Kịch bản: Ít ảnh (Test layout grid khi chỉ có 1 ảnh)
export const SingleImage = {
  args: {
    ...commonData,
    petImage: ["https://images.pexels.com/photos/45201/kitty-cat-baby-psit-45201.jpeg"]
  },
};

// 4. Kịch bản: Mô tả cực ngắn
export const ShortDescription = {
  args: {
    ...commonData,
    description: "Bé lạc ở khu vực sảnh tòa nhà, mong mọi người giúp đỡ."
  },
};