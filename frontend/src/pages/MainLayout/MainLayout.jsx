import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';

import {MainLayoutDecorSmall,
  MainLayoutDecorBig
} from './styled';
import useDebounce from '../../Hooks/useDebounce';
import { 
  CompassOutlined,
  MessageOutlined,
  IdcardOutlined,
  EnvironmentOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { Modal, Button } from 'antd';
import Navbar from '../../components/NavBar/Navbar';
import ProfileCard from '../../components/ProfileCard/ProfileCard';
import { clearAuthUser, getAuthUser } from '../../utils/auth';

export const MainLayout = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const authUser = getAuthUser() || {};
  const userAvatarUrl = authUser.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=GiaHuy";
  const userId = authUser.id || authUser.userId || 10000;
  const username = authUser.username || authUser.name || 'user';

  const handleLogout = () => {
    clearAuthUser();
    navigate('/login');
  };

  const currentPath = location.pathname.toLowerCase();
  const isProfileSearchDisabled = currentPath.startsWith('/profile');
  const searchPlaceholder = isProfileSearchDisabled
    ? 'Không hỗ trợ tìm kiếm ở đây'
    : currentPath.startsWith('/forum')
      ? 'Tìm tên phòng khám...'
      : currentPath.startsWith('/lost')
        ? 'Tìm tên thú cưng...'
        : 'Tìm tên người đăng...';

  const debouncedSearchTerm = useDebounce(isProfileSearchDisabled ? '' : searchInput, 500);

  const outletContext = {
    searchTerm: debouncedSearchTerm,
    searchType: isProfileSearchDisabled ? 'profile' : currentPath.startsWith('/forum') ? 'clinic' : currentPath.startsWith('/lost') ? 'pet' : 'feed',
  };

  return (
    <div className="bg-[#fff4f6] min-h-screen  font-['Plus_Jakarta_Sans'] text-gray-800">

    <MainLayoutDecorSmall className = "top-[1rem] rotate-[30deg]" />
    <MainLayoutDecorBig className = "-bottom-[5rem] -right-[10%] rotate-[30deg]" />
    <MainLayoutDecorSmall className = "top-[25rem] left-[60%] rotate-[30deg]" />
    <MainLayoutDecorSmall className = "top-[10rem] left-[55%] rotate-[30deg]" />
    <MainLayoutDecorSmall className = "top-[20rem] left-[20%] rotate-[30deg]" />

    <MainLayoutDecorBig className = "top-[30rem] -left-[20%] rotate-[30deg]" />

    <MainLayoutDecorBig className = "top-[30rem] -right-[20%] rotate-[30deg]" />
      
      {/* ================= TOP NAVBAR ================= */}
      <Navbar
        avatarImg={userAvatarUrl}
        searchTerm={isProfileSearchDisabled ? '' : searchInput}
        onSearchChange={setSearchInput}
        placeholder={searchPlaceholder}
        disabled={isProfileSearchDisabled}
      />

      {/* ================= MAIN CONTENT ================= */}
      <main className="pt-24 px-8 max-w-screen  mx-auto flex gap-8">
        
        {/* LEFT SIDEBAR */}
        <aside className="hidden lg:flex flex-col gap-1 w-[240px] sticky top-24 h-fit">
          <div className="mb-4 px-4">
            <h2 className="text-[15px] font-black text-pink-900">Verdant Sanctuary</h2>
            <p className="text-[11px] text-pink-400 font-medium">Blossom Community</p>
          </div>
          <nav className="flex flex-col gap-1 text-[13px] font-bold">
            {/* Sử dụng NavLink thay vì thẻ <a> */}
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `rounded-full px-5 py-3.5 flex items-center gap-4 transition-colors ${isActive ? 'bg-pink-100/50 text-pink-700' : 'text-gray-500 hover:bg-pink-50'}`
              }
            >
              <CompassOutlined className="text-lg" /> News Feed
            </NavLink>
            <NavLink 
              to="/forum&clinic" 
              className={({ isActive }) => 
                `rounded-full px-5 py-3.5 flex items-center gap-4 transition-colors ${isActive ? 'bg-pink-100/50 text-pink-700' : 'text-gray-500 hover:bg-pink-50'}`
              }
            >
              <MessageOutlined className="text-lg" /> Forum & Clinic
            </NavLink>
            <NavLink 
              to="/profile" 
              className={({ isActive }) => 
                `rounded-full px-5 py-3.5 flex items-center gap-4 transition-colors ${isActive ? 'bg-pink-100/50 text-pink-700' : 'text-gray-500 hover:bg-pink-50'}`
              }
            >
              <IdcardOutlined className="text-lg" /> Profiles
            </NavLink>
            <NavLink 
              to="/lost&found" 
              className={({ isActive }) => 
                `rounded-full px-5 py-3.5 flex items-center gap-4 transition-colors ${isActive ? 'bg-pink-100/50 text-pink-700' : 'text-gray-500 hover:bg-pink-50'}`
              }
            >
              <EnvironmentOutlined className="text-lg" /> Lost & Found
            </NavLink>
            
            <div className="my-4 border-t border-pink-100/50 mx-4"></div>
            
            <button onClick={() => setShowSettings(true)} className="text-left w-full text-gray-500 hover:bg-pink-50 rounded-full px-5 py-3.5 flex items-center gap-4 transition-colors">
              <SettingOutlined className="text-lg" /> Settings
            </button>
            <a className="text-gray-500 hover:bg-pink-50 rounded-full px-5 py-3.5 flex items-center gap-4 transition-colors" href="#">
              <QuestionCircleOutlined className="text-lg" /> Support
            </a>
          </nav>

          <ProfileCard onClick = {()=>{navigate('/profile')}} avatarUrl={userAvatarUrl} userId={userId} username={username}></ProfileCard>
        </aside>

        {/* CENTER FEED - Nơi hiển thị các component con */}
        <section className="flex-1 max-w-[600px] mx-auto pb-12">
           {/* Toàn bộ UI bài đăng cũ được thay bằng Outlet */}
           <Outlet context={outletContext} />
        </section>

        {/* RIGHT SIDEBAR */}
        <aside className="hidden xl:flex flex-col gap-6 w-[280px] sticky top-24 h-fit">
          
          {/* Gợi ý bạn bè */}
          <div className="bg-pink-50/50 rounded-3xl p-6 border border-pink-100/50">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-[13px] text-gray-800">Gợi ý bạn bè</h3>
              <button className="text-[11px] text-pink-600 font-bold hover:underline">Xem tất cả</button>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Bella the Corgi', friends: 3, img: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=100&h=100&fit=crop' },
                { name: 'Luna Moonlight', friends: 5, img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=100&h=100&fit=crop' },
                { name: 'Maximus', friends: 1, img: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=100&h=100&fit=crop' }
              ].map((pet, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <img src={pet.img} className="w-10 h-10 rounded-full object-cover border border-pink-200" alt={pet.name} />
                    <div>
                      <p className="text-[13px] font-bold text-gray-800 leading-none">{pet.name}</p>
                      <p className="text-[10px] text-gray-500 mt-1">{pet.friends} bạn chung</p>
                    </div>
                  </div>
                  <button className="bg-pink-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-full hover:bg-pink-800 transition-colors">Kết bạn</button>
                </div>
              ))}
            </div>
          </div>

          {/* Sự kiện sắp tới */}
          <div className="bg-pink-100/40 rounded-3xl p-6 border border-pink-100 backdrop-blur-[3px]">
            <h3 className="font-bold text-[13px] text-gray-800 mb-5 flex items-center gap-2">
              <CalendarOutlined className="text-pink-600 text-[18px]" /> Sự kiện sắp tới
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3 items-center">
                <div className="w-12 h-12 bg-white rounded-2xl flex flex-col items-center justify-center shadow-sm">
                  <span className="text-[9px] text-pink-500 font-bold uppercase">Th4</span>
                  <span className="text-[16px] font-black text-gray-800 leading-none">25</span>
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-gray-800">Offline Cún Cưng</h4>
                  <p className="text-[10px] text-gray-500">Công viên Thống Nhất</p>
                  <button className="text-[10px] font-bold text-pink-600 mt-0.5 hover:underline">Tham gia ngay</button>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <div className="w-12 h-12 bg-white rounded-2xl flex flex-col items-center justify-center shadow-sm">
                  <span className="text-[9px] text-pink-500 font-bold uppercase">Th5</span>
                  <span className="text-[16px] font-black text-gray-800 leading-none">02</span>
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-gray-800">Tư vấn sức khỏe</h4>
                  <p className="text-[10px] text-gray-500">Livestream cùng Bác sĩ</p>
                  <button className="text-[10px] font-bold text-pink-600 mt-0.5 hover:underline">Nhắc tôi</button>
                </div>
              </div>
            </div>
          </div>

          {/* Community Stats */}
          <div className="bg-gradient-to-br from-pink-700 to-purple-800 rounded-3xl p-6 text-white shadow-lg shadow-pink-200">
            <p className="text-[11px] font-medium opacity-80 mb-1">Gia đình Blossom</p>
            <h4 className="text-xl font-black mb-4">12,450+ Thành viên</h4>
            <div className="flex -space-x-2 mb-5">
              <img className="w-7 h-7 rounded-full border-2 border-purple-800" src="https://i.pravatar.cc/100?img=1" alt="user" />
              <img className="w-7 h-7 rounded-full border-2 border-purple-800" src="https://i.pravatar.cc/100?img=2" alt="user" />
              <img className="w-7 h-7 rounded-full border-2 border-purple-800" src="https://i.pravatar.cc/100?img=3" alt="user" />
              <div className="w-7 h-7 rounded-full border-2 border-purple-800 bg-pink-300 text-pink-900 flex items-center justify-center text-[9px] font-bold">+99</div>
            </div>
            <button className="w-full bg-white/20 backdrop-blur-md text-white py-2.5 rounded-full font-bold text-[12px] hover:bg-white/30 transition-colors">Mời bạn bè</button>
          </div>

        </aside>
      </main>
      <Modal
        title="Tùy chọn tài khoản"
        open={showSettings}
        onCancel={() => setShowSettings(false)}
        footer={[
          <Button key="logout" type="primary" danger onClick={handleLogout}>
            Đăng xuất
          </Button>,
          <Button key="close" onClick={() => setShowSettings(false)}>
            Đóng
          </Button>
        ]}
      >
        <p className="text-sm text-gray-600 mb-2">Tài khoản: <strong>{username}</strong></p>
        <p className="text-sm text-gray-600 mb-2">Quyền: <strong>{authUser.role || 'USER'}</strong></p>
        <p className="text-sm text-gray-500">Đăng xuất sẽ đưa bạn về trang login và xóa token lưu trong trình duyệt.</p>
      </Modal>
    </div>
  );
};