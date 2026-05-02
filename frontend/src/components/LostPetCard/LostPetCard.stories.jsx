import LostPetCard from './LostPetCard';

export default {
  title: 'Components/Pet/LostPetCard',
  component: LostPetCard,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    status: {
      options: ['Lost', 'Found'],
      control: { type: 'radio' },
    },
  },
};

const Template = (args) => (
  <div className="w-[600px] p-4 bg-gray-50">
    <LostPetCard {...args} />
  </div>
);

export const Searching = Template.bind({});
Searching.args = {
  lostpetId: 12,
  petname: 'Lu Lu',
  species: 'Chó Poodle',
  location: 'Công viên Thống Nhất, Hai Bà Trưng',
  status: 'Lost',
  lostdate: '18/04/2026',
};

export const Found = Template.bind({});
Found.args = {
  lostpetId: 'LP-100',
  petname: 'Mimi',
  species: 'Mèo Anh Lông Ngắn',
  location: 'Ngõ 123 Xuân Thủy, Cầu Giấy',
  status: 'Found',
  lostdate: '15/04/2026',
};

export const LongLocation = Template.bind({});
LongLocation.args = {
  lostpetId: 'LP-101',
  petname: 'Bắp',
  species: 'Hamster',
  location: 'Khu chung cư cao cấp Vinhomes Ocean Park, Đa Tốn, Gia Lâm, Hà Nội (Gần tòa S2.12)',
  status: 'Lost',
  lostdate: '19/04/2026',
};