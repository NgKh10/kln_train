import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiDownload, FiEye, FiCheckCircle, FiXCircle, FiPrinter } from 'react-icons/fi';
import DataTable from '../../components/Common/DataTable';
import Modal from '../../components/Common/Modal';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import { ticketAPI } from '../../services/api';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import './TicketsManagement.scss';

const TicketsManagement = () => {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [actionType, setActionType] = useState(null);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const res = await ticketAPI.getAll();
      setTickets(res.data.data || []);
    } catch (error) {
      console.error('Lỗi tải vé:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmTicket = (ticket) => {
    if (ticket.trang_thai !== 'hieu_luc') {
      alert('⚠️ Vé không ở trạng thái có hiệu lực để xác nhận');
      return;
    }
    setSelectedTicket(ticket);
    setActionType('confirm');
    setShowConfirmDialog(true);
  };

  const handleCancelTicket = (ticket) => {
    if (ticket.trang_thai !== 'hieu_luc') {
      alert('⚠️ Không thể hủy vé này');
      return;
    }
    setSelectedTicket(ticket);
    setActionType('cancel');
    setShowConfirmDialog(true);
  };

  const processConfirmTicket = async () => {
    try {
      await ticketAPI.confirm(selectedTicket.ma_ve);
      alert(`✅ Đã xác nhận vé ${selectedTicket.ma_ve} đã được sử dụng`);
      await loadTickets();
    } catch (error) {
      console.error('Lỗi xác nhận vé:', error);
      alert('❌ Có lỗi xảy ra khi xác nhận vé');
    } finally {
      setShowConfirmDialog(false);
      setSelectedTicket(null);
      setActionType(null);
    }
  };

  // Xử lý hủy vé
  const processCancelTicket = async () => {
    const lyDo = prompt('Nhập lý do hủy vé:');
    if (!lyDo) {
      setShowConfirmDialog(false);
      return;
    }
    
    try {
      await ticketAPI.cancel(selectedTicket.ma_ve, lyDo);
      alert(`❌ Đã hủy vé ${selectedTicket.ma_ve}`);
      await loadTickets();
    } catch (error) {
      console.error('Lỗi hủy vé:', error);
      alert('❌ Có lỗi xảy ra khi hủy vé');
    } finally {
      setShowConfirmDialog(false);
      setSelectedTicket(null);
      setActionType(null);
    }
  };

  // In vé
  // In vé theo format boarding pass
const handlePrintTicket = (ticket) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '---';
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN');
  };

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  // Tạo mã đặt chỗ ngẫu nhiên
  const generateBookingCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const bookingCode = generateBookingCode();
  const currentDate = new Date().toLocaleDateString('vi-VN');
  const currentTime = formatTime();

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Vé tàu ${ticket.ma_ve} - KNL TRAIN</title>
      <meta charset="UTF-8">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
          background: #FDF2D6;
          padding: 40px 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }
        
        .boarding-pass {
          max-width: 550px;
          width: 100%;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          position: relative;
        }
        
        /* Header */
        .header {
          background: #8C1D19;
          padding: 20px;
          text-align: center;
          position: relative;
        }
        
        .header h1 {
          color: #FDF2D6;
          font-size: 24px;
          letter-spacing: 2px;
          margin-bottom: 5px;
        }
        
        .header p {
          color: rgba(255, 255, 255, 0.8);
          font-size: 12px;
        }
        
        .header .train-logo {
          font-size: 40px;
          margin-bottom: 5px;
        }
        
        /* Nội dung chính */
        .content {
          padding: 25px;
        }
        
        /* Thông tin hành trình */
        .journey-section {
          background: #ffffff;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
        }
        
        .section-title {
          color: #562D2E;
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 2px solid #8C1D19;
          display: inline-block;
        }
        
        .journey-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }
        
        .station {
          text-align: center;
        }
        
        .station .name {
          font-size: 18px;
          font-weight: bold;
          color: #562D2E;
        }
        
        .station .code {
          font-size: 11px;
          color: #8C1D19;
          margin-top: 4px;
        }
        
        .arrow {
          font-size: 24px;
          color: #8C1D19;
        }
        
        .journey-details {
          display: flex;
          justify-content: space-between;
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px dashed #8C1D19;
        }
        
        .detail-item {
          text-align: center;
          flex: 1;
        }
        
        .detail-item .label {
          font-size: 11px;
          color: #8C1D19;
          display: block;
          margin-bottom: 5px;
        }
        
        .detail-item .value {
          font-size: 14px;
          font-weight: bold;
          color: #562D2E;
        }
        
        /* Thông tin hành khách */
        .passenger-section {
          background: white;
          border: 1px solid #ffffff;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          background: #ffffff;
        }
        
        .info-row {
          display: flex;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid #ffffff;
        }
        
        .info-row .label {
          width: 100px;
          font-size: 12px;
          color: #8C1D19;
          font-weight: 500;
        }
        
        .info-row .value {
          flex: 1;
          font-size: 13px;
          color: #562D2E;
          font-weight: 500;
        }
        
        /* Mã vé và QR */
        .ticket-code-section {
          background: #ffffff;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          margin-bottom: 20px;
        }
        
        .ticket-code-section .code {
          font-size: 20px;
          font-weight: bold;
          color: #8C1D19;
          letter-spacing: 2px;
          margin-bottom: 15px;
        }
        
        .qr-placeholder {
          display: inline-block;
          background: white;
          padding: 10px;
          border-radius: 12px;
          margin-bottom: 10px;
        }
        
        .qr-placeholder svg {
          width: 120px;
          height: 120px;
        }
        
        .qr-note {
          font-size: 11px;
          color: #562D2E;
        }
        
        /* Footer */
        .footer {
          background: #562D2E;
          padding: 15px;
          text-align: center;
        }
        
        .footer p {
          color: #ffffff;
          font-size: 11px;
          margin: 3px 0;
        }
        
        .footer .thanks {
          font-weight: bold;
          margin-bottom: 8px;
        }
        
        /* Dotted line */
        .dotted-line {
          height: 2px;
          background: repeating-linear-gradient(90deg, #8C1D19, #8C1D19 10px, transparent 10px, transparent 20px);
          margin: 0 25px;
        }
        
        /* Utility */
        .text-center {
          text-align: center;
        }
        
        .mt-2 {
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="boarding-pass">
        <!-- Header -->
        <div class="header">
          <div class="train-logo"></div>
          <h1>KLN TRAIN</h1>
        </div>
        
        <!-- Content -->
        <div class="content">
          <!-- Thông tin hành trình -->
          <div class="journey-section">
            <div class="section-title">THÔNG TIN HÀNH TRÌNH</div>
            <div class="journey-info">
              <div class="station">
                <div class="name">${ticket.ga_len || '---'}</div>
                <div class="code">GA ĐI</div>
              </div>
              <div class="arrow">→</div>
              <div class="station">
                <div class="name">${ticket.ga_xuong || '---'}</div>
                <div class="code">GA ĐẾN</div>
              </div>
            </div>
            <div class="journey-details">
              <div class="detail-item">
                <span class="label">TÀU</span>
                <span class="value">${ticket.chuyen_tau || '---'}</span>
              </div>
              <div class="detail-item">
                <span class="label">NGÀY ĐI</span>
                <span class="value">${formatDate(ticket.ngay_di)}</span>
              </div>
              <div class="detail-item">
                <span class="label">GIỜ ĐI</span>
                <span class="value">${ticket.gio_di || '06:00'}</span>
              </div>
              <div class="detail-item">
                <span class="label">TOA</span>
                <span class="value">${ticket.so_toa || '1'}</span>
              </div>
              <div class="detail-item">
                <span class="label">GHẾ</span>
                <span class="value">${ticket.so_ghe || '---'}</span>
              </div>
            </div>
          </div>
          
          <!-- Thông tin hành khách -->
          <div class="passenger-section">
            <div class="section-title">THÔNG TIN HÀNH KHÁCH</div>
            <div class="info-row">
              <div class="label">Họ tên:</div>
              <div class="value">${ticket.hanh_khach || '---'}</div>
            </div>
            <div class="info-row">
              <div class="label">Loại vé:</div>
              <div class="value">Toàn vé</div>
            </div>
            <div class="info-row">
              <div class="label">Giá vé:</div>
              <div class="value">${formatCurrency(ticket.gia_ve)}</div>
            </div>
          </div>
          
          <!-- Mã vé và QR -->
          <div class="ticket-code-section">
            <div class="section-title">MÃ ĐẶT CHỖ & MÃ VÉ</div>
            <div class="code">Mã đặt chỗ: ${bookingCode}</div>
            <div class="code">Mã vé: ${ticket.ma_ve}</div>
            
            <div class="qr-placeholder">
              <svg viewBox="0 0 100 100">
                <rect width="100" height="100" fill="#562D2E"/>
                <rect x="5" y="5" width="20" height="20" fill="none" stroke="#FDF2D6" stroke-width="3"/>
                <rect x="10" y="10" width="10" height="10" fill="#FDF2D6"/>
                <rect x="75" y="5" width="20" height="20" fill="none" stroke="#FDF2D6" stroke-width="3"/>
                <rect x="80" y="10" width="10" height="10" fill="#FDF2D6"/>
                <rect x="5" y="75" width="20" height="20" fill="none" stroke="#FDF2D6" stroke-width="3"/>
                <rect x="10" y="80" width="10" height="10" fill="#FDF2D6"/>
                ${Array.from({ length: 15 }, (_, i) => {
                  const x = 30 + (i % 5) * 12;
                  const y = 30 + Math.floor(i / 5) * 12;
                  return `<rect x="${x}" y="${y}" width="6" height="6" fill="#FDF2D6" opacity="0.8"/>`;
                }).join('')}
              </svg>
            </div>
            <p class="qr-note"> Quét mã QR khi lên tàu</p>
          </div>
        </div>
        
        <!-- Dotted line -->
        <div class="dotted-line"></div>
        
        <!-- Footer -->
        <div class="footer">
          <p class="thanks">CẢM ƠN QUÝ KHÁCH ĐÃ SỬ DỤNG DỊCH VỤ</p>
          <p>Kính chúc quý khách có một chuyến đi an toàn và vui vẻ!</p>
          <p>Hotline: 1900 1234 | Email: support@klntrain.vn</p>
          <p>Ngày xuất vé: ${currentDate} - ${currentTime}</p>
        </div>
      </div>
    </body>
    </html>
  `);
  printWindow.print();
};

  // Tạo mã QR giả (dùng cho hiển thị)
  const generateQRCode = (ticketId) => {
    // Tạo mã QR dạng SVG đơn giản dựa trên mã vé
    const seed = ticketId.toString().split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const patterns = [];
    for (let i = 0; i < 5; i++) {
      const x = ((seed + i * 7) % 80) + 10;
      const y = ((seed + i * 13) % 80) + 10;
      patterns.push({ x, y });
    }
    return patterns;
  };

  const getStatusText = (status) => {
    const statuses = {
      hieu_luc: { text: 'Có hiệu lực', class: 'badge-success' },
      da_su_dung: { text: 'Đã sử dụng', class: 'badge-info' },
      da_huy: { text: 'Đã hủy', class: 'badge-danger' },
      het_han: { text: 'Hết hạn', class: 'badge-warning' }
    };
    return statuses[status] || { text: status, class: 'badge-secondary' };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Thống kê số lượng vé
  const stats = {
    total: tickets.length,
    hieu_luc: tickets.filter(t => t.trang_thai === 'hieu_luc').length,
    da_su_dung: tickets.filter(t => t.trang_thai === 'da_su_dung').length,
    da_huy: tickets.filter(t => t.trang_thai === 'da_huy').length
  };

  const columns = [
    { title: 'Mã vé', key: 'ma_ve', width: '80px' },
    { title: 'Khách hàng', key: 'hanh_khach', width: '150px' },
    { title: 'Chuyến tàu', key: 'chuyen_tau', width: '80px' },
    { title: 'Hành trình', key: 'ga_len', width: '200px', render: (_, row) => `${row.ga_len} → ${row.ga_xuong}` },
    { title: 'Giá vé', key: 'gia_ve', render: (v) => formatCurrency(v) },
    { title: 'Trạng thái', key: 'trang_thai', render: (v) => {
      const status = getStatusText(v);
      return <span className={`status-badge ${status.class}`}>{status.text}</span>;
    }},
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, row) => (
        <div className="action-buttons">
          <button className="btn-view" onClick={() => { setSelectedTicket(row); setShowDetailModal(true); }} title="Xem chi tiết">
            <FiEye />
          </button>
          {row.trang_thai === 'hieu_luc' && (
            <>
              <button className="btn-confirm" onClick={() => handleConfirmTicket(row)} title="Xác nhận đã sử dụng">
                <FiCheckCircle />
              </button>
              <button className="btn-cancel" onClick={() => handleCancelTicket(row)} title="Hủy vé">
                <FiXCircle />
              </button>
            </>
          )}
          <button className="btn-print" onClick={() => handlePrintTicket(row)} title="In vé">
            <FiPrinter />
          </button>
        </div>
      )
    }
  ];

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.ma_ve?.toString().includes(searchTerm) || 
                          ticket.hanh_khach?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.trang_thai === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="tickets-management">
      <div className="page-header">
        <div>
          <h1 className="page-title">Quản lý vé</h1>
          <p className="page-subtitle">Quản lý toàn bộ vé đã bán, xác nhận vé, hủy vé</p>
        </div>
        <button className="btn-primary" onClick={() => window.location.href = '/reports'}>
          <FiDownload /> Xuất báo cáo
        </button>
      </div>

      {/* Thống kê nhanh */}
      <div className="stats-summary">
        <div className="stat-box primary">
          <span className="stat-label">Tổng số vé</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat-box success">
          <span className="stat-label">Có hiệu lực</span>
          <span className="stat-value">{stats.hieu_luc}</span>
        </div>
        <div className="stat-box info">
          <span className="stat-label">Đã sử dụng</span>
          <span className="stat-value">{stats.da_su_dung}</span>
        </div>
        <div className="stat-box danger">
          <span className="stat-label">Đã hủy</span>
          <span className="stat-value">{stats.da_huy}</span>
        </div>
      </div>

      {/* Filter bar */}
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

      {/* Data Table */}
      <DataTable columns={columns} data={filteredTickets} />

      {/* Confirm Dialog */}
      <ConfirmDialog 
        isOpen={showConfirmDialog} 
        onClose={() => setShowConfirmDialog(false)} 
        onConfirm={actionType === 'confirm' ? processConfirmTicket : processCancelTicket} 
        title={actionType === 'confirm' ? 'Xác nhận vé' : 'Hủy vé'} 
        message={actionType === 'confirm' ? `Xác nhận vé ${selectedTicket?.ma_ve} đã được sử dụng?` : `Bạn có chắc chắn muốn hủy vé ${selectedTicket?.ma_ve}?`} 
        confirmText={actionType === 'confirm' ? 'Xác nhận' : 'Hủy vé'} 
        cancelText="Quay lại" 
      />

      {/* Ticket Detail Modal with QR Code */}
      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="Chi tiết vé" size="md">
        {selectedTicket && (
          <div className="ticket-detail">
            <div className="ticket-header">
              <div className="ticket-code">
                <span>Mã vé</span>
                <h2>{selectedTicket.ma_ve}</h2>
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
                <span className="value">{selectedTicket.ngay_di || '---'}</span>
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
                <span className="value">{selectedTicket.loai_ghe || '---'}</span>
              </div>
              <div className="info-row">
                <span className="label">Vị trí ghế:</span>
                <span className="value">{selectedTicket.so_ghe || '---'}</span>
              </div>
              <div className="info-row">
                <span className="label">Giá vé:</span>
                <span className="value price">{formatCurrency(selectedTicket.gia_ve)}</span>
              </div>
              <div className="info-row">
                <span className="label">Ngày đặt:</span>
                <span className="value">{selectedTicket.ngay_dat || selectedTicket.ngay_xuat_ve?.split('T')[0]}</span>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="qr-code">
              <div className="qr-placeholder">
                <svg viewBox="0 0 100 100" width="120" height="120">
                  <rect width="100" height="100" fill="#1a1a2e"/>
                  {/* Tạo mã QR động dựa trên mã vé */}
                  {generateQRCode(selectedTicket.ma_ve).map((pos, i) => (
                    <g key={i}>
                      <rect x={pos.x} y={pos.y} width="8" height="8" fill="#ffffff"/>
                      <rect x={pos.x + 15} y={pos.y + 10} width="5" height="5" fill="#ffffff"/>
                      <rect x={pos.x + 30} y={pos.y + 25} width="6" height="6" fill="#ffffff"/>
                      <rect x={pos.x - 10} y={pos.y + 40} width="4" height="4" fill="#ffffff"/>
                      <rect x={pos.x + 50} y={pos.y - 5} width="7" height="7" fill="#ffffff"/>
                    </g>
                  ))}
                  {/* Góc trên trái */}
                  <rect x="5" y="5" width="20" height="20" fill="none" stroke="#ffffff" strokeWidth="3"/>
                  <rect x="10" y="10" width="10" height="10" fill="#ffffff"/>
                  {/* Góc trên phải */}
                  <rect x="75" y="5" width="20" height="20" fill="none" stroke="#ffffff" strokeWidth="3"/>
                  <rect x="80" y="10" width="10" height="10" fill="#ffffff"/>
                  {/* Góc dưới trái */}
                  <rect x="5" y="75" width="20" height="20" fill="none" stroke="#ffffff" strokeWidth="3"/>
                  <rect x="10" y="80" width="10" height="10" fill="#ffffff"/>
                </svg>
              </div>
              <p>Quét mã QR khi lên tàu</p>
            </div>

            {/* Action buttons in modal */}
            {selectedTicket.trang_thai === 'hieu_luc' && (
              <div className="modal-actions">
                <button 
                  className="btn-confirm" 
                  onClick={() => {
                    setShowDetailModal(false);
                    handleConfirmTicket(selectedTicket);
                  }}
                >
                  <FiCheckCircle /> Xác nhận đã sử dụng
                </button>
                <button 
                  className="btn-cancel" 
                  onClick={() => {
                    setShowDetailModal(false);
                    handleCancelTicket(selectedTicket);
                  }}
                >
                  <FiXCircle /> Hủy vé
                </button>
                <button 
                  className="btn-print" 
                  onClick={() => handlePrintTicket(selectedTicket)}
                >
                  <FiPrinter /> In vé
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TicketsManagement;