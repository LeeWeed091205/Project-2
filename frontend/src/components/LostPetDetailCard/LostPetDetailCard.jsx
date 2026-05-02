import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Row, Col } from 'antd';
import { 
  CalendarOutlined, CloseOutlined, 
  LeftOutlined, RightOutlined, EnvironmentOutlined, 
  PhoneOutlined, TagOutlined, InfoCircleOutlined
} from '@ant-design/icons';

const LostPetDetailCard = ({ fullData, onClose }) => {
  // 1. BÓC TÁCH TOÀN BỘ DATA ĐÃ FETCH TỪ THẺ CARD TRUYỀN XUỐNG
  const { 
    lostpetId, petname, species, location, status, lostdate, 
    description, contact, petImage = [] 
  } = fullData;

  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 150;
  const isLost = status?.toLowerCase() === 'lost' || status?.toLowerCase() === 'tìm kiếm';

  // --- STATES UI CƠ BẢN ---
  const [currentImgIndex, setCurrentImgIndex] = useState(null);

  // --- KHOÁ CUỘN NỀN KHI BẬT MODAL TRÁNH LỖI UI ---
  useEffect(() => {
    // Nếu bật Modal Detail, Modal Ảnh, hoặc Modal Comment đều khóa nền
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '15px';
    return () => {
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '0px';
    };
  }, []);

  // =========================================
  // HÀM XỬ LÝ ẢNH
  // =========================================
  const openImageModal = (index) => setCurrentImgIndex(index);
  const closeImageModal = () => setCurrentImgIndex(null);
  const showNext = (e) => { 
    e.stopPropagation(); 
    setCurrentImgIndex((prev) => (prev + 1) % petImage.length); 
  };
  const showPrev = (e) => { 
    e.stopPropagation(); 
    setCurrentImgIndex((prev) => (prev - 1 + petImage.length) % petImage.length); 
  };

  // =========================================
  // HÀM XỬ LÝ ẢNH
  // =========================================
  // GIAO DIỆN LƯỚI ẢNH (TỐI ĐA 4 ẢNH)
  // =========================================
  const renderImages = () => {
    const totalImages = petImage.length;
    if (totalImages === 0) return null;
    const displayImages = petImage.slice(0, 4);

    return (
      <section className={`w-full grid gap-2 py-4 ${totalImages === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
        {displayImages.map((img, index) => (
          <div 
            key={index} 
            className="relative aspect-square overflow-hidden group cursor-pointer rounded-2xl border-2 border-transparent hover:border-pink-300 transition-all shadow-md bg-purple-50" 
            onClick={() => openImageModal(index)}
          >
            <img src={img} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            {index === 3 && totalImages > 4 && (
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 to-pink-600/40 flex items-center justify-center text-white text-2xl font-black backdrop-blur-[1px]">
                +{totalImages - 4}
              </div>
            )}
          </div>
        ))}
      </section>
    );
  };

  // =========================================
  // RENDER CHÍNH (3 TẦNG PORTAL)
  // =========================================
  return createPortal(
    <>
      {/* ================= TẦNG 1: MODAL CHI TIẾT (MAIN) ================= */}
      <div className="fixed inset-0 z-[9990] flex items-center justify-center bg-purple-950/60 backdrop-blur-sm p-4 animate-in fade-in" onClick={onClose}>
        
        <div 
          className="w-full max-w-[800px] max-h-[90vh] overflow-y-auto hide-scrollbar bg-white rounded-[2.5rem] relative shadow-[0_25px_60px_rgba(168,85,247,0.15)] animate-in zoom-in-95 duration-300 custom-scrollbar"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Nút Đóng */}
          <button onClick={onClose} className="absolute top-6 right-6 z-50 bg-gray-100 hover:bg-pink-100 text-gray-500 hover:text-pink-600 w-10 h-10 rounded-full flex items-center justify-center transition-colors">
            <CloseOutlined />
          </button>

          {/* Vòng tròn mờ trang trí */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-pink-100/40 rounded-full blur-3xl pointer-events-none" />

          <div className="p-8 relative z-10">
            {/* Header: Avatar, Tên, ID, Badge */}
            <Row gutter={[16, 16]} align="middle" className="mb-6">
              <Col span={4}>
                <div className="h-16 w-16 bg-gradient-to-tr from-pink-500 to-purple-600 text-white flex items-center justify-center rounded-2xl font-black shadow-lg shadow-pink-200 text-2xl">
                  {petname?.charAt(0).toUpperCase()}
                </div>
              </Col>
              <Col span={18}>
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-3xl font-black m-0 bg-gradient-to-r from-pink-600 to-purple-700 bg-clip-text text-transparent">{petname}</h2>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold border ${isLost ? 'bg-pink-50 text-pink-600 border-pink-100 animate-pulse' : 'bg-green-50 text-green-600 border-green-100'}`}>
                    {isLost ? 'TÌM KIẾM' : 'ĐÃ TÌM THẤY'}
                  </div>
                </div>
                <p className="text-purple-400 text-xs mt-1 font-semibold italic uppercase">
                  <TagOutlined className="mr-1" /> {species} | #{lostpetId}
                </p>
              </Col>
            </Row>

            {/* Info Grid (Địa điểm, Liên hệ, Ngày) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-gradient-to-br from-pink-50/50 to-purple-50/50 p-6 rounded-3xl border border-pink-100/30">
              <div className="flex items-center text-purple-900/80">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm mr-3 text-pink-500"><EnvironmentOutlined /></div>
                <div><p className="text-[10px] uppercase font-bold text-pink-400 m-0">Vị trí</p><strong className="text-sm leading-tight block truncate max-w-[120px]">{location}</strong></div>
              </div>
              <div className="flex items-center text-purple-900/80">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm mr-3 text-purple-500"><PhoneOutlined /></div>
                <div><p className="text-[10px] uppercase font-bold text-purple-400 m-0">Liên hệ</p><strong className="text-sm font-mono">{contact}</strong></div>
              </div>
              <div className="flex items-center text-purple-900/80">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm mr-3 text-orange-400"><CalendarOutlined /></div>
                <div><p className="text-[10px] uppercase font-bold text-orange-400 m-0">Ngày lạc</p><strong className="text-sm font-mono">{lostdate}</strong></div>
              </div>
            </div>

            {/* Hình ảnh */}
            {renderImages()}

            {/* Mô tả chi tiết (Rút gọn/Xem thêm) */}
            {description && (
              <div className="my-6 text-purple-900/70 leading-relaxed bg-gray-50 p-5 rounded-2xl border border-dashed border-pink-200 text-sm">
                <div className="flex items-center gap-2 mb-2 text-pink-500 font-bold uppercase text-[10px] tracking-widest"><InfoCircleOutlined /> Đặc điểm nhận dạng</div>
                <p className="m-0 italic whitespace-pre-wrap">
                  {isExpanded || description.length <= maxLength ? description : `${description.substring(0, maxLength)}... `}
                </p>
                {description.length > maxLength && (
                  <button onClick={() => setIsExpanded(!isExpanded)} className="text-pink-600 font-black text-xs mt-3 uppercase underline underline-offset-4 decoration-pink-200">
                    {isExpanded ? 'Thu gọn' : 'Xem toàn bộ'}
                  </button>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ================= TẦNG 2: MODAL XEM ẢNH FULL MÀN HÌNH ================= */}
      {currentImgIndex !== null && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-purple-950/95 backdrop-blur-xl p-4 animate-in fade-in" onClick={closeImageModal}>
          <button className="absolute top-8 right-8 text-pink-200 hover:text-white text-3xl z-10 hover:rotate-90 transition-transform"><CloseOutlined /></button>
          
          {petImage.length > 1 && (
            <>
              <button className="absolute left-6 text-white/50 hover:text-white text-5xl p-4 transition-all hover:scale-125" onClick={showPrev}><LeftOutlined /></button>
              <button className="absolute right-6 text-white/50 hover:text-white text-5xl p-4 transition-all hover:scale-125" onClick={showNext}><RightOutlined /></button>
            </>
          )}

          <div className="relative max-w-[80%] max-h-[80%] flex flex-col items-center">
            <img src={petImage[currentImgIndex]} alt="Pet" className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl animate-in zoom-in border border-white/10" onClick={(e) => e.stopPropagation()} />
            <div className="mt-4 px-6 py-2 bg-pink-500/20 backdrop-blur-md rounded-full border border-pink-400/30 text-pink-100 font-bold tracking-widest">
              {currentImgIndex + 1} / {petImage.length}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>,
    document.body
   
  );
};

export default LostPetDetailCard;