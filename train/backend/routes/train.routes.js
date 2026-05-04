const express = require('express');
const router = express.Router();
const { executeQuery } = require('../config/db');

// LẤY DANH SÁCH TÀU
router.get('/', async (req, res) => {
  try {
    const result = await executeQuery(`
      SELECT t.*, 
        COUNT(DISTINCT cht.ma_cau_hinh) as so_toa
      FROM Tau t
      LEFT JOIN CauHinhToa cht ON t.ma_tau = cht.ma_tau
      GROUP BY t.ma_tau, t.so_hieu, t.ten_tau, t.so_toa, t.trang_thai
    `);
    res.json({ success: true, data: result.recordset });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi lấy danh sách tàu' });
  }
});

module.exports = router;