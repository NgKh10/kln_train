const { executeQuery, executeProcedure } = require('../config/db');

// Lấy danh sách yêu cầu hoàn tiền
exports.getAllRefunds = async (req, res) => {
  try {
    const result = await executeQuery(`
      SELECT h.id_hoan, v.id_ve, tk.ho_ten, v.gia_ve AS tien_goc,
             h.phi_huy, h.tien_hoan, h.ly_do, h.trang_thai_hoan, h.thoi_gian_hoan,
             d.ma_don
      FROM HoanTien h
      JOIN Ve v ON v.id_ve = h.id_ve
      JOIN DonDatVe d ON d.id_don_dat_ve = v.id_don_dat_ve
      JOIN TaiKhoan tk ON tk.id_tai_khoan = d.id_tai_khoan
      ORDER BY h.thoi_gian_hoan DESC
    `);
    res.json({ success: true, data: result.recordset });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xác nhận hoàn tiền
exports.confirmRefund = async (req, res) => {
  const { id } = req.params;
  
  try {
    await executeQuery(`
      UPDATE HoanTien SET trang_thai_hoan = 'hoan_thanh', thoi_gian_hoan_xong = GETDATE()
      WHERE id_hoan = @id
    `, { id });
    
    // Ghi log audit
    await executeQuery(`
      INSERT INTO AuditLog (bang, ma_ban_ghi, hanh_dong, gia_tri_moi, id_tai_khoan, ip_address, user_agent, thoi_gian)
      VALUES ('HoanTien', @id, 'UPDATE', @gia_tri_moi, @id_tai_khoan, @ip, @user_agent, GETDATE())
    `, {
      id,
      gia_tri_moi: JSON.stringify({ trang_thai_hoan: 'hoan_thanh' }),
      id_tai_khoan: req.user.id_tai_khoan,
      ip: req.ip,
      user_agent: req.headers['user-agent']
    });
    
    res.json({ success: true, message: 'Xác nhận hoàn tiền thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Từ chối hoàn tiền
exports.rejectRefund = async (req, res) => {
  const { id } = req.params;
  const { ly_do_tu_choi } = req.body;
  
  try {
    await executeQuery(`
      UPDATE HoanTien SET trang_thai_hoan = 'that_bai'
      WHERE id_hoan = @id
    `, { id });
    
    res.json({ success: true, message: 'Đã từ chối hoàn tiền' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Thống kê hoàn tiền
exports.getRefundStats = async (req, res) => {
  try {
    const result = await executeQuery(`
      SELECT 
        COUNT(*) AS tong_yc,
        SUM(CASE WHEN trang_thai_hoan = 'cho_xu_ly' THEN 1 ELSE 0 END) AS cho_xu_ly,
        SUM(CASE WHEN trang_thai_hoan = 'hoan_thanh' THEN 1 ELSE 0 END) AS hoan_thanh,
        SUM(CASE WHEN trang_thai_hoan = 'that_bai' THEN 1 ELSE 0 END) AS that_bai,
        SUM(CASE WHEN trang_thai_hoan = 'hoan_thanh' THEN tien_hoan ELSE 0 END) AS tong_tien_da_hoan
      FROM HoanTien
    `);
    res.json({ success: true, data: result.recordset[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};