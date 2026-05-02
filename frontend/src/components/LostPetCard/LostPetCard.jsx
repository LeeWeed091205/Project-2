import React, { useState } from 'react';
import { Spin, message } from 'antd';
import { 
  CalendarOutlined, 
  EnvironmentOutlined, 
  TagOutlined, 
  CheckCircleOutlined,
  SearchOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import lostPetService from '../../services/lostPetService';
import LostPetDetailCard from '../LostPetDetailCard/LostPetDetailCard'; // Import component Modal

// --- GIỮ NGUYÊN COMPONENT UI CỦA BRO ---
const NeonSun = () => (
  <div className="relative w-full aspect-square flex items-center justify-center animate-[pulse_4s_infinite] scale-125">
    <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 via-orange-400 to-yellow-300 rounded-full blur-2xl opacity-40 animate-pulse" />
    <div className="relative w-20 h-20 bg-gradient-to-b from-yellow-200 via-orange-400 to-pink-500 rounded-full shadow-[0_0_40px_rgba(251,146,60,0.5)] border border-white/20">
      <div className="absolute inset-0 flex flex-col justify-around py-2 opacity-20">
        <div className="h-[2px] bg-white w-full" /><div className="h-[2px] bg-white w-full" /><div className="h-[2px] bg-white w-full" />
      </div>
    </div>
  </div>
);

const GreyMoon = () => (
  <div className="relative w-40 h-40 flex items-center justify-center group">
    <div className="absolute inset-0 bg-slate-400/20 rounded-full blur-[50px] group-hover:bg-pink-300/10 transition-colors duration-1000" />
    <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-slate-200 via-slate-400 to-slate-500 border border-white/20 shadow-[inset_-5px_-5px_15px_rgba(0,0,0,0.3),_0_0_30px_rgba(148,163,184,0.3)] overflow-hidden animate-[bounce_8s_infinite_ease-in-out]">
      <div className="absolute top-4 left-6 w-4 h-4 bg-black/10 rounded-full blur-[1px]" />
      <div className="absolute top-12 left-10 w-6 h-6 bg-black/5 rounded-full blur-[2px]" />
      <div className="absolute bottom-6 right-8 w-3 h-3 bg-white/10 rounded-full blur-[1px]" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20" />
    </div>
    <div className="absolute -bottom-2 w-32 h-6 bg-slate-500/20 backdrop-blur-md rounded-full animate-[pulse_5s_infinite]" />
  </div>
);

// --- COMPONENT CHÍNH ---
const LostPetCard = ({ basicInfo, currentUserId }) => {
  // Bóc tách DTO cơ bản
  const { lostpetId, petname, species, location, status, lostdate } = basicInfo;
  
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [fullDetailData, setFullDetailData] = useState(null); // Lưu trữ DTO full

  const isLost = status?.toLowerCase() === 'lost' || status?.toLowerCase() === 'tìm kiếm';

  // HÀM CLICK: GỌI API DETAIL
  const handleCardClick = async () => {
    if (fullDetailData) {
      setIsDetailOpen(true);
      return;
    }

    setIsLoadingDetail(true);
    try {
      const data = await lostPetService.getLostPetDetailInfo(lostpetId);
      setFullDetailData({
        ...basicInfo,
        ...data,
        petImage: data.lostpetImages || [],
      });
      setIsDetailOpen(true);
    } catch (error) {
      console.error("Lỗi get detail:", error);
      message.error("Không thể lấy thông tin chi tiết lúc này!");
    } finally {
      setIsLoadingDetail(false);
    }
  };

  return (
    <>
      <div 
        onClick={handleCardClick}
        className={`w-full flex flex-col md:flex-row justify-between items-start md:items-center p-6 my-4 
                    bg-white rounded-[2rem] border border-pink-50 
                    shadow-[0_10px_30px_rgba(168,85,247,0.08)] 
                    transition-all duration-500 cursor-pointer group relative overflow-hidden
                    ${isLoadingDetail ? 'pointer-events-none' : 'hover:shadow-[0_20px_40px_rgba(236,72,153,0.15)]'}`}
      >
        {/* MÀN LOADING OVERLAY KHI ĐANG FETCH API */}
        {isLoadingDetail && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center">
            <Spin indicator={<LoadingOutlined style={{ fontSize: 36, color: '#ec4899' }} spin />} />
          </div>
        )}

        {isLost && <div className="absolute -right-[2rem] -bottom-[5rem]"><GreyMoon /></div>}
        {!isLost && <div className="absolute right-[0.5rem] -bottom-[1rem]"><NeonSun /></div>}
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-gradient-to-br from-pink-100/40 to-purple-100/40 rounded-full blur-3xl group-hover:from-purple-200/50 transition-all duration-700" />

        <div className="flex items-start md:items-center gap-6 z-10 w-full">
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-gradient-to-tr from-pink-500 to-purple-600 text-white rounded-2xl shadow-lg shadow-pink-200 transform group-hover:rotate-6 transition-transform">
              <span className="text-2xl font-black">{petname?.charAt(0).toUpperCase()}</span>
            </div>
            <span className="text-[10px] font-mono text-purple-300 bg-purple-50 px-2 py-0.5 rounded">#{lostpetId}</span>
          </div>

          <div className="flex flex-col flex-grow">
            <div className="flex items-center gap-3">
              <h3 className="font-black text-2xl m-0 bg-gradient-to-r from-pink-600 to-purple-700 bg-clip-text text-transparent">{petname}</h3>
              <span className="flex items-center gap-1 text-[11px] px-3 py-1 rounded-full bg-pink-50 text-pink-500 border border-pink-100 font-bold uppercase">
                <TagOutlined /> {species}
              </span>
            </div>
            <div className="flex flex-col md:grid-cols-2 gap-x-6 gap-y-2 mt-4">
              <p className="flex items-center m-0 text-gray-500 text-sm italic">
                <EnvironmentOutlined className="mr-2 text-pink-400" /> 
                <span className="font-semibold text-gray-700 mr-1">Vị trí:</span> {location}
              </p>
              <p className="flex items-center m-0 text-gray-500 text-sm">
                <CalendarOutlined className="mr-2 text-purple-400" /> 
                <span className="font-semibold text-gray-700 mr-1">Ngày lạc:</span> {lostdate}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 md:mt-0 z-10 flex-shrink-0 scale-75 absolute top-3 right-0">
          <div className={`w-full h-full flex items-center gap-2 px-5 py-2 rounded-2xl font-black text-xs uppercase tracking-widest shadow-sm border transition-all duration-300 ${isLost ? 'bg-pink-50 text-pink-600 border-pink-200 animate-pulse' : 'bg-green-50 text-green-600 border-green-200'}`}>
            {isLost ? <SearchOutlined /> : <CheckCircleOutlined />}
            {isLost ? 'Đang tìm kiếm' : 'Đã tìm thấy'}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-0 h-1.5 bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 group-hover:w-full transition-all duration-700" />
      </div>

      {/* RENDER MODAL: Chỉ ném 1 cục fullDetailData vào */}
      {isDetailOpen && fullDetailData && (
        <LostPetDetailCard 
          fullData={fullDetailData} 
          currentUserId={currentUserId}
          onClose={() => setIsDetailOpen(false)} 
        />
      )}
    </>
  );
};

export default LostPetCard;