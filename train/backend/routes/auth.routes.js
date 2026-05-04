const express = require('express');
const router = express.Router();
const { executeQuery } = require('../config/db');

// POST: Đăng nhập
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Vui lòng nhập email và mật khẩu' 
    });
  }
  
  try {
    const result = await executeQuery(
      `SELECT ma_tai_khoan, email, mat_khau, ho_ten, vai_tro, trang_thai 
       FROM TaiKhoan 
       WHERE email = @email`,
      { email }
    );
    
    if (result.recordset.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Email hoặc mật khẩu không đúng' 
      });
    }
    
    const user = result.recordset[0];
    
    // Temporary: accept any password for testing
    // In production, use bcrypt.compare
    if (password !== user.mat_khau) {
      return res.status(401).json({ 
        success: false, 
        message: 'Email hoặc mật khẩu không đúng' 
      });
    }
    
    res.json({
      success: true,
      user: {
        id: user.ma_tai_khoan,
        email: user.email,
        name: user.ho_ten,
        role: user.vai_tro
      }
    });
  } catch (error) {
    console.error('Lỗi login:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi đăng nhập',
      error: error.message 
    });
  }
});

module.exports = router;