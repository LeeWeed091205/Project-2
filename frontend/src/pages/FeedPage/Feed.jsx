import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Spin, Input, Select, Button, message, Modal, Upload } from 'antd';
import { 
  LoadingOutlined,
  PictureOutlined,
  SendOutlined,
  PlusOutlined,
  EditOutlined
} from '@ant-design/icons';

import PostCard from '../../components/PostCard/PostCard';
import postService from '../../services/postService';
import api from '../../services/api';

const postCategoryOptions = [
  { label: 'Thảo luận chung', value: 'GENERAL_DISCUSSION' },
  { label: 'Khoe ảnh', value: 'SHOWCASE' },
  { label: 'Sức khỏe', value: 'HEALTH_AND_MEDICAL' },
  { label: 'Dinh dưỡng', value: 'NUTRITION' },
  { label: 'Huấn luyện', value: 'TRAINING' },
  { label: 'Nhận nuôi', value: 'ADOPTION_AND_TRADE' },
  { label: 'Tin tức', value: 'NEWS_AND_EVENTS' },
];

export const Feed = ({ 
  userAvatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=GiaHuy",
  mockApiData = [] 
}) => {
  const savedUser = JSON.parse(localStorage.getItem('user') || 'null');
  const currentUserAvatar = savedUser?.avatarUrl || userAvatarUrl;
  const currentUsername = savedUser?.username || 'Bạn';

  // --- States cho Danh sách bài viết ---
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const pageSize = 6;

  // --- States cho Modal Đăng bài ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategories, setNewCategories] = useState([]);
  const [fileList, setFileList] = useState([]); // Chứa danh sách file ảnh từ Antd Upload

  // --- Logic Tải bài viết ---
  const loadPosts = useCallback(async (pageNo) => {
    try {
      const response = await postService.getAllPost(pageNo, pageSize);
      const content = response?.content || [];
      setPosts((prev) => (pageNo === 0 ? content : [...prev, ...content]));
      setHasMore(response?.last === false);
      setPage(pageNo + 1);
    } catch (error) {
      console.error('Lỗi tải bài viết:', error);
      setPosts(mockApiData);
      setHasMore(false);
    } finally {
      setIsInitialLoading(false);
    }
  }, [mockApiData, pageSize]);

  const outletContext = useOutletContext();
  const searchTerm = outletContext?.searchTerm || '';

  const filteredPosts = useMemo(() => {
    if (!searchTerm.trim()) return posts;
    const normalized = searchTerm.toLowerCase();
    return posts.filter((post) => String(post.username || '').toLowerCase().includes(normalized));
  }, [posts, searchTerm]);

  useEffect(() => {
    loadPosts(0);
  }, [loadPosts]);

  // --- Logic Xử lý Upload Ảnh ---
  const handleUploadChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const handleCreatePost = async () => {
    if (!newTitle.trim()) return message.error('Tiêu đề bài viết không được để trống.');
    if (newCategories.length === 0) return message.error('Hãy chọn ít nhất một chuyên mục.');

    setIsPosting(true);
    try {
      
      const postData = {
        title: newTitle.trim(),
        content: newContent.trim(),
        categories: newCategories,
        postImages: fileList
          .map((file) => file.url || file.response?.[0] || file.thumbUrl || '')
          .filter(Boolean),
      };

      await postService.createPost(postData);

      message.success('Đăng bài thành công!');
      resetForm();
      loadPosts(0);
    } catch (error) {
      console.error('Lỗi đăng bài:', error);
      message.error('Đăng bài thất bại. Vui lòng thử lại.');
    } finally {
      setIsPosting(false);
    }
  };

  const resetForm = () => {
    setNewTitle('');
    setNewContent('');
    setNewCategories([]);
    setFileList([]);
    setIsModalOpen(false);
  };

  const fetchMoreData = () => {
    if (!hasMore) return;
    loadPosts(page);
  };

  return (
    <div className="w-full max-w-[700px] mx-auto">
      
      {/* NÚT KÍCH HOẠT MODAL (Dạng thanh search giống FB) */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border border-pink-50 mb-6 flex items-center gap-4">
        <img alt="Avatar" className="w-10 h-10 rounded-full object-cover" src={currentUserAvatar} />
        <div 
          onClick={() => setIsModalOpen(true)}
          className="flex-1 bg-gray-100 hover:bg-gray-200 py-2.5 px-5 rounded-full text-gray-500 cursor-pointer transition-colors font-medium"
        >
          {currentUsername} ơi, bạn đang nghĩ gì thế?
        </div>
        <Button 
          type="primary" 
          shape="circle" 
          icon={<PlusOutlined />} 
          className="bg-pink-500 border-none h-10 w-10 flex items-center justify-center"
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      {/* MODAL ĐĂNG BÀI */}
      <Modal
        title={<div className="text-center font-black text-xl text-purple-700">Tạo bài viết mới</div>}
        open={isModalOpen}
        onCancel={resetForm}
        footer={null}
        centered
        width={600}
        className="custom-modal"
      >
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-3 mb-2">
            <img alt="Avatar" className="w-10 h-10 rounded-full" src={currentUserAvatar} />
            <div>
              <p className="font-bold text-gray-800 m-0">{currentUsername}</p>
              <p className="text-[10px] text-pink-500 font-bold uppercase tracking-wider m-0">Thành viên cộng đồng</p>
            </div>
          </div>

          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Tiêu đề bài viết hấp dẫn..."
            size="large"
            className="rounded-xl border-gray-200"
          />

          <Input.TextArea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Kể cho mọi người nghe câu chuyện của bạn..."
            autoSize={{ minRows: 4, maxRows: 8 }}
            className="rounded-xl border-gray-100 bg-gray-50/50"
          />

          <Select
            mode="multiple"
            value={newCategories}
            onChange={setNewCategories}
            options={postCategoryOptions}
            placeholder="Chọn chuyên mục phù hợp"
            className="w-full"
            size="large"
          />

          <div className="p-4 border border-dashed border-pink-200 rounded-2xl bg-pink-50/30">
            <p className="text-xs font-bold text-pink-400 mb-3 flex items-center gap-2">
              <PictureOutlined /> THÊM HÌNH ẢNH (TỐI ĐA 8)
            </p>
            <Upload
              customRequest={async ({ file, onError, onSuccess, onProgress }) => {
                const formData = new FormData();
                formData.append('files', file);

                try {
                  const result = await api.post('/files/upload-files', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    onUploadProgress: (event) => {
                      if (event.total > 0) {
                        onProgress({ percent: (event.loaded / event.total) * 100 });
                      }
                    },
                  });

                  const uploadedUrl = Array.isArray(result) ? result[0] : result?.[0];
                  if (uploadedUrl) {
                    onSuccess(result, file);
                    setFileList((prev) => prev.map((item) => {
                      if (item.uid === file.uid) {
                        return {
                          ...item,
                          status: 'done',
                          url: uploadedUrl,
                          response: result,
                        };
                      }
                      return item;
                    }));
                  } else {
                    throw new Error('Không nhận được URL ảnh từ server');
                  }
                } catch (error) {
                  console.error('Upload lỗi:', error);
                  message.error('Upload ảnh thất bại. Vui lòng thử lại.');
                  onError?.(error);
                }
              }}
              listType="picture-card"
              fileList={fileList}
              onChange={handleUploadChange}
              onRemove={(file) => {
                setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
              }}
              multiple={true}
              maxCount={8}
            >
              {fileList.length >= 8 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Tải lên</div>
                </div>
              )}
            </Upload>
          </div>

          <Button
            type="primary"
            block
            size="large"
            icon={<SendOutlined />}
            loading={isPosting}
            onClick={handleCreatePost}
            className="h-12 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 border-none font-bold text-lg shadow-lg shadow-pink-200"
          >
            Đăng bài ngay
          </Button>
        </div>
      </Modal>

      {/* DANH SÁCH BÀI VIẾT (Giữ nguyên logic InfiniteScroll) */}
      <div className="feed-list">
        {isInitialLoading ? (
          <div className="flex justify-center p-10 text-pink-400">
            <Spin indicator={<LoadingOutlined style={{ fontSize: 30 }} spin />} />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center p-10 bg-white rounded-[2rem] border border-pink-50 text-gray-500 shadow-sm">
            Chưa có bài viết nào trong khu vực này 🐾
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center p-10 bg-white rounded-[2rem] border border-pink-50 text-gray-500 shadow-sm">
            Không tìm thấy bài đăng phù hợp.
          </div>
        ) : (
          <InfiniteScroll
            dataLength={posts.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<div className="flex justify-center p-6"><Spin indicator={<LoadingOutlined spin />} /></div>}
            endMessage={<div className="text-center p-8 text-gray-400 italic">Bạn đã xem hết bài viết rồi!</div>}
          >
            <div className="space-y-6">
              {filteredPosts.map((post) => (
                <PostCard 
                  key={post.postId} 
                  postId={post.postId}
                  username={post.username}
                  createdAt={post.createdAt ? new Date(post.createdAt).toLocaleString('vi-VN') : ''}
                  content={post.content}
                  avatarUrl={post.avatarUrl}
                  postImages={post.postImages || []}
                  commentTotal={(post.comments || []).length}
                />
              ))}
            </div>
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
};

export default Feed;