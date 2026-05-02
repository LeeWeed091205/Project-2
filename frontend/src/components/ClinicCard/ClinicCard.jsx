import React from 'react';
import { CardBackground } from './styled';
import { EnvironmentOutlined, StarFilled } from '@ant-design/icons';

const ClinicCard = ({ clinic = {}, onClick }) => {
  const clinicId = clinic.clinicId || clinic.id || '#';
  const name = clinic.name || 'Phòng khám';
  const address = clinic.address || 'Đang cập nhật địa chỉ';
  const description = clinic.description || 'Phòng khám đang cập nhật thông tin dịch vụ.';
  const excerpt = description.length > 110 ? `${description.slice(0, 110)}...` : description;

  return (
    <div
      onClick={onClick}
      className="w-full p-6 my-2 bg-white rounded-[2rem] border border-pink-50 shadow-[0_10px_30px_rgba(168,85,247,0.05)] hover:shadow-[0_20px_50px_rgba(236,72,153,0.12)] transition-all duration-300 cursor-pointer relative overflow-hidden group"
    >
      <CardBackground className="-top-[0.3rem] -right-[0.1rem] z-[2]" />
      <CardBackground className="top-[1rem] -right-[1rem] z-[1]" />
      <CardBackground className="top-[3rem] -right-[1rem] z-0 rotate-45 translate-y-2" />
      <CardBackground className="-top-1 left-[1rem] rotate-45" />

      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-pink-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-start gap-5 z-10 relative">
        <div className="w-14 h-14 flex-shrink-0 rounded-3xl bg-gradient-to-br from-pink-500 to-purple-600 text-white font-black flex items-center justify-center shadow-lg shadow-pink-200">
          {String(clinicId).slice(0, 2)}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-black text-xl text-gray-900 group-hover:text-pink-600 transition-colors leading-tight">
            {name}
          </h3>
          <p className="mt-2 text-sm text-gray-500 flex items-center gap-2 truncate">
            <EnvironmentOutlined className="text-pink-400" />
            <span>{address}</span>
          </p>
          <p className="mt-4 text-sm text-gray-600 leading-relaxed break-words">
            {excerpt}
          </p>
        </div>
      </div>

    </div>
  );
}

export default ClinicCard;

