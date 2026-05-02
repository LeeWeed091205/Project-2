import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Row, Col, Rate, Spin, message, Popconfirm, Input, Button } from 'antd'; 
import { 
  CommentOutlined, 
  FieldTimeOutlined, 
  CloseOutlined, 
  LeftOutlined, 
  RightOutlined,
  SendOutlined,
  LoadingOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  StarFilled,
  EnvironmentOutlined,
  PhoneOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import reviewService from '../../services/reviewService';
import clinicService from '../../services/clinicService';

const ClinicDetailCard = ({ 
  clinicId, 
  name, 
  createdAt, 
  clinicImages = [], 
  address = '',
  phone = '',
  description = '',
  reviews = [],
  currentUserId, // <-- THÊM PROP NÀY: ID của user đang đăng nhập hiện tại
  onClose 
}) => {

  // --- STATE MODAL ẢNH ---
  const [currentImgIndex, setCurrentImgIndex] = useState(null);

  // --- STATE MODAL BÌNH LUẬN ---
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [commentPage, setCommentPage] = useState(1);
  
  const [clinicDetails, setClinicDetails] = useState({
    name,
    address,
    phone,
    description,
  });
  const [editClinicValues, setEditClinicValues] = useState({
    name,
    address,
    phone,
    description,
  });
  const [isEditClinicMode, setIsEditClinicMode] = useState(false);
  const [isUpdatingClinic, setIsUpdatingClinic] = useState(false);

  // State đăng bình luận mới
  const [usernameRating, setUsernameRating] = useState(5); 
  const [newCommentText, setNewCommentText] = useState("");
  const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
  const currentUsername = storedUser?.username || storedUser?.name || storedUser?.user || '';
  const effectiveUserId = currentUserId || storedUser?.userId || storedUser?.id || null;
  const authIsAdmin = Boolean(
    typeof storedUser.role === 'string'
      ? storedUser.role.toUpperCase().includes('ADMIN')
      : Array.isArray(storedUser.role)
      ? storedUser.role.some((role) => String(role).toUpperCase().includes('ADMIN'))
      : false
  );
  const canEditClinic = authIsAdmin;

  const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString('vi-VN');
  };

  const initialReviewCount = Array.isArray(reviews) ? reviews.length : 0;
  const currentReviewCount = Math.max(initialReviewCount, comments.length);
  const averageRating = currentReviewCount > 0
    ? (Array.isArray(reviews) && reviews.length > 0
        ? reviews.reduce((sum, comment) => sum + (comment.rating || 0), 0) / reviews.length
        : comments.reduce((sum, comment) => sum + (comment.rating || 0), 0) / comments.length)
    : null;

  // --- STATE SỬA BÌNH LUẬN ---
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [editCommentRating, setEditCommentRating] = useState(5);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '15px'; 
    return () => {
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '0px';
    };
  }, []);

  useEffect(() => {
    setClinicDetails({ name, address, phone, description });
    setEditClinicValues({ name, address, phone, description });
    setIsEditClinicMode(false);
  }, [name, address, phone, description]);

  useEffect(() => {
    setComments([]);
    setCommentPage(1);
    setHasMoreComments(true);
    setIsLoadingComments(false);
    setEditingCommentId(null);
  }, [clinicId]);

  // --- 1. LOGIC ẢNH ---

  // --- 2. API: LẤY BÌNH LUẬN ---
  const fetchComments = async () => {
    if (isLoadingComments || !hasMoreComments) return;
    setIsLoadingComments(true);
    try {
      const response = await reviewService.getReviewsByClinic(clinicId, commentPage - 1, 10);
      const content = response?.content || [];
      setComments((prev) => [...prev, ...content]);
      setCommentPage((prev) => prev + 1);
      setHasMoreComments(!response?.last);
    } catch (error) {
      console.error('Lỗi tải đánh giá:', error);
      message.error("Không thể tải đánh giá!");
    } finally {
      setIsLoadingComments(false);
    }
  };

  const openCommentModal = () => {
    setIsCommentModalOpen(true);
    if (comments.length === 0 && !isLoadingComments) {
      fetchComments();
    }
  };

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight + 50) fetchComments();
  };

  // --- 3. API: THÊM BÌNH LUẬN ---
  const handlePostComment = async () => {
    if (!newCommentText.trim()) return;
    try {
      const response = await reviewService.createReview(clinicId, {
        comment: newCommentText,
        rating: usernameRating,
      });

      message.success("Cảm ơn bạn đã đánh giá!");
      const newReview = response 
      setComments((prev) => [newReview, ...prev]);
      setNewCommentText("");
    } catch (error) {
      console.error('Lỗi gửi đánh giá:', error);
      message.error("Gửi bình luận thất bại!");
    }
  };

  // --- 4. API: XÓA BÌNH LUẬN ---
  const handleDeleteComment = async (commentId, commentOwnerId, commentOwnerName) => {
    if (commentOwnerId && commentOwnerId !== effectiveUserId) {
      message.error("Bạn không có quyền xóa bình luận của người khác!");
      return;
    }
    if (!commentOwnerId && commentOwnerName !== currentUsername) {
      message.error("Bạn không có quyền xóa bình luận của người khác!");
      return;
    }

    try {
      await reviewService.deleteReview(commentId);
      message.success("Đã xóa bình luận!");
      setComments((prev) => prev.filter((c) => c.reviewId !== commentId));
    } catch (error) {
      console.error('Lỗi xóa đánh giá:', error);
      message.error("Xóa thất bại!");
    }
  };

  // --- 5. API: SỬA BÌNH LUẬN ---
  const startEditing = (comment) => {
    if (comment.userId && comment.userId !== effectiveUserId) {
      message.error("Bạn chỉ có thể sửa bình luận của chính mình.");
      return;
    }
    if (!comment.userId && comment.username !== currentUsername) {
      message.error("Bạn chỉ có thể sửa bình luận của chính mình.");
      return;
    }
    setEditingCommentId(comment.reviewId);
    setEditCommentText(comment.comment || comment.text || '');
    setEditCommentRating(comment.rating || 5);
  };

  const handleSaveEdit = async (commentId) => {
    try {
      await reviewService.updateReview(commentId, {
        comment: editCommentText,
        rating: editCommentRating,
      });

      message.success("Cập nhật bình luận thành công!");
      setComments((prev) => prev.map((c) =>
        c.reviewId === commentId ? { ...c, comment: editCommentText, rating: editCommentRating } : c
      ));
      setEditingCommentId(null);
    } catch (error) {
      console.error('Lỗi cập nhật đánh giá:', error);
      message.error("Cập nhật thất bại!");
    }
  };

  const handleToggleClinicEdit = () => {
    setEditClinicValues({
      name: clinicDetails.name,
      address: clinicDetails.address,
      phone: clinicDetails.phone,
      description: clinicDetails.description,
    });
    setIsEditClinicMode(true);
  };

  const handleCancelClinicEdit = () => {
    setEditClinicValues({
      name: clinicDetails.name,
      address: clinicDetails.address,
      phone: clinicDetails.phone,
      description: clinicDetails.description,
    });
    setIsEditClinicMode(false);
  };

  const handleClinicFieldChange = (field, value) => {
    setEditClinicValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveClinic = async () => {
    setIsUpdatingClinic(true);
    try {
      const payload = {
        name: editClinicValues.name,
        address: editClinicValues.address,
        phone: editClinicValues.phone,
        description: editClinicValues.description,
      };
      await clinicService.updateClinic(clinicId, payload);
      setClinicDetails(payload);
      setIsEditClinicMode(false);
      message.success('Cập nhật thông tin phòng khám thành công!');
    } catch (error) {
      console.error('Lỗi cập nhật phòng khám:', error);
      message.error('Cập nhật phòng khám thất bại, vui lòng thử lại.');
    } finally {
      setIsUpdatingClinic(false);
    }
  };

  // Render lưới ảnh
  const renderImages = () => {
    const totalImages = clinicImages.length;
    if (totalImages === 0) return null;
    const displayImages = clinicImages.slice(0, 4);

    return (
      <section className={`w-full grid gap-1 py-3 ${totalImages === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
        {displayImages.map((img, index) => (
          <div key={index} className="relative aspect-square overflow-hidden group cursor-pointer bg-purple-50 rounded-lg border border-pink-100" onClick={() => setCurrentImgIndex(index)}>
            <img alt="" src={img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            {index === 3 && totalImages > 4 && (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/80 to-pink-500/80 flex items-center justify-center text-white text-2xl font-bold backdrop-blur-[2px]">
                +{totalImages - 4}
              </div>
            )}
          </div>
        ))}
      </section>
    );
  };

  return createPortal(
    <div className="fixed inset-0 z-[9990] flex items-center justify-center bg-purple-950/60 backdrop-blur-sm p-4 animate-in fade-in" onClick={onClose}>
      
      {/* KHỐI GIAO DIỆN CHÍNH (Thông tin Clinic) */}
      <div className="w-full max-w-[800px] max-h-[90vh] overflow-y-auto border border-pink-100 shadow-[0_20px_50px_rgba(236,72,153,0.2)] bg-white rounded-3xl relative animate-in slide-in-from-bottom-8" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 z-50 bg-white/50 hover:bg-pink-100 text-gray-500 hover:text-pink-600 w-8 h-8 rounded-full flex items-center justify-center transition-colors">
          <CloseOutlined />
        </button>
        
        <div className="p-6 relative overflow-hidden">
          {/* Header & Body Clinic Info (Rút gọn để tập trung vào phần dưới) */}
          <Row gutter={[16, 16]} align="middle" className="mb-4 pr-8 relative z-10">
            <Col span={4} md={3}>
              <div className="h-14 w-14 bg-gradient-to-tr from-pink-500 to-purple-600 text-white flex items-center justify-center rounded-3xl font-black shadow-lg shadow-pink-200 text-lg">
                {clinicId}
              </div>
            </Col>
            <Col span={20} md={21}>
              <div className="flex flex-wrap items-center gap-3 justify-between">
                <div>
                  <h2 className="text-3xl font-black m-0 bg-gradient-to-r from-pink-600 to-purple-700 bg-clip-text text-transparent">{clinicDetails.name}</h2>
                  <p className="text-purple-500 text-xs mt-2 font-medium uppercase tracking-[0.2em]"><FieldTimeOutlined className="mr-1" /> {createdAt}</p>
                  {currentReviewCount > 0 && (
                    <p className="text-purple-500 text-xs mt-2 font-medium uppercase tracking-[0.2em] flex items-center gap-2">
                      <StarFilled className="text-pink-500" />
                      {averageRating ? `${averageRating.toFixed(1)} sao` : 'Đang cập nhật'} • {currentReviewCount} review
                    </p>
                  )}
                </div>

                {canEditClinic && (
                  <div className="flex items-center gap-2 mt-3 md:mt-0">
                    {!isEditClinicMode ? (
                      <Button type="default" icon={<EditOutlined />} onClick={handleToggleClinicEdit}>
                        Chỉnh sửa phòng khám
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button onClick={handleCancelClinicEdit}>Hủy</Button>
                        <Button type="primary" icon={<CheckOutlined />} loading={isUpdatingClinic} onClick={handleSaveClinic}>
                          Lưu thông tin
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Col>
          </Row>

          {isEditClinicMode && (
            <div className="mb-6 p-5 rounded-3xl bg-pink-50 border border-pink-100 space-y-4">
              <p className="text-sm uppercase font-black tracking-[0.2em] text-pink-600">Chỉnh sửa thông tin phòng khám</p>
              <Input
                value={editClinicValues.name}
                onChange={(e) => handleClinicFieldChange('name', e.target.value)}
                placeholder="Tên phòng khám"
              />
              <Input
                value={editClinicValues.address}
                onChange={(e) => handleClinicFieldChange('address', e.target.value)}
                placeholder="Địa chỉ phòng khám"
              />
              <Input
                value={editClinicValues.phone}
                onChange={(e) => handleClinicFieldChange('phone', e.target.value)}
                placeholder="Số điện thoại"
              />
              <Input.TextArea
                value={editClinicValues.description}
                onChange={(e) => handleClinicFieldChange('description', e.target.value)}
                rows={4}
                placeholder="Mô tả dịch vụ, giờ làm việc, thông tin bác sĩ..."
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5 bg-gradient-to-br from-pink-50/70 to-purple-50/70 p-5 rounded-3xl border border-pink-100/50">
            <div className="flex items-center gap-3 text-purple-900/80">
              <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm text-pink-500 border border-pink-100">
                <EnvironmentOutlined />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-pink-400 m-0">Địa chỉ</p>
                <p className="text-sm leading-snug text-gray-700 m-0 truncate">{address || 'Chưa có địa chỉ'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-purple-900/80">
              <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm text-purple-500 border border-purple-100">
                <PhoneOutlined />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-purple-400 m-0">Điện thoại</p>
                <p className="text-sm leading-snug text-gray-700 m-0">{clinicDetails.phone || 'Chưa có số'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-purple-900/80">
              <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm text-orange-400 border border-orange-100">
                <InfoCircleOutlined />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-orange-400 m-0">Mô tả</p>
                <p className="text-sm leading-snug text-gray-700 m-0 truncate">{description ? description.slice(0, 80) : 'Chưa có mô tả'}</p>
              </div>
            </div>
          </div>

          {description && (
            <div className="mb-6 text-purple-900/80 leading-relaxed bg-gray-50 p-5 rounded-3xl border border-pink-100 text-sm">
              <p className="font-bold uppercase text-[10px] tracking-[0.2em] text-pink-500 mb-3">Mô tả phòng khám</p>
              <p className="m-0 whitespace-pre-wrap">{clinicDetails.description}</p>
            </div>
          )}

          {renderImages()}

          <button onClick={openCommentModal} className="w-full flex items-center justify-center p-4 border-t border-pink-50 bg-white hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all text-purple-400 hover:text-pink-600 font-bold tracking-wide mt-4 rounded-b-2xl">
            <CommentOutlined className="mr-2 text-lg" /> BÌNH LUẬN & ĐÁNH GIÁ
          </button>
        </div>
      </div>

      {/* --- PORTAL IMAGE MODAL --- */}
      {currentImgIndex !== null && createPortal(
         /* ... Giữ nguyên như cũ ... */
         <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-purple-950/90 backdrop-blur-xl p-4" onClick={() => setCurrentImgIndex(null)}>
           <img src={clinicImages[currentImgIndex]} alt="Clinic" className="max-w-[85%] max-h-[85%] object-contain" onClick={(e) => e.stopPropagation()}/>
         </div>,
        document.body
      )}

      {/* --- PORTAL COMMENT & RATING MODAL --- */}
      {isCommentModalOpen && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-purple-950/80 backdrop-blur-sm p-4 animate-in fade-in" onClick={() => setIsCommentModalOpen(false)}>
          <div className="w-full max-w-[500px] h-[75vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-pink-100 animate-in slide-in-from-bottom-8" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-pink-50 flex justify-between items-center bg-gradient-to-r from-pink-50 to-purple-50">
              <h3 className="m-0 font-black text-lg bg-gradient-to-r from-pink-600 to-purple-700 bg-clip-text text-transparent">Đánh giá phòng khám</h3>
              <button onClick={() => setIsCommentModalOpen(false)} className="text-gray-400 hover:text-pink-600 transition-colors text-xl"><CloseOutlined /></button>
            </div>

            {/* DANH SÁCH BÌNH LUẬN */}
            <div className="flex-1 overflow-y-auto hide-scrollbar p-5 bg-gray-50 space-y-4 min-w-0" onScroll={handleScroll}>
              {comments.map((comment) => (
                <div key={comment.reviewId} className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 min-w-0">
                  <img src={comment.avatarUrl || comment.avatar} alt="" className="w-10 h-10 rounded-full border border-pink-200 bg-white mt-1 flex-shrink-0" />
                  
                  <div className="flex-1 min-w-0">
                    {/* TRẠNG THÁI SỬA BÌNH LUẬN */}
                    {editingCommentId === comment.reviewId ? (
                      <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-pink-400 space-y-2">
                        <Rate value={editCommentRating} onChange={setEditCommentRating} className="text-sm text-pink-500" />
                        <textarea 
                          value={editCommentText}
                          onChange={(e) => setEditCommentText(e.target.value)}
                          className="w-full bg-gray-50 border border-pink-100 rounded-lg p-2 text-sm outline-none focus:border-pink-300"
                          rows="2"
                        />
                        <div className="flex justify-end gap-2 mt-1">
                          <button onClick={() => setEditingCommentId(null)} className="text-xs text-gray-400 hover:text-gray-600 font-medium px-2 py-1">Hủy</button>
                          <button onClick={() => handleSaveEdit(comment.reviewId)} className="bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                            <CheckOutlined /> Lưu
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* TRẠNG THÁI HIỂN THỊ BÌNH THƯỜNG */
                      <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-pink-50 group relative">
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-bold text-sm text-purple-900 m-0">{comment.username}</p>
                          <Rate disabled value={comment.rating} className="text-[10px] text-pink-400" />
                        </div>
                        <p className="text-gray-600 text-[13px] m-0 leading-relaxed break-words">{comment.comment || comment.text}</p>
                        
                        {/* CÁC NÚT THAO TÁC (Chỉ hiện khi di chuột & phải là bình luận của mình) */}
                        {((comment.userId && comment.userId === effectiveUserId) || comment.username === currentUsername) && (
                          <div className="absolute -top-3 -right-2 bg-white border border-pink-100 rounded-full shadow-md flex items-center opacity-0 group-hover:opacity-100 transition-opacity px-1">
                            <button onClick={() => startEditing(comment)} className="text-blue-400 hover:text-blue-600 hover:bg-blue-50 p-1.5 rounded-full transition-colors" title="Sửa">
                              <EditOutlined className="text-xs" />
                            </button>
                            <div className="w-px h-3 bg-gray-200 mx-0.5"></div>
                            
                            {/* Dùng Popconfirm để hỏi trước khi xóa */}
                            <Popconfirm
                              title="Xóa bình luận"
                              description="Bạn có chắc chắn muốn xóa bình luận này không?"
                              okText="Xóa"
                              cancelText="Hủy"
                              okButtonProps={{ danger: true }}
                              onConfirm={() => handleDeleteComment(comment.reviewId, comment.userId, comment.username)}
                              getPopupContainer={(triggerNode) => triggerNode?.parentElement || document.body}
                              overlayStyle={{ zIndex: 1200 }}
                            >
                              <button className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-full transition-colors" title="Xóa">
                                <DeleteOutlined className="text-xs" />
                              </button>
                            </Popconfirm>
                          </div>
                        )}
                      </div>
                    )}
                    <p className="text-[10px] text-gray-400 mt-1 ml-1 font-semibold">{formatDate(comment.createdAt)}</p>
                  </div>
                </div>
              ))}
              
              {isLoadingComments && <div className="flex justify-center py-4 text-pink-500 text-2xl"><LoadingOutlined spin /></div>}
              {!hasMoreComments && comments.length > 0 && <div className="text-center py-4 text-gray-400 text-xs font-semibold italic">Đã tải toàn bộ đánh giá.</div>}
            </div>

            {/* KHU VỰC ĐĂNG BÌNH LUẬN MỚI */}
            <div className="p-4 bg-white border-t border-pink-50 flex flex-col gap-3 shadow-[0_-10px_20px_rgba(168,85,247,0.04)]">
              <div className="flex items-center gap-3 px-2">
                <span className="text-[13px] text-purple-900 font-bold uppercase tracking-wider">Đánh giá của bạn:</span>
                <Rate value={usernameRating} onChange={setUsernameRating} className="text-base text-pink-500" />
              </div>
              <div className="flex items-center gap-3">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Myusername" alt="You" className="w-10 h-10 rounded-full border border-pink-200 bg-purple-50" />
                <div className="flex-1 bg-gray-50 rounded-full px-4 py-2.5 flex items-center border border-pink-100 focus-within:border-pink-400 focus-within:bg-white transition-all shadow-inner">
                  <input 
                    type="text" 
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Trải nghiệm của bạn..." 
                    className="bg-transparent border-none outline-none w-full text-sm text-purple-900 placeholder-purple-300" 
                    onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                  />
                  <button onClick={handlePostComment} className="text-pink-500 hover:text-purple-600 transition-colors ml-2 text-lg"><SendOutlined /></button>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>,
    document.body
  );
};

export default ClinicDetailCard;