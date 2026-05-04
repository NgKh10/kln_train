import React, { useState } from 'react';
import { FiEdit, FiSave, FiX, FiShield, FiClock, FiPercent, FiUsers } from 'react-icons/fi';
import './Policies.scss';

const Policies = () => {
  const [editingSection, setEditingSection] = useState(null);
  
  // Chính sách giá theo loại khách hàng - từ bảng ChinhSachGia
  const [customerPolicies, setCustomerPolicies] = useState([
    { id: 1, loai: 'nguoi_lon', ten: 'Người lớn', phan_tram_giam: 0, tu_ngay: '2024-01-01', den_ngay: null },
    { id: 2, loai: 'sinh_vien', ten: 'Sinh viên', phan_tram_giam: 15, tu_ngay: '2024-01-01', den_ngay: null },
    { id: 3, loai: 'tre_em', ten: 'Trẻ em (6-12 tuổi)', phan_tram_giam: 30, tu_ngay: '2024-01-01', den_ngay: null },
    { id: 4, loai: 'nguoi_cao_tuoi', ten: 'Người cao tuổi (>60 tuổi)', phan_tram_giam: 20, tu_ngay: '2024-01-01', den_ngay: null }
  ]);

  // Chính sách hủy vé - từ bảng ChinhSachHuy
  const [cancelPolicies, setCancelPolicies] = useState([
    { id: 1, gio_truoc_gio_chay: 24, phi_huy: 30 },
    { id: 2, gio_truoc_gio_chay: 12, phi_huy: 50 },
    { id: 3, gio_truoc_gio_chay: 6, phi_huy: 70 },
    { id: 4, gio_truoc_gio_chay: 2, phi_huy: 90 }
  ]);

  // Biểu giá theo dịp - từ bảng BieuGia
  const [occasionPolicies, setOccasionPolicies] = useState([
    { id: 1, ten_dip: 'Ngày thường', he_so_tang: 1.0, ngay_bat_dau: null, ngay_ket_thuc: null },
    { id: 2, ten_dip: 'Cuối tuần', he_so_tang: 1.2, ngay_bat_dau: null, ngay_ket_thuc: null },
    { id: 3, ten_dip: 'Tết Nguyên Đán', he_so_tang: 1.8, ngay_bat_dau: '2024-01-20', ngay_ket_thuc: '2024-02-20' },
    { id: 4, ten_dip: 'Hè', he_so_tang: 1.3, ngay_bat_dau: '2024-06-01', ngay_ket_thuc: '2024-08-31' }
  ]);

  const handleSaveCustomerPolicy = (id, value) => {
    setCustomerPolicies(customerPolicies.map(p => 
      p.id === id ? { ...p, phan_tram_giam: parseInt(value) } : p
    ));
    setEditingSection(null);
  };

  const handleSaveCancelPolicy = (id, value) => {
    setCancelPolicies(cancelPolicies.map(p => 
      p.id === id ? { ...p, phi_huy: parseInt(value) } : p
    ));
    setEditingSection(null);
  };

  const handleSaveOccasionPolicy = (id, value) => {
    setOccasionPolicies(occasionPolicies.map(p => 
      p.id === id ? { ...p, he_so_tang: parseFloat(value) } : p
    ));
    setEditingSection(null);
  };

  const PolicySection = ({ title, icon, children }) => (
    <div className="policy-section">
      <div className="section-header">
        <div className="section-icon">{icon}</div>
        <h2>{title}</h2>
      </div>
      <div className="section-content">
        {children}
      </div>
    </div>
  );

  return (
    <div className="policies-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Chính sách giá</h1>
          <p className="page-subtitle">Quản lý chính sách giá vé, ưu đãi theo đối tượng và dịp lễ</p>
        </div>
      </div>

      {/* Chính sách theo loại khách hàng */}
      <PolicySection title="Chính sách giá theo loại khách hàng" icon={<FiUsers />}>
        <div className="policy-table">
          {customerPolicies.map(policy => (
            <div key={policy.id} className="policy-row">
              <div className="policy-label">{policy.ten}</div>
              <div className="policy-value">
                {editingSection === `customer-${policy.id}` ? (
                  <div className="edit-group">
                    <input 
                      type="number" 
                      defaultValue={policy.phan_tram_giam} 
                      className="edit-input"
                      autoFocus
                    />
                    <span className="unit">%</span>
                    <button className="save-btn" onClick={(e) => {
                      const input = e.target.parentElement.querySelector('input');
                      handleSaveCustomerPolicy(policy.id, input.value);
                    }}>
                      <FiSave />
                    </button>
                    <button className="cancel-btn" onClick={() => setEditingSection(null)}>
                      <FiX />
                    </button>
                  </div>
                ) : (
                  <div className="display-value">
                    <span className="discount">{policy.phan_tram_giam}%</span>
                    <button className="edit-btn" onClick={() => setEditingSection(`customer-${policy.id}`)}>
                      <FiEdit />
                    </button>
                  </div>
                )}
              </div>
              <div className="policy-note">
                {policy.phan_tram_giam > 0 ? `Giảm ${policy.phan_tram_giam}% trên giá vé gốc` : 'Không áp dụng giảm giá'}
              </div>
            </div>
          ))}
        </div>
      </PolicySection>

      {/* Chính sách hủy vé */}
      <PolicySection title="Chính sách hủy vé & hoàn tiền" icon={<FiClock />}>
        <div className="cancel-policies">
          <div className="cancel-header">
            <span>Thời điểm hủy</span>
            <span>Phí hủy</span>
            <span>Hoàn lại</span>
          </div>
          {cancelPolicies.map(policy => (
            <div key={policy.id} className="cancel-row">
              <div className="cancel-time">
                Trước giờ chạy <strong>{policy.gio_truoc_gio_chay}h</strong>
              </div>
              <div className="cancel-fee">
                {editingSection === `cancel-${policy.id}` ? (
                  <div className="edit-group">
                    <input 
                      type="number" 
                      defaultValue={policy.phi_huy} 
                      className="edit-input-small"
                      autoFocus
                    />
                    <span className="unit">%</span>
                    <button className="save-btn" onClick={(e) => {
                      const input = e.target.parentElement.querySelector('input');
                      handleSaveCancelPolicy(policy.id, input.value);
                    }}>
                      <FiSave />
                    </button>
                    <button className="cancel-btn" onClick={() => setEditingSection(null)}>
                      <FiX />
                    </button>
                  </div>
                ) : (
                  <div className="display-value">
                    <span className="fee">{policy.phi_huy}%</span>
                    <button className="edit-btn" onClick={() => setEditingSection(`cancel-${policy.id}`)}>
                      <FiEdit />
                    </button>
                  </div>
                )}
              </div>
              <div className="cancel-refund">
                {100 - policy.phi_huy}% giá vé
              </div>
            </div>
          ))}
        </div>
      </PolicySection>

      {/* Biểu giá theo dịp */}
      <PolicySection title="Biểu giá theo dịp đặc biệt" icon={<FiPercent />}>
        <div className="occasion-policies">
          {occasionPolicies.map(policy => (
            <div key={policy.id} className="occasion-card">
              <div className="occasion-name">{policy.ten_dip}</div>
              <div className="occasion-multiplier">
                {editingSection === `occasion-${policy.id}` ? (
                  <div className="edit-group">
                    <input 
                      type="number" 
                      step="0.1" 
                      defaultValue={policy.he_so_tang} 
                      className="edit-input-small"
                      autoFocus
                    />
                    <span className="unit">x</span>
                    <button className="save-btn" onClick={(e) => {
                      const input = e.target.parentElement.querySelector('input');
                      handleSaveOccasionPolicy(policy.id, input.value);
                    }}>
                      <FiSave />
                    </button>
                    <button className="cancel-btn" onClick={() => setEditingSection(null)}>
                      <FiX />
                    </button>
                  </div>
                ) : (
                  <div className="display-value">
                    <span className="multiplier">{policy.he_so_tang}x</span>
                    <button className="edit-btn" onClick={() => setEditingSection(`occasion-${policy.id}`)}>
                      <FiEdit />
                    </button>
                  </div>
                )}
              </div>
              {policy.ngay_bat_dau && (
                <div className="occasion-date">
                  {policy.ngay_bat_dau} → {policy.ngay_ket_thuc}
                </div>
              )}
              <div className="occasion-note">
                {policy.he_so_tang > 1 
                  ? `Giá vé tăng ${((policy.he_so_tang - 1) * 100).toFixed(0)}% so với ngày thường`
                  : 'Giá vé áp dụng theo bảng giá cơ bản'}
              </div>
            </div>
          ))}
        </div>
      </PolicySection>

      {/* Giá cơ bản */}
      <PolicySection title="Giá vé cơ bản" icon={<FiShield />}>
        <div className="base-price">
          <div className="price-info">
            <div className="price-label">Đơn giá cơ bản</div>
            <div className="price-value">1,500đ / km</div>
          </div>
          <div className="price-note">
            * Giá vé được tính theo công thức: Khoảng cách (km) × Đơn giá cơ bản × Hệ số loại ghế × Hệ số dịp
          </div>
          <div className="seat-factors">
            <h4>Hệ số loại ghế</h4>
            <div className="factor-list">
              <div className="factor-item">
                <span>Ghế cứng</span>
                <span>1.0x</span>
              </div>
              <div className="factor-item">
                <span>Ghế mềm điều hòa</span>
                <span>1.5x</span>
              </div>
              <div className="factor-item">
                <span>Giường nằm 6 khoang</span>
                <span>2.0x</span>
              </div>
              <div className="factor-item">
                <span>Giường nằm 4 khoang</span>
                <span>2.5x</span>
              </div>
            </div>
          </div>
        </div>
      </PolicySection>
    </div>
  );
};

export default Policies;