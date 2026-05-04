import React, { useState } from 'react';
import { FiSearch, FiEye, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';
import DataTable from '../../components/Common/DataTable';
import Modal from '../../components/Common/Modal';
import './Refunds.scss';

const Refunds = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState(null);
  
  // Mock data - từ bảng HoanTien trong CSDL
  const [refunds] = useState([
    {
      id: 1,
      ma_ve: 'V001',
      ma_giao_dich: 'GD001',
      khach_hang: 'Nguyễn Văn A',
      chuyen_tau: 'SE1',
      ngay_mua: '2024-01-10',
      ngay_huy: '2024-01-12',
      tien_goc: 1250000,
      phi_huy: 125000,
      tien_hoan: 1125000,
      ly_do: 'Thay đổi kế hoạch',
      trang_thai: 'completed',
      thoi_gian_hoan: '2024-01-12 14:30:00'
    },
    {
      id: 2,
      ma_ve: 'V002',
      ma_giao_dich: 'GD002',
      khach_hang: 'Trần Thị B',
      chuyen_tau: 'SE2',
      ngay_mua: '2024-01-05',
      ngay_huy: '2024-01-08',
      tien_goc: 890000,
      phi_huy: 44500,
      tien_hoan: 845500,
      ly_do: 'Tàu bị hoãn',
      trang_thai: 'completed',
      thoi_gian_hoan: '2024-01-08 09:15:00'
    },
    {
      id: 3,
      ma_ve: 'V003',
      ma_giao_dich: 'GD003',
      khach_hang: 'Lê Văn C',
      chuyen_tau: 'TN1',
      ngay_mua: '2024-01-15',
      ngay_huy: '2024-01-16',
      tien_goc: 450000,
      phi_huy: 22500,
      tien_hoan: 427500,
      ly_do: 'Đặt nhầm ngày',
      trang_thai: 'pending',
      thoi_gian_hoan: null
    }
  ]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getStatusBadge = (status) => {
    const badges = {
      completed: { class: 'status-completed', icon: <FiCheckCircle />, text: 'Đã hoàn tiền' },
      pending: { class: 'status-pending', icon: <FiClock />, text: 'Chờ xử lý' },
      cancelled: { class: 'status-cancelled', icon: <FiXCircle />, text: 'Từ chối' }
    };
    return badges[status] || badges.pending;
  };

  const columns = [
    { title: 'Mã vé', key: 'ma_ve', width: '80px' },
    { title: 'Khách hàng', key: 'khach_hang', width: '150px' },
    { title: 'Chuyến tàu', key: 'chuyen_tau', width: '80px' },
    { title: 'Ngày hủy', key: 'ngay_huy', width: '100px' },
    { 
      title: 'Tiền gốc', 
      key: 'tien_goc',
      render: (value) => formatCurrency(value)
    },
    { 
      title: 'Phí hủy', 
      key: 'phi_huy',
      render: (value) => formatCurrency(value)
    },
    { 
      title: 'Tiền hoàn', 
      key: 'tien_hoan',
      render: (value) => <span className="refund-amount">{formatCurrency(value)}</span>
    },
    { 
      title: 'Trạng thái', 
      key: 'trang_thai',
      render: (value) => {
        const status = getStatusBadge(value);
        return <span className={`status-badge ${status.class}`}>{status.icon} {status.text}</span>;
      }
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, row) => (
        <button className="btn-view" onClick={() => { setSelectedRefund(row); setShowDetailModal(true); }}>
          <FiEye /> Chi tiết
        </button>
      )
    }
  ];

  const filteredRefunds = refunds.filter(refund => {
    const matchesSearch = refund.ma_ve.includes(searchTerm) || refund.khach_hang.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || refund.trang_thai === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRefundAmount = refunds.reduce((sum, r) => sum + r.tien_hoan, 0);
  const totalFeeAmount = refunds.reduce((sum, r) => sum + r.phi_huy, 0);

  return (
    <div className="refunds-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Quản lý hủy vé & hoàn tiền</h1>
          <p className="page-subtitle">Quản lý các yêu cầu hủy vé và hoàn tiền</p>
        </div>
      </div>

      <div className="stats-summary">
        <div className="summary-card">
          <div className="summary-icon warning"><FiClock /></div>
          <div className="summary-info">
            <span className="summary-label">Chờ xử lý</span>
            <span className="summary-value">{refunds.filter(r => r.trang_thai === 'pending').length}</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon success"><FiCheckCircle /></div>
          <div className="summary-info">
            <span className="summary-label">Đã hoàn tiền</span>
            <span className="summary-value">{refunds.filter(r => r.trang_thai === 'completed').length}</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon primary"><FiXCircle /></div>
          <div className="summary-info">
            <span className="summary-label">Tổng tiền hoàn</span>
            <span className="summary-value">{formatCurrency(totalRefundAmount)}</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon danger"><FiXCircle /></div>
          <div className="summary-info">
            <span className="summary-label">Tổng phí hủy</span>
            <span className="summary-value">{formatCurrency(totalFeeAmount)}</span>
          </div>
        </div>
      </div>

      <div className="filter-bar">
        <div className="search-input">
          <FiSearch />
          <input type="text" placeholder="Tìm kiếm theo mã vé, tên KH..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">Tất cả trạng thái</option>
          <option value="pending">Chờ xử lý</option>
          <option value="completed">Đã hoàn tiền</option>
        </select>
      </div>

      <DataTable columns={columns} data={filteredRefunds} />

      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="Chi tiết yêu cầu hoàn tiền" size="md">
        {selectedRefund && (
          <div className="refund-detail">
            <div className="refund-header">
              <div className="refund-code">
                <span>Mã vé</span>
                <h3>{selectedRefund.ma_ve}</h3>
              </div>
              <div className={`refund-status ${getStatusBadge(selectedRefund.trang_thai).class}`}>
                {getStatusBadge(selectedRefund.trang_thai).text}
              </div>
            </div>

            <div className="refund-info">
              <div className="info-row">
                <span className="label">Khách hàng:</span>
                <span className="value">{selectedRefund.khach_hang}</span>
              </div>
              <div className="info-row">
                <span className="label">Chuyến tàu:</span>
                <span className="value">{selectedRefund.chuyen_tau}</span>
              </div>
              <div className="info-row">
                <span className="label">Ngày mua vé:</span>
                <span className="value">{selectedRefund.ngay_mua}</span>
              </div>
              <div className="info-row">
                <span className="label">Ngày hủy vé:</span>
                <span className="value">{selectedRefund.ngay_huy}</span>
              </div>
              <div className="info-row">
                <span className="label">Lý do hủy:</span>
                <span className="value">{selectedRefund.ly_do}</span>
              </div>
            </div>

            <div className="refund-amounts">
              <div className="amount-item">
                <span>Tiền vé gốc</span>
                <strong>{formatCurrency(selectedRefund.tien_goc)}</strong>
              </div>
              <div className="amount-item minus">
                <span>Phí hủy ({((selectedRefund.phi_huy / selectedRefund.tien_goc) * 100).toFixed(0)}%)</span>
                <strong>- {formatCurrency(selectedRefund.phi_huy)}</strong>
              </div>
              <div className="amount-item total">
                <span>Tiền hoàn lại</span>
                <strong className="refund-total">{formatCurrency(selectedRefund.tien_hoan)}</strong>
              </div>
            </div>

            {selectedRefund.trang_thai === 'pending' && (
              <div className="refund-actions">
                <button className="btn-secondary">Từ chối</button>
                <button className="btn-primary">Xác nhận hoàn tiền</button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Refunds;