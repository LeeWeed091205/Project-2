import React from 'react';
import { CardBackground } from './styled'; // Đảm bảo bạn đã import CardBackground giống như ClinicCard

const ProfileCard = ({ userId, username, avatarUrl = "" ,onClick}) => {
  return (
    <div className="w-full flex justify-between items-center p-4 my-2 
                    bg-white rounded-2xl border border-pink-50 
                    shadow-[0_4px_20px_rgba(168,85,247,0.05)] 
                    hover:shadow-[0_8px_25px_rgba(236,72,153,0.15)] 
                    hover:-translate-y-1 transition-all duration-300 cursor-pointer 
                    relative overflow-hidden group" onClick = {onClick}>

      {/* Các họa tiết trang trí góc */}
      <CardBackground className="-top-[0.3rem] -right-[0.1rem] z-[2]"></CardBackground>
      <CardBackground className="top-[1rem] -right-[1rem] z-[1]"></CardBackground>
      <CardBackground className="top-[3rem] -right-[1rem] z-0 rotate-45 translate-y-2"></CardBackground>
      <CardBackground className="-top-1 left-[1rem] rotate-45"></CardBackground>

      {/* Vệt màu trang trí nhỏ ở cạnh trái khi hover */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-pink-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-center gap-4 z-10">
        {/* Khối Avatar */}
        {avatarUrl ? (
          <img 
            src={avatarUrl} 
            alt={username}
            className="w-10 h-10 flex-shrink-0 object-cover rounded-xl border border-pink-200 shadow-sm"
          />
        ) : (
          <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center 
                          bg-gradient-to-br from-pink-100 to-purple-100 
                          text-purple-600 font-bold rounded-xl border border-pink-200 shadow-sm">
            {username ? username.charAt(0).toUpperCase() : 'U'}
          </div>
        )}

        {/* Thông tin Profile */}
        <div className="flex flex-col">
          <h3 className="font-bold text-gray-800 group-hover:text-pink-600 transition-colors m-0 text-base leading-tight">
            {username}
          </h3>
          <p className="text-gray-400 text-xs m-0 mt-1 flex items-center">
            <span className="mr-1">👤</span> ID: {userId}
          </p>
        </div>
      </div>

      {/* Nút mũi tên chuyển hướng bên phải */}
      <div className="text-pink-300 group-hover:text-pink-500 transition-colors pr-2 z-10">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
};

export default ProfileCard;