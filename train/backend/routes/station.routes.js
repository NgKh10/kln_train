const express = require('express');
const router = express.Router();
const { executeQuery } = require('../config/db');

// LẤY DANH SÁCH GA
router.get('/', async (req, res) => {
  try {
    const result = await executeQuery(`
      SELECT * FROM GaTau 
      ORDER BY thu_tu_tuyen, do_uu_tien
    `);
    res.json({ success: true, data: result.recordset });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi lấy danh sách ga' });
  }
});

// LẤY GA THEO ID
router.get('/:id', async (req, res) => {
  try {
    const result = await executeQuery(
      'SELECT * FROM GaTau WHERE ma_ga = @id',
      { id: parseInt(req.params.id) }
    );
    res.json({ success: true, data: result.recordset[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi lấy ga' });
  }
});

module.exports = router;