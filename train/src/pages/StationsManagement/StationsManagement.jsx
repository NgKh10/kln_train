import React, { useState } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiSearch } from 'react-icons/fi';
import DataTable from '../../components/Common/DataTable';
import Modal from '../../components/Common/Modal';
import './StationsManagement.scss';

const StationsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  
  // Mock data - từ bảng GaTau trong CSDL
  const [stations, setStations] = useState([
    { id: 1, ma_ga: 'HNO', ten_ga: 'Ga Hà Nội', tinh_thanh: 'Hà Nội', thu_tu_tuyen: 1, do_uu_tien: 1, trang_thai: 'hoat_dong' },
    { id: 2, ma_ga: 'SGO', ten_ga: 'Ga Sài Gòn', tinh_thanh: 'TP Hồ Chí Minh', thu_tu_tuyen: 1, do_uu_tien: 1, trang_thai: 'hoat_dong' },
    { id: 3, ma_ga: 'DNA', ten_ga: 'Ga Đà Nẵng', tinh_thanh: 'Đà Nẵng', thu_tu_tuyen: 1, do_uu_tien: 2, trang_thai: 'hoat_dong' },
    { id: 4, ma_ga: 'HPH', ten_ga: 'Ga Hải Phòng', tinh_thanh: 'Hải Phòng', thu_tu_tuyen: 2, do_uu_tien: 3, trang_thai: 'hoat_dong' },
    { id: 5, ma_ga: 'VIN', ten_ga: 'Ga Vinh', tinh_thanh: 'Nghệ An', thu_tu_tuyen: 2, do_uu_tien: 3, trang_thai: 'hoat_dong' }
  ]);
  
  const getUuTienText = (level) => {
    const levels = {
      1: 'Ga đầu mối / trung tâm lớn',
      2: 'Ga tỉnh lớn',
      3: 'Ga khu vực',
      4: 'Ga huyện',
      5: 'Ga nhỏ'
    };
    return levels[level] || 'Không xác định';
  };
  
  const columns = [
    { title: 'Mã ga', key: 'ma_ga', width: '80px' },
    { title: 'Tên ga', key: 'ten_ga', width: '200px' },
    { title: 'Tỉnh/Thành', key: 'tinh_thanh', width: '150px' },
    { title: 'Thứ tự tuyến', key: 'thu_tu_tuyen', width: '100px' },
    { 
      title: 'Độ ưu tiên', 
      key: 'do_uu_tien',
      render: (value) => getUuTienText(value)
    },
    { 
      title: 'Trạng thái', 
      key: 'trang_thai',
      render: (value) => (
        <span className={`badge ${value === 'hoat_dong' ? 'badge-success' : 'badge-danger'}`}>
          {value === 'hoat_dong' ? 'Hoạt động' : 'Ngừng hoạt động'}
        </span>
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, row) => (
        <div className="action-buttons">
          <button className="btn-edit" onClick={() => handleEdit(row)}><FiEdit /></button>
          <button className="btn-delete" onClick={() => handleDelete(row)}><FiTrash2 /></button>
        </div>
      )
    }
  ];
  
  const filteredStations = stations.filter(s => 
    s.ten_ga.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.tinh_thanh.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.ma_ga.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleEdit = (station) => {
    setSelectedStation(station);
    setShowAddModal(true);
  };
  
  const handleDelete = (station) => {
    if (window.confirm(`Xóa ga ${station.ten_ga}?`)) {
      setStations(stations.filter(s => s.id !== station.id));
    }
  };
  
  return (
    <div className="stations-management">
      <div className="page-header">
        <div>
          <h1 className="page-title">Quản lý ga tàu</h1>
          <p className="page-subtitle">163 ga tàu trên toàn quốc</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          <FiPlus /> Thêm ga mới
        </button>
      </div>
      
      <div className="filter-bar">
        <div className="search-input">
          <FiSearch />
          <input 
            type="text" 
            placeholder="Tìm kiếm ga..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="stats-info">
          Tổng số: {stations.length} ga
        </div>
      </div>
      
      <DataTable columns={columns} data={filteredStations} />
      
      {/* Add/Edit Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title={selectedStation ? 'Sửa ga' : 'Thêm ga mới'}>
        <form className="station-form">
          <div className="form-group">
            <label>Mã ga (viết tắt) *</label>
            <input type="text" defaultValue={selectedStation?.ma_ga} placeholder="VD: HNO" />
          </div>
          
          <div className="form-group">
            <label>Tên ga *</label>
            <input type="text" defaultValue={selectedStation?.ten_ga} placeholder="VD: Ga Hà Nội" />
          </div>
          
          <div className="form-group">
            <label>Tỉnh/Thành phố *</label>
            <input type="text" defaultValue={selectedStation?.tinh_thanh} placeholder="VD: Hà Nội" />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Thứ tự trên tuyến</label>
              <input type="number" defaultValue={selectedStation?.thu_tu_tuyen || 1} min="1" />
            </div>
            <div className="form-group">
              <label>Độ ưu tiên</label>
              <select defaultValue={selectedStation?.do_uu_tien || 3}>
                <option value="1">Ga đầu mối / trung tâm lớn</option>
                <option value="2">Ga tỉnh lớn</option>
                <option value="3">Ga khu vực</option>
                <option value="4">Ga huyện</option>
                <option value="5">Ga nhỏ</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Trạng thái</label>
            <select defaultValue={selectedStation?.trang_thai || 'hoat_dong'}>
              <option value="hoat_dong">Hoạt động</option>
              <option value="ngung_hoat_dong">Ngừng hoạt động</option>
            </select>
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Hủy</button>
            <button type="submit" className="btn-primary">Lưu lại</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StationsManagement;