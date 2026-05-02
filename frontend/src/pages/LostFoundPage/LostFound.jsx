import React, { useState, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Spin, Pagination, message, Popconfirm, Modal, Form, Input, DatePicker, Upload } from 'antd'; 
import { LoadingOutlined, PlusOutlined, DeleteOutlined, UploadOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import api from '../../services/api';
import lostPetService from '../../services/lostPetService';
import { getAuthUser } from '../../utils/auth';
// NHỚ CHỈNH LẠI ĐƯỜNG DẪN IMPORT CHO ĐÚNG VỚI FOLDER CỦA BRO
import LostPetCard from '../../components/LostPetCard/LostPetCard';

const { TextArea } = Input;

const LostFound = ({ isAdmin = false, currentUserId }) => {
  const authUser = getAuthUser() || {};
  const authUserId = authUser.id || authUser.userId || null;
  const authIsAdmin = Boolean(
    typeof authUser.role === 'string'
      ? authUser.role.toUpperCase().includes('ADMIN')
      : Array.isArray(authUser.role)
      ? authUser.role.some((role) => String(role).toUpperCase().includes('ADMIN'))
      : false
  );
  const effectiveUserId = currentUserId || authUserId;
  const effectiveIsAdmin = isAdmin || authIsAdmin;
  const outletContext = useOutletContext();
  const searchTerm = outletContext?.searchTerm || '';
  // ==========================================
  // STATES QUẢN LÝ DANH SÁCH & PHÂN TRANG
  // ==========================================
  const [lostPets, setLostPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0); 
  const pageSize = 5;

  const filteredLostPets = useMemo(() => {
    if (!searchTerm.trim()) return lostPets;
    const normalized = searchTerm.toLowerCase();
    return lostPets.filter((pet) => String(pet.petname || pet.name || '').toLowerCase().includes(normalized));
  }, [lostPets, searchTerm]);

  // ==========================================
  // STATES QUẢN LÝ MODAL ĐĂNG TIN
  // ==========================================
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [editingPet, setEditingPet] = useState(null);
  const [form] = Form.useForm(); // Hook quản lý form của Ant Design

  // ==========================================
  // 1. API: LẤY DANH SÁCH RÚT GỌN (BASIC DTO)
  // ==========================================
  const fetchLostPets = async (page) => {
    setIsLoading(true);
    try {
      const response = await lostPetService.getAllLostPet(page - 1, pageSize);
      const content = response?.content || response || [];
      const hasNext = typeof response?.last === 'boolean' ? !response.last : content.length === pageSize;

      setLostPets(content);
      setTotalItems(hasNext ? page * pageSize : (page - 1) * pageSize + content.length);
    } catch (error) {
      console.error("Lỗi tải danh sách:", error);
      message.error("Không thể tải danh sách thú cưng.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLostPets(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ==========================================
  // 2. API: ADMIN XÓA BÀI VIẾT TỪ NGOÀI DANH SÁCH
  // ==========================================
  const handleDelete = async (petId) => {
    try {
      await lostPetService.deleteLostPet(petId);
      message.success('Đã xóa bài đăng thành công!');
      fetchLostPets(currentPage); 
    } catch (error) {
      console.error('Lỗi xóa bài đăng:', error);
      message.error('Xóa bài đăng thất bại!');
    }
  };

  // ==========================================
  // 3. API: ĐĂNG TIN TÌM THÚ CƯNG
  // ==========================================
  const resetModal = () => {
    setIsCreateModalOpen(false);
    setEditingPet(null);
    form.resetFields();
    setFileList([]);
  };

  const handleUploadChange = ({ fileList: nextFileList }) => {
    setFileList(nextFileList);
  };

  const handleOpenEdit = async (petId) => {
    try {
      const data = await lostPetService.getLostPetDetailInfo(petId);
      const values = {
        petname: data.petname,
        lostdate: data.lostdate ? dayjs(data.lostdate) : null,
        species: data.species,
        breed: data.breed,
        contact: data.contact,
        status: data.status,
        location: data.location,
        description: data.description,
      };

      form.setFieldsValue(values);
      setFileList(
        (data.lostpetImages || []).map((url, index) => ({
          uid: `existing-${index}`,
          name: `image-${index}`,
          status: 'done',
          url,
        }))
      );
      setEditingPet({ lostpetId: petId, original: data });
      setIsCreateModalOpen(true);
    } catch (error) {
      console.error('Lỗi tải dữ liệu sửa bài:', error);
      message.error('Không thể tải dữ liệu bài viết để sửa.');
    }
  };

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...values,
        lostdate: values.lostdate ? values.lostdate.format('YYYY-MM-DDTHH:mm:ss') : null,
        lostpetImages: fileList
          .map((file) => file.url || file.response?.[0] || file.thumbUrl || '')
          .filter(Boolean),
      };

      if (editingPet) {
        await lostPetService.updateLostPet(editingPet.lostpetId, payload);
        message.success('Cập nhật bài đăng thành công!');
      } else {
        payload.createdAt = new Date().toISOString().slice(0, 19);
        await lostPetService.createLostPet(payload);
        message.success('Đăng tin thành công!');
      }

      resetModal();
      if (currentPage === 1) fetchLostPets(1);
      else setCurrentPage(1);
    } catch (error) {
      console.error('Lỗi lưu bài đăng:', error);
      message.error(editingPet ? 'Cập nhật bài đăng thất bại, vui lòng thử lại.' : 'Đăng tin thất bại, vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[800px] mx-auto pb-12 animate-fade-in">
      
      {/* ================= HEADER TRANG ================= */}
      <div className="mb-6 px-2 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">Cộng Đồng Tìm Thú Cưng</h1>
          <p className="text-sm text-gray-500 mt-1">Kết nối và lan tỏa thông tin để đưa các bé về nhà</p>
        </div>

        <button 
          onClick={() => {
            resetModal();
            setIsCreateModalOpen(true);
          }}
          className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 shadow-[0_8px_20px_rgba(236,72,153,0.3)] transition-all hover:-translate-y-1"
        >
          <PlusOutlined /> Đăng tin
        </button>
      </div>

      {/* ================= DANH SÁCH BÀI ĐĂNG ================= */}
      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-64 text-pink-500">
            <Spin indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />} />
            <p className="mt-4 font-semibold opacity-70 animate-pulse">Đang tải danh sách...</p>
          </div>
        ) : filteredLostPets.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-[2rem] border border-pink-50 shadow-sm text-gray-400 font-medium">
            Không tìm thấy thú cưng phù hợp.
          </div>
        ) : (
          <div className="space-y-2">
            {filteredLostPets.map((pet) => (
              <div key={pet.lostpetId || pet.id} className="relative group">
                
                {/* Component LostPetCard nhận cục data rút gọn (basicInfo)
                  Khi click vào nó sẽ tự xử lý việc load Detail API
                */}
                <LostPetCard 
                  basicInfo={pet} 
                  currentUserId={effectiveUserId} 
                />

                {/* NÚT SỬA/XÓA CHO ADMIN HOẶC CHỦ BÀI ĐĂNG */}
                {(
                  effectiveIsAdmin ||
                  String(pet.userId || pet.user?.userId || '') === String(effectiveUserId || '')
                ) && (
                  <div className="absolute top-1/2 -translate-y-1/2 right-4 z-20 flex items-center gap-2 opacity-100 transition-all duration-300 scale-100 md:scale-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEdit(pet.lostpetId || pet.id);
                      }}
                      className="bg-white text-blue-500 w-10 h-10 rounded-full flex items-center justify-center border border-blue-100 hover:bg-blue-50 shadow-sm"
                      title="Sửa bài đăng"
                    >
                      <EditOutlined />
                    </button>
                    <Popconfirm
                      title="Xóa bài đăng này?"
                      onConfirm={(e) => {
                        e.stopPropagation(); // Ngăn click lan xuống Card
                        handleDelete(pet.lostpetId || pet.id);
                      }}
                      onCancel={(e) => e.stopPropagation()} 
                      okText="Xóa"
                      cancelText="Hủy"
                      okButtonProps={{ danger: true }}
                    >
                      <button
                        onClick={(e) => e.stopPropagation()} // Ngăn click mở Modal Detail
                        className="bg-red-50 text-red-500 w-10 h-10 rounded-full flex items-center justify-center border border-red-100 hover:bg-red-500 hover:text-white shadow-lg"
                      >
                        <DeleteOutlined />
                      </button>
                    </Popconfirm>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= PHÂN TRANG ================= */}
      {!isLoading && totalItems > 0 && (
        <div className="flex justify-center items-center mt-10">
          <Pagination 
            current={currentPage} 
            pageSize={pageSize} 
            total={totalItems} 
            onChange={handlePageChange} 
            showSizeChanger={false}
          />
        </div>
      )}

      {/* ================= MODAL ĐĂNG TIN (FORM) ================= */}
      <Modal
        title={<span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">{editingPet ? 'Cập nhật tin thú cưng' : 'Đăng tin thú cưng đi lạc'}</span>}
        open={isCreateModalOpen}
        onCancel={resetModal}
        footer={null} 
        centered
        width={650}
        className="custom-modal-radius"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-6"
          initialValues={{ status: 'LOST' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
            <Form.Item name="petname" label={<span className="font-bold text-gray-700">Tên thú cưng</span>} rules={[{ required: true, message: "Bắt buộc nhập" }]}>
              <Input placeholder="Mochi, Lu..." className="rounded-xl px-4 py-2.5 border-pink-100 focus:border-pink-400 bg-gray-50 focus:bg-white" />
            </Form.Item>

            <Form.Item name="lostdate" label={<span className="font-bold text-gray-700">Thời gian đi lạc</span>} rules={[{ required: true, message: "Bắt buộc chọn" }]}>
              <DatePicker showTime format="DD/MM/YYYY HH:mm" className="w-full rounded-xl px-4 py-2.5 border-pink-100 focus:border-pink-400 bg-gray-50 focus:bg-white" placeholder="Chọn ngày giờ" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
            <Form.Item name="species" label={<span className="font-bold text-gray-700">Loài</span>} rules={[{ required: true, message: "Bắt buộc nhập" }]}>
              <Input placeholder="Chó, Mèo..." className="rounded-xl px-4 py-2.5 border-pink-100 focus:border-pink-400 bg-gray-50 focus:bg-white" />
            </Form.Item>

            <Form.Item name="breed" label={<span className="font-bold text-gray-700">Giống (Không bắt buộc)</span>}>
              <Input placeholder="Poodle, Corgi..." className="rounded-xl px-4 py-2.5 border-pink-100 focus:border-pink-400 bg-gray-50 focus:bg-white" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
            <Form.Item name="contact" label={<span className="font-bold text-gray-700">Thông tin liên hệ</span>} rules={[{ required: true, message: "Bắt buộc nhập" }]}>
              <Input placeholder="SĐT, Zalo..." className="rounded-xl px-4 py-2.5 border-pink-100 focus:border-pink-400 bg-gray-50 focus:bg-white" />
            </Form.Item>

            <Form.Item name="status" label={<span className="font-bold text-gray-700">Trạng thái</span>} rules={[{ required: true }]}>
              <select className="w-full rounded-xl px-4 py-3 border border-pink-100 text-gray-700 outline-none focus:border-pink-400 bg-gray-50 focus:bg-white transition-colors cursor-pointer">
                <option value="LOST">Đang đi lạc (LOST)</option>
                <option value="FOUND">Đã tìm thấy (FOUND)</option>
              </select>
            </Form.Item>
          </div>

          <Form.Item name="location" label={<span className="font-bold text-gray-700">Khu vực đi lạc</span>} rules={[{ required: true, message: "Bắt buộc nhập" }]}>
            <Input placeholder="Đường, Phố, Quận..." className="rounded-xl px-4 py-2.5 border-pink-100 focus:border-pink-400 bg-gray-50 focus:bg-white" />
          </Form.Item>

          <Form.Item name="description" label={<span className="font-bold text-gray-700">Đặc điểm nhận dạng chi tiết</span>}>
            <TextArea rows={3} placeholder="Màu lông, cân nặng, vòng cổ, vết bớt..." className="rounded-xl px-4 py-2.5 border-pink-100 focus:border-pink-400 bg-gray-50 focus:bg-white custom-scrollbar" />
          </Form.Item>

          <Form.Item label={<span className="font-bold text-gray-700">Hình ảnh thú cưng</span>}>
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
                  if (!uploadedUrl) {
                    throw new Error('Không nhận được URL ảnh từ server');
                  }

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
                  onSuccess(result, file);
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
              multiple
              maxCount={8}
            >
              {fileList.length >= 8 ? null : (
                <div className="max-h-full border-2 border-dashed border-pink-200 rounded-2xl p-6 flex flex-col items-center justify-center text-pink-400 bg-pink-50/50 hover:bg-pink-100/50 cursor-pointer transition-colors">
                  <UploadOutlined className="text-3xl mb-2" />
                  <span className="text-sm font-medium">Click để tải ảnh lên</span>
                </div>
              )}
            </Upload>
          </Form.Item>

          <div className="flex justify-end gap-3 mt-6 pt-4">
            <button type="button" onClick={resetModal} className="px-6 py-2.5 rounded-xl text-gray-500 font-bold hover:bg-gray-100 transition-colors">
              Hủy bỏ
            </button>
            <button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold px-8 py-2.5 rounded-xl shadow-lg shadow-pink-200 transition-all flex items-center justify-center min-w-[130px] hover:-translate-y-0.5">
              {isSubmitting ? <Spin indicator={<LoadingOutlined style={{ color: 'white' }} spin />} /> : 'Đăng tin'}
            </button>
          </div>
        </Form>
      </Modal>

    </div>
  );
};

export default LostFound;