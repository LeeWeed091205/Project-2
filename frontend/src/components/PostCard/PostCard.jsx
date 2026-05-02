import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { message, Popconfirm, Button } from 'antd';
import { 
  EllipsisOutlined, CommentOutlined, HeartFilled, 
  ShareAltOutlined, CloseOutlined, LeftOutlined, 
  RightOutlined, SendOutlined, LoadingOutlined,
  EditOutlined, DeleteOutlined, CheckOutlined
} from '@ant-design/icons';
import { getAuthUser } from '../../utils/auth';
import commentService from '../../services/commentService';

const PostCard = ({ postId,username, createdAt, content, avatarUrl, postImages = [] }) => {
  // State quản lý Image Modal
  const [currentImgIndex, setCurrentImgIndex] = useState(null);

  // State quản lý Comment Modal
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const authUser = getAuthUser() || {};
  const currentUserId = Number(authUser.id || authUser.userId) || null;

  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [commentPage, setCommentPage] = useState(0);
  const [newCommentText, setNewCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [isDeletingCommentId, setIsDeletingCommentId] = useState(null);
  const COMMENTS_PAGE_SIZE = 10;



  // --- 1. LOGIC KHÓA CUỘN NỀN (Chống cuộn xuyên thấu) ---
  useEffect(() => {
    // Nếu 1 trong 2 modal đang mở thì khóa cuộn
    if (currentImgIndex !== null || isCommentModalOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '15px'; // Bù thanh cuộn chống giật layout
    } else {
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '0px';
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '0px';
    };
  }, [currentImgIndex, isCommentModalOpen]);

  // --- 2. LOGIC IMAGE MODAL ---
  const showNext = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % postImages.length);
  };
  const showPrev = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + postImages.length) % postImages.length);
  };

  // --- 3. LOGIC COMMENT MODAL (Infinite Scroll) ---
  const fetchComments = async () => {
    if (!postId || isLoadingComments || !hasMoreComments) return;
    setIsLoadingComments(true);

    try {
      const response = await commentService.getCommentsByPost(postId, commentPage, COMMENTS_PAGE_SIZE);
      const fetchedComments = response?.content || response || [];

      setComments((prev) => [...prev, ...fetchedComments]);
      setHasMoreComments(response?.last === false || response?.last === undefined ? true : !response.last);
      setCommentPage((prev) => prev + 1);
    } catch (error) {
      console.error('Fetch comments error:', error);
      message.error('Không tải được bình luận. Vui lòng thử lại.');
    } finally {
      setIsLoadingComments(false);
    }
  };

  const openCommentModal = () => {
    setIsCommentModalOpen(true);
    if (comments.length === 0) fetchComments(); // Lần đầu mở thì fetch luôn
  };

  const handlePostComment = async () => {
    const text = newCommentText.trim();
    if (!text || !postId) return;

    setIsSubmittingComment(true);
    try {
    const response = await commentService.createComment({ content: text }, postId);
    console.log('Create comment response:', response);
      message.success('Bình luận của bạn đã được gửi.');
      setNewCommentText('');
      
   
      setComments((prev) => [response,...prev]);
      // setCommentPage(0);
      // setHasMoreComments(true);
      // setEditingCommentId(null);  
      // setEditCommentText('');
      // fetchComments();
    } catch (error) {
      console.error('Post comment failed:', error);
      message.error('Gửi bình luận không thành công. Vui lòng thử lại.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleStartEdit = (comment) => {
    setEditingCommentId(Number(comment.commentId));
    setEditCommentText(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditCommentText('');
  };

  const handleSaveEdit = async (commentId) => {
    const text = editCommentText.trim();
    if (!text || !commentId) return;

    try {
      await commentService.updateComment(commentId, { content: text });
      setComments((prev) => prev.map((item) => Number(item.commentId) === Number(commentId) ? { ...item, content: text } : item));
      setEditingCommentId(null);
      setEditCommentText('');
      message.success('Cập nhật bình luận thành công.');
    } catch (error) {
      console.error('Update comment failed:', error);
      message.error('Cập nhật bình luận thất bại.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!commentId) return;
    setIsDeletingCommentId(Number(commentId));
    try {
      await commentService.deleteComment(commentId);
      setComments((prev) => prev.filter((item) => Number(item.commentId) !== Number(commentId)));

      setEditingCommentId(null);
      message.success('Đã xóa bình luận.');
    } catch (error) {
      console.error('Delete comment failed:', error);
      message.error('Xóa bình luận thất bại.');
    } finally {
      setIsDeletingCommentId(null);
    }
  };

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    // Cuộn cách đáy 50px thì fetch thêm
    if (scrollHeight - scrollTop <= clientHeight + 50) {
      fetchComments();
    }
  };

  // --- Render Lưới Ảnh Facebook Style ---
  const renderGrid = () => {
    const total = postImages.length;
    if (total === 0) return null;
    const displayImages = postImages.slice(0, 4);

    return (
      <section className={`w-full grid gap-1 mt-4 rounded-[1.5rem] overflow-hidden border border-pink-50 ${total === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
        {displayImages.map((img, index) => (
          <div 
            key={index} 
            className="relative aspect-square overflow-hidden cursor-pointer group bg-purple-50"
            onClick={() => setCurrentImgIndex(index)}
          >
            <img src={img} alt="Post content" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            {index === 3 && total > 4 && (
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 to-pink-600/40 flex items-center justify-center text-white text-2xl font-black backdrop-blur-[1px]">
                +{total - 4}
              </div>
            )}
            <div className="absolute inset-0 bg-pink-100/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
        ))}
      </section>
    );
  };

  return (
    <div className="bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-pink-200 via-purple-100 to-white w-[100%] max-w-[600px] mx-auto rounded-[2rem] p-6 shadow-[0_15px_40px_rgba(168,85,247,0.1)] border border-pink-100 relative mb-4 transition-all hover:shadow-pink-200/30">
      
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-pink-100/30 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-center mb-5 relative z-10">
        <div className="flex items-center gap-4">
          <img src={avatarUrl} alt={username} className="w-14 h-14 rounded-full object-cover border-4 border-pink-200 p-1 shadow-md shadow-pink-100 bg-white" />
          <div>
            <h3 className="text-base font-black text-gray-800 m-0 bg-gradient-to-r from-pink-600 to-purple-700 bg-clip-text text-transparent leading-none">{username}</h3>
            <p className="text-[11px] text-purple-500 m-0 mt-1 italic font-medium opacity-80">{createdAt}</p>
          </div>
        </div>
        <button className="w-10 h-10 flex items-center justify-center text-purple-400 hover:text-pink-600 transition-colors text-xl bg-white/50 backdrop-blur-sm rounded-full">
          <EllipsisOutlined />
        </button>
      </div>

      {/* Content Section */}
      <div className="mb-5 relative z-10 text-purple-950/80 leading-relaxed text-[13px] italic px-1">
        <p className="m-0 whitespace-pre-wrap">{content}</p>
        {renderGrid()}
      </div>

      {/* Actions (Like/Comment/Share) */}
      <div className="flex justify-between items-center pt-4 border-t border-dashed border-pink-300 text-purple-900/60 font-black text-[11px] tracking-widest relative z-10">
        <div className="flex gap-7">

          <button 
            onClick={openCommentModal} // Gọi hàm mở Modal Bình Luận
            className="flex items-center gap-2.5 hover:text-purple-700 transition-colors"
          >
            <CommentOutlined className="text-purple-500" /> BÌNH LUẬN
          </button>
        </div>
        <button className="text-indigo-500 hover:text-indigo-700 transition-colors text-lg">
          <ShareAltOutlined />
        </button>
      </div>

      {/* ========================================= */}
      {/* 1. PORTAL IMAGE MODAL */}
      {/* ========================================= */}
      {currentImgIndex !== null && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-purple-950/95 backdrop-blur-xl p-4 animate-in fade-in" onClick={() => setCurrentImgIndex(null)}>
          <button className="absolute top-8 right-8 text-pink-200 hover:text-white text-4xl hover:rotate-90 z-10 transition-transform"><CloseOutlined /></button>
          {postImages.length > 1 && (
            <>
              <button className="absolute left-6 text-white/50 hover:text-white text-5xl p-4 transition-all hover:scale-125 z-10" onClick={showPrev}><LeftOutlined /></button>
              <button className="absolute right-6 text-white/50 hover:text-white text-5xl p-4 transition-all hover:scale-125 z-10" onClick={showNext}><RightOutlined /></button>
            </>
          )}
          <div className="relative w-2/3 h-2/3 flex flex-col items-center">
            <img src={postImages[currentImgIndex]} alt="Enlarged Post" className="max-w-full max-h-full object-contain rounded-2xl shadow-[0_0_60px_rgba(236,72,153,0.3)] animate-in zoom-in-95 border border-white/10 select-none" onClick={(e) => e.stopPropagation()} />
            <div className="mt-6 px-5 py-1.5 bg-pink-500/20 backdrop-blur-md rounded-full border border-pink-400/30 text-pink-100 font-bold tracking-tighter">
              {currentImgIndex + 1} / {postImages.length}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================= */}
      {/* 2. PORTAL COMMENT MODAL (Infinite Scroll) */}
      {/* ========================================= */}
      {isCommentModalOpen && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-purple-950/60 backdrop-blur-sm p-4 animate-in fade-in" onClick={() => setIsCommentModalOpen(false)}>
          <div 
            className="w-full max-w-[500px] h-[75vh] bg-white rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-pink-100 animate-in slide-in-from-bottom-8"
            onClick={(e) => e.stopPropagation()} // Click vào khung modal không bị đóng
          >
            {/* Header Modal */}
            <div className="p-5 border-b border-pink-100 flex justify-between items-center bg-gradient-to-r from-pink-50 to-purple-50">
              <h3 className="m-0 font-black text-lg bg-gradient-to-r from-pink-600 to-purple-700 bg-clip-text text-transparent">
                Bình luận bài viết
              </h3>
              <button onClick={() => setIsCommentModalOpen(false)} className="text-purple-300 hover:text-pink-600 transition-colors text-2xl">
                <CloseOutlined />
              </button>
            </div>

            {/* Vùng Cuộn Bình Luận */}
            <div className="flex-1 overflow-y-auto p-5 bg-white space-y-5" onScroll={handleScroll}>
              {comments.map((comment) => {
                const commentUserId = Number(comment.userId) || null;
                const isOwner = commentUserId && commentUserId === currentUserId;
                const isEditing = Number(editingCommentId) === Number(comment.commentId);
                const isDeleting = Number(isDeletingCommentId) === Number(comment.commentId);
                return (
                  <div key={comment.commentId} className="flex gap-3 animate-in fade-in">
                    <img src={comment.avatarUrl || comment.avatar} alt="Avatar" className="w-10 h-10 rounded-full border border-pink-200 bg-gray-50" />
                    <div className="flex-1">
                      <div className="bg-purple-50/50 p-3.5 rounded-2xl rounded-tl-none border border-pink-50/50 relative">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="font-bold text-sm text-purple-900 m-0">{comment.username}</p>
                            {isEditing ? (
                              <textarea
                                value={editCommentText}
                                onChange={(e) => setEditCommentText(e.target.value)}
                                className="w-full mt-3 bg-white border border-purple-200 rounded-xl p-3 text-sm text-purple-900 outline-none focus:border-pink-300"
                                rows={3}
                              />
                            ) : (
                              <p className="text-gray-700 text-[13px] m-0 mt-1 whitespace-pre-wrap">{comment.content}</p>
                            )}
                          </div>
                          {isOwner && (
                            <div className="flex items-center gap-1 text-gray-400 text-xs">
                              {isEditing ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleSaveEdit(comment.commentId)}
                                    className="text-pink-600 hover:text-pink-700 transition-colors"
                                    title="Lưu"
                                  >
                                    <CheckOutlined />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                    title="Hủy"
                                  >
                                    <CloseOutlined />
                                  </button>
                                </>
                              ) : (
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleStartEdit(comment)}
                                    className="text-purple-500 hover:text-purple-700 transition-colors"
                                    title="Sửa"
                                  >
                                    <EditOutlined />
                                  </button>
                                  <Popconfirm
                                    title="Xóa bình luận này?"
                                    description="Hành động này không thể hoàn tác."
                                    onConfirm={() => handleDeleteComment(comment.commentId)}
                                    okText="Xóa"
                                    cancelText="Hủy"
                                    placement="topRight"
                                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                    okButtonProps={{ danger: true }}
                                    icon={<DeleteOutlined />}
                                    destroyTooltipOnHide
                                    disabled={isDeleting}
                                  >
                                    <Button
                                      type="text"
                                      icon={<DeleteOutlined />}
                                      className="text-red-500 hover:text-red-700 transition-colors"
                                      title="Xóa"
                                      disabled={isDeleting}
                                    />
                                  </Popconfirm>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-[10px] text-purple-300 mt-1 ml-1 font-bold uppercase tracking-widest">
                        {comment.createdAt ? new Date(comment.createdAt).toLocaleString('vi-VN') : ''}
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Icon Loading */}
              {isLoadingComments && (
                <div className="flex justify-center py-4 text-pink-400 text-2xl">
                  <LoadingOutlined spin />
                </div>
              )}

              {/* Thông báo hết dữ liệu */}
              {!hasMoreComments && (
                <div className="text-center py-4 text-purple-300 text-[11px] font-bold uppercase tracking-widest">
                  Đã tải toàn bộ bình luận
                </div>
              )}
            </div>

            {/* Thanh Input Nhập Bình Luận */}
            <div className="p-4 bg-white border-t border-pink-50 flex items-center gap-3 shadow-[0_-5px_15px_rgba(168,85,247,0.03)]">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=MyUser" alt="You" className="w-10 h-10 rounded-full border border-pink-200 bg-gray-50" />
              <div className="flex-1 bg-purple-50/50 rounded-full px-5 py-3 flex items-center border border-pink-100 focus-within:border-pink-400 focus-within:bg-white transition-all shadow-inner">
                  <input
                    type="text"
                    placeholder="Viết bình luận của bạn..."
                    className="bg-transparent border-none outline-none w-full text-[13px] text-purple-900 placeholder-purple-300"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                  />
                  <button
                    onClick={handlePostComment}
                    disabled={isSubmittingComment || !newCommentText.trim()}
                    className={`text-pink-400 hover:text-purple-600 transition-colors ml-3 text-lg ${isSubmittingComment ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <SendOutlined />
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

    </div>
  );
};

export default PostCard;