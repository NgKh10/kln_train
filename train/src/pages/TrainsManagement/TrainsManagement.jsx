import React, { useState } from 'react';
import { FiPlus, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import DataTable from '../../components/Common/DataTable';
import Modal from '../../components/Common/Modal';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import './TrainsManagement.scss';

const TrainsManagement = () => {
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState(null);
  
  // Mock data - sẽ thay bằng API call từ CSDL
  const [trains, setTrains] = useState([
    { 
      id: 1, 
      so_hieu: 'SE1', 
      ten_tau: 'Thống Nhất 1', 
      so_toa: 12, 
      trang_thai: 'hoat_dong',
      loai_toa: ['Giường nằm', 'Ghế ngồi']
    },
    { 
      id: 2, 
      so_hieu: 'SE2', 
      ten_tau: 'Thống Nhất 2', 
      so_toa: 12, 
      trang_thai: 'hoat_dong',
      loai_toa: ['Giường nằm', 'Ghế ngồi']
    },
    { 
      id: 3, 
      so_hieu: 'TN1', 
      ten_tau: 'Thuận Hải 1', 
      so_toa: 8, 
      trang_thai: 'bao_tri',
      loai_toa: ['Ghế ngồi']
    }
  ]);
  
  const columns = [
    { title: 'Mã tàu', key: 'so_hieu', width: '100px' },
    { title: 'Tên tàu', key: 'ten_tau', width: '200px' },
    { title: 'Số toa', key: 'so_toa', width: '100px' },
    { 
      title: 'Loại toa', 
      key: 'loai_toa',
      render: (value) => value.join(', ')
    },
    { 
      title: 'Trạng thái', 
      key: 'trang_thai',
      render: (value) => (
        <span className={`badge ${value === 'hoat_dong' ? 'badge-success' : 'badge-warning'}`}>
          {value === 'hoat_dong' ? 'Hoạt động' : 'Bảo trì'}
        </span>
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, row) => (
        <div className="action-buttons">
          <button className="btn-view" onClick={() => handleView(row)}>
            <FiEye />
          </button>
          <button className="btn-edit" onClick={() => handleEdit(row)}>
            <FiEdit />
          </button>
          <button className="btn-delete" onClick={() => handleDelete(row)}>
            <FiTrash2 />
          </button>
        </div>
      )
    }
  ];
  
  const handleView = (train) => {
    setSelectedTrain(train);
    setShowDetailModal(true);
  };
  
  const handleEdit = (train) => {
    setSelectedTrain(train);
    setShowAddModal(true);
  };
  
  const handleDelete = (train) => {
    if (window.confirm(`Xóa tàu ${train.so_hieu}?`)) {
      setTrains(trains.filter(t => t.id !== train.id));
    }
  };
  
  const handleAddTrain = () => {
    setSelectedTrain(null);
    setShowAddModal(true);
  };
  
  return (
    <div className="trains-management">
      <div className="page-header">
        <div>
          <h1 className="page-title">Quản lý tàu</h1>
          <p className="page-subtitle">Quản lý danh sách tàu, cấu hình toa và ghế</p>
        </div>
        <button className="btn-primary" onClick={handleAddTrain}>
          <FiPlus /> Thêm tàu mới
        </button>
      </div>
      
      {loading ? (
        <LoadingSpinner />
      ) : (
        <DataTable 
          columns={columns} 
          data={trains} 
          onRowClick={handleView}
        />
      )}
      
      {/* Add/Edit Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title={selectedTrain ? 'Sửa tàu' : 'Thêm tàu mới'} size="lg">
        <form className="train-form">
          <div className="form-row">
            <div className="form-group">
              <label>Số hiệu tàu *</label>
              <input type="text" defaultValue={selectedTrain?.so_hieu} placeholder="VD: SE1" />
            </div>
            <div className="form-group">
              <label>Tên tàu</label>
              <input type="text" defaultValue={selectedTrain?.ten_tau} placeholder="Tên tàu" />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Số toa *</label>
              <input type="number" defaultValue={selectedTrain?.so_toa} min="1" max="20" />
            </div>
            <div className="form-group">
              <label>Trạng thái</label>
              <select defaultValue={selectedTrain?.trang_thai || 'hoat_dong'}>
                <option value="hoat_dong">Hoạt động</option>
                <option value="bao_tri">Bảo trì</option>
                <option value="ngung_hoat_dong">Ngừng hoạt động</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Cấu hình toa</label>
            <div className="toa-config">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="toa-item">
                  <span>Toa {i}</span>
                  <select>
                    <option>Chọn loại toa</option>
                    <option>Giường nằm 6 khoang</option>
                    <option>Giường nằm 4 khoang</option>
                    <option>Ghế ngồi điều hòa</option>
                    <option>Ghế ngồi thường</option>
                  </select>
                </div>
              ))}
            </div>
            <button type="button" className="btn-add-toa">+ Thêm toa</button>
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Hủy</button>
            <button type="submit" className="btn-primary">Lưu lại</button>
          </div>
        </form>
      </Modal>
      
      {/* Detail Modal */}
      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="Chi tiết tàu" size="lg">
        {selectedTrain && (
          <div className="train-detail">
            <div className="detail-section">
              <h4>Thông tin chung</h4>
              <div className="detail-row">
                <span className="label">Số hiệu:</span>
                <span className="value">{selectedTrain.so_hieu}</span>
              </div>
              <div className="detail-row">
                <span className="label">Tên tàu:</span>
                <span className="value">{selectedTrain.ten_tau || '---'}</span>
              </div>
              <div className="detail-row">
                <span className="label">Số toa:</span>
                <span className="value">{selectedTrain.so_toa}</span>
              </div>
              <div className="detail-row">
                <span className="label">Trạng thái:</span>
                <span className="value">{selectedTrain.trang_thai === 'hoat_dong' ? 'Hoạt động' : 'Bảo trì'}</span>
              </div>
            </div>
            
            <div className="detail-section">
              <h4>Cấu hình toa</h4>
              <table className="toa-table">
                <thead>
                  <tr><th>STT</th><th>Loại toa</th><th>Số ghế</th><th>Cấu hình ghế</th></tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map(i => (
                    <tr key={i}>
                      <td>{i}</td>
                      <td>Giường nằm 6 khoang</td>
                      <td>54</td>
                      <td>6 khoang x 9 giường</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TrainsManagement;