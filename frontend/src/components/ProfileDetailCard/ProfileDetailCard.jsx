import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Spin, message, Modal, Form, Input, Button } from 'antd';
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';

import { getAuthUser } from '../../utils/auth';
import postService from '../../services/postService';
import userService from '../../services/userService';
// Nhớ kiểm tra lại đường dẫn import PostCard cho đúng với project của bạn
import PostCard from '../../components/PostCard/PostCard'; 

const ProfileDetailCard = ({ 
  userId, // <-- Cần thêm ID để API biết lấy bài của ai
  username, 
  avatarUrl, 
  email, 
  bio
}) => {
  const currentUser = getAuthUser() || {};
  const currentUserId = currentUser.id || currentUser.userId || null;

  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();
  const [profileInfo, setProfileInfo] = useState({ username, email, bio, avatarUrl });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(avatarUrl || '');

  useEffect(() => {
    setProfileInfo({ username, email, bio, avatarUrl });
    setAvatarPreview(avatarUrl || '');
  }, [username, email, bio, avatarUrl]);

  // State quản lý số trang cho Infinite Scroll
  const [page, setPage] = useState(1);
  const limit = 5; // Số bài viết mỗi lần tải

  // 1. GỌI API LẤY BÀI VIẾT LẦN ĐẦU (PAGE 1)
  useEffect(() => {
    const fetchInitialPosts = async () => {
      setIsInitialLoading(true);
      try {
        const response = currentUserId === userId
          ? await postService.getMyPost(0, limit)
          : await postService.getPostByUser(userId, 0, limit);

        const content = response?.content || response || [];
        setPosts(content);
        setPage(2);
        const hasNext = typeof response?.last === 'boolean' ? !response.last : content.length === limit;
        setHasMore(hasNext);
      } catch (error) {
        console.error("Lỗi tải bài viết:", error);
        message.error("Không thể tải bài viết của người dùng này.");
      } finally {
        setIsInitialLoading(false);
      }
    };

    if (userId) {
      fetchInitialPosts();
    }
  }, [userId, currentUserId]);

  // 2. HÀM LOAD THÊM DỮ LIỆU KHI CUỘN XUỐNG
  const fetchMoreData = async () => {
    try {
      const response = currentUserId === userId
        ? await postService.getMyPost(page - 1, limit)
        : await postService.getPostByUser(userId, page - 1, limit);
      const content = response?.content || response || [];
      setPosts(prev => [...prev, ...content]);
      setPage(prev => prev + 1);
      const hasNext = typeof response?.last === 'boolean' ? !response.last : content.length === limit;
      setHasMore(hasNext);
    } catch (error) {
      console.error("Lỗi tải thêm bài viết:", error);
      message.error("Lỗi kết nối khi tải thêm bài viết.");
    }
  };

  const openEditModal = () => {
    form.setFieldsValue({ email, bio });
    setAvatarFile(null);
    setAvatarPreview(profileInfo.avatarUrl || '');
    setIsModalVisible(true);
  };

  const closeEditModal = () => {
    setIsModalVisible(false);
    form.resetFields();
    setAvatarFile(null);
  };

  const handleAvatarSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      message.error('Vui lòng chọn file ảnh hợp lệ.');
      return;
    }

    setAvatarFile(file);
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
  };

  const handleUpdateProfile = async (values) => {
    setIsSubmitting(true);
    try {
      let avatarUrlToSend = profileInfo.avatarUrl;

      if (avatarFile) {
        const uploadedUrls = await userService.uploadAvatar(avatarFile);
        avatarUrlToSend = uploadedUrls?.[0] || profileInfo.avatarUrl;
      }

      const payload = {
        email: values.email,
        bio: values.bio || '',
        avatarUrl: avatarUrlToSend,
      };

      await userService.updateUserProfile(payload);
      setProfileInfo(prev => ({ ...prev, ...payload }));
      const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
      if (storedUser && typeof storedUser === 'object') {
        localStorage.setItem('user', JSON.stringify({ ...storedUser, ...payload }));
      }
      message.success('Cập nhật hồ sơ thành công.');
      closeEditModal();
    } catch (error) {
      console.error('Lỗi cập nhật hồ sơ:', error);
      message.error('Không thể cập nhật hồ sơ. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[600px] mx-auto pb-12">
      
      {/* ================= PHẦN 1: THÔNG TIN PROFILE (FLEX-COL TẬP TRUNG) ================= */}
      <div className="bg-white rounded-[2rem] border border-pink-50 shadow-sm overflow-hidden mb-6 relative">
        
        {/* Dải màu nền mỏng phía trên cho đẹp */}
        <div className="h-24 bg-gradient-to-r from-pink-300 via-pink-400 to-purple-400 w-full absolute top-0 left-0 z-0 opacity-40"></div>

        <div className="flex flex-col items-center pt-10 pb-8 px-6 relative z-10">
          
          {/* Avatar Tròn */}
          <div className="mb-4">
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt={username} 
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md bg-white"
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-md 
                              bg-gradient-to-br from-pink-100 to-purple-100 
                              text-purple-600 font-black text-4xl flex items-center justify-center">
                {username ? username.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
          </div>

          {/* Tên & Email */}
          <h2 className="text-2xl font-extrabold text-gray-800 text-center">{profileInfo.username}</h2>
          <p className="text-sm font-medium text-pink-500 flex items-center justify-center gap-1.5 mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M3 4a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2H3zm0 1.068l6.638 3.983a2 2 0 002.724 0L17 5.068V14a1 1 0 01-1 1H4a1 1 0 01-1-1V5.068z" />
            </svg>
            {profileInfo.email}
          </p>

          {/* Nút chỉnh sửa */}
          <button
            onClick={openEditModal}
            className="mt-4 bg-pink-50 text-pink-600 hover:bg-pink-100 font-bold text-sm px-5 py-2 rounded-full transition-all border border-pink-100"
          >
            Chỉnh sửa hồ sơ
          </button>

          {/* Bio (Giới thiệu) */}
          {profileInfo.bio && (
            <div className="mt-6 text-center max-w-sm">
              <p className="text-sm text-gray-600 leading-relaxed italic relative inline-block">
                <span className="font-serif text-pink-300 text-2xl absolute -top-2 -left-4">"</span>
                {profileInfo.bio}
                <span className="font-serif text-pink-300 text-2xl absolute -bottom-4 -right-4">"</span>
              </p>
            </div>
          )}
        </div>
      </div>

      <Modal
        title="Chỉnh sửa hồ sơ"
        open={isModalVisible}
        onCancel={closeEditModal}
        footer={null}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdateProfile}
          initialValues={{
            email: profileInfo.email,
            bio: profileInfo.bio,
          }}
        >
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden border border-pink-100 bg-white shadow-sm">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Preview avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-pink-50 text-pink-400">
                    <UploadOutlined className="text-2xl" />
                  </div>
                )}
              </div>
              <div>
                <label className="cursor-pointer text-sm text-pink-600 font-semibold hover:text-pink-700">
                  Tải ảnh mới
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarSelect}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">JPG, PNG tối đa 5MB.</p>
              </div>
            </div>
          </div>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email.' },
              { type: 'email', message: 'Email không hợp lệ.' },
            ]}
          >
            <Input placeholder="Email của bạn" />
          </Form.Item>

          <Form.Item label="Bio" name="bio">
            <Input.TextArea rows={4} placeholder="Giới thiệu ngắn gọn về bạn" />
          </Form.Item>

          <div className="flex justify-end gap-3">
            <Button onClick={closeEditModal}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              Lưu thay đổi
            </Button>
          </div>
        </Form>
      </Modal>

      {/* ================= PHẦN 2: BÀI VIẾT ĐÃ ĐĂNG (INFINITE SCROLL) ================= */}
      <div className="flex items-center gap-3 mb-4 px-2">
        <h3 className="text-lg font-bold text-gray-800">Bài viết đã đăng</h3>
        <div className="flex-1 h-px bg-pink-100"></div>
      </div>

      {isInitialLoading ? (
        <div className="flex justify-center p-10 text-pink-400">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 30 }} spin />} />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center p-10 bg-white rounded-2xl border border-pink-50">
          <p className="text-gray-500 font-medium">Người dùng này chưa có bài đăng nào.</p>
        </div>
      ) : (
        <InfiniteScroll
          dataLength={posts.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<div className="flex justify-center p-6"><Spin indicator={<LoadingOutlined spin />} /></div>}
          endMessage={
            <div className="text-center py-6 text-pink-400 font-medium text-sm">
              Đã hiển thị hết bài viết 🐾
            </div>
          }
        >
          <div className="space-y-6 overflow-hidden pb-4">
            {posts.map((post) => (
              <PostCard 
                key={post.postId || post.id} 
                postId={post.postId || post.id}
                username={post.username}
                createdAt={post.timestamp || post.createdAt}
                content={post.content}
                avatarUrl={post.avatarUrl}
                postImages={post.postImages || post.images || []}
                commentTotal={post.commentsCount}
              />
            ))}
          </div>
        </InfiniteScroll>
      )}

    </div>
  );
};

export default ProfileDetailCard;