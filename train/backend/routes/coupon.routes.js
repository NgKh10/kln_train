const express = require('express');
const router = express.Router();
const { executeQuery } = require('../config/db');

// LẤY DANH SÁCH COUPON
router.get('/', async (req, res) => {
  try {
    const result = await executeQuery(`
      SELECT * FROM Coupon 
      ORDER BY ngay_het_han DESC
    `);
    res.json({
      success: true,
      data: result.recordset,
      total: result.recordset.length
    });
  } catch (error) {
    console.error('Lỗi GET coupons:', error);
    res.status(500).json({ success: false, message: 'Lỗi lấy danh sách coupon' });
  }
});

// LẤY COUPON THEO MÃ
router.get('/:ma_km', async (req, res) => {
  try {
    const result = await executeQuery(
      'SELECT * FROM Coupon WHERE ma_km = @ma_km',
      { ma_km: req.params.ma_km }
    );
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy coupon' });
    }
    
    res.json({ success: true, data: result.recordset[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi lấy coupon' });
  }
});

// THÊM COUPON MỚI
router.post('/', async (req, res) => {
  const { ma_km, mo_ta, loai_giam, gia_tri, so_luong, ngay_bat_dau, ngay_het_han } = req.body;
  
  if (!ma_km || !gia_tri || !so_luong || !ngay_bat_dau || !ngay_het_han) {
    return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin' });
  }
  
  try {
    const checkResult = await executeQuery(
      'SELECT ma_km FROM Coupon WHERE ma_km = @ma_km',
      { ma_km }
    );
    
    if (checkResult.recordset.length > 0) {
      return res.status(400).json({ success: false, message: 'Mã code đã tồn tại' });
    }
    
    await executeQuery(`
      INSERT INTO Coupon (ma_km, mo_ta, loai_giam, gia_tri, so_luong, da_dung, ngay_bat_dau, ngay_het_han)
      VALUES (@ma_km, @mo_ta, @loai_giam, @gia_tri, @so_luong, 0, @ngay_bat_dau, @ngay_het_han)
    `, { ma_km, mo_ta, loai_giam, gia_tri, so_luong, ngay_bat_dau, ngay_het_han });
    
    res.status(201).json({ success: true, message: 'Thêm coupon thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi thêm coupon' });
  }
});

// CẬP NHẬT COUPON
router.put('/:ma_km', async (req, res) => {
  const { mo_ta, loai_giam, gia_tri, so_luong, ngay_bat_dau, ngay_het_han } = req.body;
  
  try {
    await executeQuery(`
      UPDATE Coupon 
      SET mo_ta = @mo_ta, loai_giam = @loai_giam, gia_tri = @gia_tri, 
          so_luong = @so_luong, ngay_bat_dau = @ngay_bat_dau, ngay_het_han = @ngay_het_han
      WHERE ma_km = @ma_km
    `, { ma_km: req.params.ma_km, mo_ta, loai_giam, gia_tri, so_luong, ngay_bat_dau, ngay_het_han });
    
    res.json({ success: true, message: 'Cập nhật thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi cập nhật' });
  }
});

// XÓA COUPON
router.delete('/:ma_km', async (req, res) => {
  try {
    await executeQuery('DELETE FROM Coupon WHERE ma_km = @ma_km', { ma_km: req.params.ma_km });
    res.json({ success: true, message: 'Xóa thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi xóa' });
  }
});

module.exports = router;