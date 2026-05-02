import React, { useState, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Spin, Pagination, message, Modal, Form, Input } from 'antd'; 
import { LoadingOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import clinicService from '../../services/clinicService';
import ClinicCard from '../../components/ClinicCard/ClinicCard';
import ClinicDetailCard from '../../components/ClinicDetailCard/ClinicDetailCard';
import {formatDate} from '../../utils/index'; // Giả sử bạn có một hàm formatDate trong utils để định dạng ngày tháng

const ForumClinic = ({ isAdmin = false }) => {
  const storedUser = JSON.parse(localStorage.getItem('user') || 'null') || {};
  const currentUserId = storedUser?.id || storedUser?.userId || null;
  const authIsAdmin = Boolean(
    typeof storedUser.role === 'string'
      ? storedUser.role.toUpperCase().includes('ADMIN')
      : Array.isArray(storedUser.role)
      ? storedUser.role.some((role) => String(role).toUpperCase().includes('ADMIN'))
      : false
  );
  const effectiveIsAdmin = isAdmin || authIsAdmin;

  // State chuẩn để làm việc với API thật
  const [clinics, setClinics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0); // State lưu tổng số item để Antd phân trang
  
  const pageSize = 5;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [form] = Form.useForm();
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const outletContext = useOutletContext();
  const searchTerm = outletContext?.searchTerm || '';

  const filteredClinics = useMemo(() => {
    if (!searchTerm.trim()) return clinics;
    const normalized = searchTerm.toLowerCase();
    return clinics.filter((clinic) => {
      const name = String(clinic.name || '');
      const address = String(clinic.address || '');
      const description = String(clinic.description || '');
      return [name, address, description].some((field) => field.toLowerCase().includes(normalized));
    });
  }, [clinics, searchTerm]);

  // 1. HÀM GET: Tải danh sách phòng khám
  const fetchClinics = async (page) => {
    setIsLoading(true);
    try {
      const response = await clinicService.getAllClinics(page - 1, pageSize);
      const content = response?.content || response || [];
      const hasNext = typeof response?.last === 'boolean' ? !response.last : content.length === pageSize;

      setClinics(content);
      setTotalItems(hasNext ? page * pageSize : (page - 1) * pageSize + content.length);
    } catch (error) {
      console.error("Lỗi tải danh sách:", error);
      message.error("Không thể tải dữ liệu phòng khám.");
    } finally {
      setIsLoading(false);
    }
  };

  // Tự động gọi API khi currentPage thay đổi
  useEffect(() => {
    fetchClinics(currentPage);
  }, [currentPage]);

  // Đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 2. HÀM DELETE: Xóa phòng khám
  const handleDelete = async (e, clinicId) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!window.confirm("Bạn có chắc chắn muốn xóa phòng khám này?")) return;

    try {
      await clinicService.deleteClinic(clinicId);
      message.success('Đã xóa phòng khám thành công!');
      fetchClinics(currentPage); 
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      message.error('Xóa phòng khám thất bại!');
    }
  };

  const handleAdd = () => {
    setIsCreateModalOpen(true);
  };

  const handleCancelCreate = () => {
    setIsCreateModalOpen(false);
    form.resetFields();
  };

  const handleCreateSubmit = async (values) => {
    setIsCreating(true);
    try {
      const payload = {
        name: values.name,
        address: values.address,
        phone: values.phone,
        description: values.description,
        clinicImages: values.clinicImages
          ? values.clinicImages.split(',').map((url) => url.trim()).filter((url) => url)
          : [],
      };

      await clinicService.createClinic(payload);
      message.success('Tạo phòng khám mới thành công!');
      setIsCreateModalOpen(false);
      form.resetFields();
      setCurrentPage(1);
      fetchClinics(1);
    } catch (error) {
      console.error('Lỗi tạo phòng khám:', error);
      message.error('Tạo phòng khám thất bại!');
    } finally {
      setIsCreating(false);
    }
  };

  const openClinicDetail = async (clinicId) => {
    setIsLoadingDetail(true);
    setIsDetailOpen(true);
    try {
      const detail = await clinicService.getClinicById(clinicId);
      setSelectedClinic({ ...detail, createdAt:formatDate(detail.createdAt) });
    } catch (error) {
      console.error('Lỗi tải chi tiết phòng khám:', error);
      message.error('Không thể tải thông tin phòng khám.');
      setIsDetailOpen(false);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const closeClinicDetail = () => {
    setIsDetailOpen(false);
    setSelectedClinic(null);
  };

  return (
    <div className="w-full max-w-[800px] mx-auto pb-12 animate-fade-in">
      
      {/* Header trang */}
      <div className="mb-6 px-2 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-800">Cộng đồng Phòng Khám Thú Cưng</h1>
          <p className="text-sm text-gray-500 mt-1">Khám phá phòng khám uy tín, đọc review thực tế và đánh giá dịch vụ chăm sóc thú cưng.</p>
        </div>

        {/* Nút THÊM MỚI (Admin) */}
        {effectiveIsAdmin && (
          <button 
            onClick={handleAdd}
            className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-2 shadow-md shadow-pink-200 transition-all hover:-translate-y-0.5"
          >
            <PlusOutlined /> Thêm mới
          </button>
        )}
      </div>

      {/* Vùng hiển thị danh sách */}
      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="flex justify-center items-center h-40 text-pink-500">
            <Spin indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />} />
          </div>
        ) : filteredClinics.length === 0 ? (
          <div className="text-center p-10 bg-white rounded-2xl border border-pink-50 text-gray-500">
            Không tìm thấy phòng khám phù hợp.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredClinics.map((clinic) => (
              <div key={clinic.id || clinic.clinicId} className="relative group">
                <div 
                  onClick={() => openClinicDetail(clinic.id || clinic.clinicId)}
                  className="block outline-none cursor-pointer"
                >
                  <ClinicCard 
                    clinic={clinic}
                  />
                </div>

                {/* Nút XÓA (Admin) */}
                {effectiveIsAdmin && (
                  <button
                    onClick={(e) => handleDelete(e, clinic.id || clinic.clinicId)}
                    className="absolute top-1/2 -translate-y-1/2 right-12 z-20 
                               bg-red-50 text-red-500 w-8 h-8 rounded-full flex items-center justify-center
                               opacity-0 group-hover:opacity-100 transition-all duration-300
                               hover:bg-red-500 hover:text-white shadow-sm"
                    title="Xóa phòng khám này"
                  >
                    <DeleteOutlined />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Phân trang Antd (Sử dụng totalItems từ API thật) */}
      {!isLoading && totalItems > 0 && (
        <div className="flex justify-center items-center mt-8">
          <Pagination 
            current={currentPage} 
            pageSize={pageSize} 
            total={totalItems} // Lấy số này từ API backend trả về để antd tự biết có bao nhiêu trang
            onChange={handlePageChange} 
            showSizeChanger={false}
          />
        </div>
      )}

      <Modal
        title="Thêm mới phòng khám"
        open={isCreateModalOpen}
        onCancel={handleCancelCreate}
        footer={null}
        centered
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateSubmit}>
          <Form.Item
            name="name"
            label="Tên phòng khám"
            rules={[{ required: true, message: 'Bắt buộc nhập tên phòng khám' }]}
          >
            <Input placeholder="Tên phòng khám" />
          </Form.Item>

          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: 'Bắt buộc nhập địa chỉ' }]}
          >
            <Input placeholder="Địa chỉ phòng khám" />
          </Form.Item>

          <Form.Item name="phone" label="Số điện thoại">
            <Input placeholder="Số điện thoại liên hệ" />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={4} placeholder="Dịch vụ, thời gian làm việc, bác sĩ..." />
          </Form.Item>

          <Form.Item name="clinicImages" label="URL ảnh phòng khám (ngăn cách bằng dấu phẩy)">
            <Input placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg" />
          </Form.Item>

          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={handleCancelCreate} className="px-5 py-2 rounded-xl text-gray-600 font-bold hover:bg-gray-100 transition-colors">
              Hủy bỏ
            </button>
            <button type="submit" className="px-6 py-2 rounded-xl bg-pink-600 text-white font-bold hover:bg-pink-700 transition-colors flex items-center gap-2" disabled={isCreating}>
              {isCreating ? <Spin indicator={<LoadingOutlined style={{ color: 'white' }} spin />} /> : 'Tạo mới'}
            </button>
          </div>
        </Form>
      </Modal>

      {isDetailOpen && (
        isLoadingDetail ? (
          <Modal open centered footer={null} closable={false} bodyStyle={{ padding: '2rem' }}>
            <div className="flex justify-center py-10"><Spin indicator={<LoadingOutlined style={{ fontSize: 28 }} spin />} /></div>
          </Modal>
        ) : selectedClinic ? (
          <ClinicDetailCard {...selectedClinic} currentUserId={currentUserId} onClose={closeClinicDetail} />
        ) : null
      )}

    </div>
  );
};

export default ForumClinic;