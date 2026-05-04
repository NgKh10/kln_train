import React, { useState } from 'react';
import { FiSearch, FiFilter, FiDownload, FiEye } from 'react-icons/fi';
import DataTable from '../../components/Common/DataTable';
import Modal from '../../components/Common/Modal';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import './TicketsManagement.scss';

const TicketsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  
  // Mock data - từ bảng Ve, DonDatVe, ChuyenTau
  const [tickets] = useState([
    { 
      id: 'V001', 
      ma_ve: 1001,
      hanh_khach: 'Nguyễn Văn A',
      chuyen_tau: 'SE1',
      ngay_di: '2024-01-20',
      ga_len: 'Hà Nội',
      ga_xuong: 'Sài Gòn',
      loai_ghe: 'Giường nằm 6 khoang',
      so_ghe: 'Toa 3 - Khoang 2 - Giường 5',
      gia_ve: 1250000,
      trang_thai: 'da_su_dung',
      ngay_dat: '2024-01-10'
    },
    { 
      id: 'V002', 
      ma_ve: 1002,
      hanh_khach: 'Trần Thị B',
      chuyen_tau: 'SE2',
      ngay_di: '2024-01-21',
      ga_len: 'Đà Nẵng',
      ga_xuong: 'Hà Nội',
      loai_ghe: 'Ghế ngồi điều hòa',
      so_ghe: 'Toa 5 - Ghế 12A',
      gia_ve: 890000,
      trang_thai: 'hieu_luc',
      ngay_dat: '2024-01-15'
    },
    { 
      id: 'V003', 
      ma_ve: 1003,
      hanh_khach: 'Lê Văn C',
      chuyen_tau: 'TN1',
      ngay_di: '2024-01-19',
      ga_len: 'Hải Phòng',
      ga_xuong: 'Vinh',
      loai_ghe: 'Ghế cứng',
      so_ghe: 'Toa 2 - Ghế 8B',
      gia_ve: 350000,
      trang_thai: 'da_huy',
      ngay_dat: '2024-01-05'
    }
  ]);
  
  const getStatusText = (status) => {
    const statuses = {
      hieu_luc: { text: 'Có hiệu lực', class: 'badge-success' },
      da_su_dung: { text: 'Đã sử dụng', class: 'badge-info' },
      da_huy: { text: 'Đã hủy', class: 'badge-danger' },
      het_han: { text: 'Hết hạn', class: 'badge-warning' }
    };
    return statuses[status] || { text: status, class: 'badge-secondary' };
  };
  
  const columns = [
    { title: 'Mã vé', key: 'id', width: '80px' },
    { title: 'Khách hàng', key: 'hanh_khach', width: '150px' },
    { title: 'Chuyến tàu', key: 'chuyen_tau', width: '80px' },
    { title: 'Ngày đi', key: 'ngay_di', width: '100px' },
    { title: 'Hành trình', key: 'ga_len', width: '200px', render: (_, row) => `${row.ga_len} → ${row.ga_xuong}` },
    { title: 'Loại ghế', key: 'loai_ghe', width: '150px' },
    { 
      title: 'Giá vé', 
      key: 'gia_ve',
      render: (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
    },
    { 
      title: 'Trạng thái', 
      key: 'trang_thai',
      render: (value) => {
        const status = getStatusText(value);
        return <span className={`badge ${status.class}`}>{status.text}</span>;
      }
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, row) => (
        <button className="btn-view" onClick={() => handleView(row)}>
          <FiEye /> Chi tiết
        </button>
      )
    }
  ];
  
  const handleView = (ticket) => {
    setSelectedTicket(ticket);
    setShowDetailModal(true);
  };
  
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.id.includes(searchTerm) || 
                          ticket.hanh_khach.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.trang_thai === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };
  
  return (
    <div className="tickets-management">
      <div className="page-header">
        <div>
          <h1 className="page-title">Quản lý vé</h1>
          <p className="page-subtitle">Quản lý toàn bộ vé đã bán, vé đang có hiệu lực</p>
        </div>
        <button className="btn-primary" onClick={() => window.location.href = '/admin/reports'}>
          <FiDownload /> Xuất báo cáo
        </button>
      </div>
      
      <div className="filter-bar">
        <div className="search-input">
          <FiSearch />
          <input 
            type="text" 
            placeholder="Tìm kiếm theo mã vé, tên KH..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <FiFilter />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">Tất cả trạng thái</option>
            <option value="hieu_luc">Có hiệu lực</option>
            <option value="da_su_dung">Đã sử dụng</option>
            <option value="da_huy">Đã hủy</option>
          </select>
        </div>
      </div>
      
      <DataTable columns={columns} data={filteredTickets} />
      
      {/* Ticket Detail Modal */}
      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="Chi tiết vé" size="md">
        {selectedTicket && (
          <div className="ticket-detail">
            <div className="ticket-header">
              <div className="ticket-code">
                <span>Mã vé</span>
                <h2>{selectedTicket.id}</h2>
              </div>
              <div className={`ticket-status ${getStatusText(selectedTicket.trang_thai).class}`}>
                {getStatusText(selectedTicket.trang_thai).text}
              </div>
            </div>
            
            <div className="ticket-info">
              <div className="info-row">
                <span className="label">Khách hàng:</span>
                <span className="value">{selectedTicket.hanh_khach}</span>
              </div>
              <div className="info-row">
                <span className="label">Chuyến tàu:</span>
                <span className="value">{selectedTicket.chuyen_tau}</span>
              </div>
              <div className="info-row">
                <span className="label">Ngày khởi hành:</span>
                <span className="value">{selectedTicket.ngay_di}</span>
              </div>
              <div className="info-row">
                <span className="label">Ga lên tàu:</span>
                <span className="value">{selectedTicket.ga_len}</span>
              </div>
              <div className="info-row">
                <span className="label">Ga xuống tàu:</span>
                <span className="value">{selectedTicket.ga_xuong}</span>
              </div>
              <div className="info-row">
                <span className="label">Loại ghế:</span>
                <span className="value">{selectedTicket.loai_ghe}</span>
              </div>
              <div className="info-row">
                <span className="label">Vị trí ghế:</span>
                <span className="value">{selectedTicket.so_ghe}</span>
              </div>
              <div className="info-row">
                <span className="label">Giá vé:</span>
                <span className="value price">{formatCurrency(selectedTicket.gia_ve)}</span>
              </div>
              <div className="info-row">
                <span className="label">Ngày đặt:</span>
                <span className="value">{selectedTicket.ngay_dat}</span>
              </div>
            </div>
            
            <div className="qr-code">
              <div className="qr-placeholder">
                <svg viewBox="0 0 100 100" width="100" height="100">
                  <rect width="100" height="100" fill="#000"/>
                  {[0,1,2,3,4].map(i => (
                    <g key={i}>
                      <rect x={i*20} y={i*20} width="10" height="10" fill="#fff"/>
                      <rect x={i*20+15} y={i*20} width="5" height="5" fill="#fff"/>
                    </g>
                  ))}
                </svg>
              </div>
              <p>Scan mã QR khi lên tàu</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TicketsManagement;