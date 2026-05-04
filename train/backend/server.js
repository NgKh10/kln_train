const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ==================== MOCK DATA ====================
// Tài khoản đăng nhập
const users = [
  { id: 1, email: 'admin@vnr.com.vn', password: 'admin', name: 'Quản trị viên KLN', role: 'admin' },
  { id: 2, email: 'dichvu@vnr.com.vn', password: '123', name: 'Nhân viên DV', role: 'staff' }
];

// Thống kê Dashboard
const dashboardStats = {
  total_revenue: 12568000000,
  total_tickets: 28450,
  total_customers: 45680,
  total_trains: 156,
  avg_occupancy: 78
};

// Doanh thu theo tháng
const revenueByMonth = [
  { month: 'Thg 1', revenue: 1250000000, tickets: 2850 },
  { month: 'Thg 2', revenue: 980000000, tickets: 2230 },
  { month: 'Thg 3', revenue: 1420000000, tickets: 3240 },
  { month: 'Thg 4', revenue: 1350000000, tickets: 3080 },
  { month: 'Thg 5', revenue: 1580000000, tickets: 3610 },
  { month: 'Thg 6', revenue: 1650000000, tickets: 3780 },
  { month: 'Thg 7', revenue: 1720000000, tickets: 3950 },
  { month: 'Thg 8', revenue: 1680000000, tickets: 3850 },
  { month: 'Thg 9', revenue: 1550000000, tickets: 3540 },
  { month: 'Thg 10', revenue: 1820000000, tickets: 4160 },
  { month: 'Thg 11', revenue: 1950000000, tickets: 4450 },
  { month: 'Thg 12', revenue: 2100000000, tickets: 4800 }
];

// Doanh thu theo tuần
const revenueByWeek = [
  { day: 'T2', revenue: 420000000, tickets: 960 },
  { day: 'T3', revenue: 380000000, tickets: 870 },
  { day: 'T4', revenue: 450000000, tickets: 1030 },
  { day: 'T5', revenue: 430000000, tickets: 985 },
  { day: 'T6', revenue: 560000000, tickets: 1280 },
  { day: 'T7', revenue: 720000000, tickets: 1650 },
  { day: 'CN', revenue: 680000000, tickets: 1550 }
];

// Tuyến phổ biến
const popularRoutes = [
  { from_station: 'Hà Nội', to_station: 'Sài Gòn', total_tickets: 12450, total_revenue: 18675000000 },
  { from_station: 'Hà Nội', to_station: 'Đà Nẵng', total_tickets: 8900, total_revenue: 8010000000 },
  { from_station: 'Sài Gòn', to_station: 'Nha Trang', total_tickets: 6700, total_revenue: 4556000000 },
  { from_station: 'Đà Nẵng', to_station: 'Sài Gòn', total_tickets: 5400, total_revenue: 5400000000 },
  { from_station: 'Hà Nội', to_station: 'Hải Phòng', total_tickets: 4800, total_revenue: 1440000000 }
];

// Đơn hàng gần đây
const recentOrders = [
  { id: 'ORD001', customer: 'Nguyễn Văn A', train: 'SE1', from_station: 'Hà Nội', to_station: 'Sài Gòn', date: '2024-01-15', amount: 1250000, status: 'completed' },
  { id: 'ORD002', customer: 'Trần Thị B', train: 'SE2', from_station: 'Đà Nẵng', to_station: 'Hà Nội', date: '2024-01-15', amount: 890000, status: 'completed' },
  { id: 'ORD003', customer: 'Lê Văn C', train: 'TN1', from_station: 'Hải Phòng', to_station: 'Vinh', date: '2024-01-14', amount: 450000, status: 'pending' },
  { id: 'ORD004', customer: 'Phạm Thị D', train: 'SE3', from_station: 'Sài Gòn', to_station: 'Nha Trang', date: '2024-01-14', amount: 680000, status: 'cancelled' }
];

// Lịch chạy sắp tới
const upcomingTrains = [
  { id: 'SE1', from_station: 'Hà Nội', to_station: 'Sài Gòn', departure: '08:00', status: 'on-time' },
  { id: 'SE2', from_station: 'Sài Gòn', to_station: 'Hà Nội', departure: '09:30', status: 'on-time' },
  { id: 'TN1', from_station: 'Lào Cai', to_station: 'Hà Nội', departure: '10:15', status: 'delayed' },
  { id: 'SE3', from_station: 'Đà Nẵng', to_station: 'Sài Gòn', departure: '11:00', status: 'on-time' }
];

// Top ga
const topStations = [
  { name: 'Ga Hà Nội', traffic: 12500, percentage: 28 },
  { name: 'Ga Sài Gòn', traffic: 11800, percentage: 26 },
  { name: 'Ga Đà Nẵng', traffic: 8500, percentage: 19 },
  { name: 'Ga Nha Trang', traffic: 6200, percentage: 14 },
  { name: 'Ga Hải Phòng', traffic: 5800, percentage: 13 }
];

// Phân bố khách hàng
const customerDistribution = [
  { name: 'Người lớn', value: 65, color: '#8C1D19' },
  { name: 'Sinh viên', value: 20, color: '#e67e22' },
  { name: 'Trẻ em', value: 10, color: '#27ae60' },
  { name: 'Người cao tuổi', value: 5, color: '#3498db' }
];

// Coupon
const coupons = [
  { ma_km: 'WELCOME10', mo_ta: 'Giảm 10% cho đơn đầu', loai_giam: 'percent', gia_tri: 10, so_luong: 100, da_dung: 45, ngay_bat_dau: '2024-01-01', ngay_het_han: '2024-12-31' },
  { ma_km: 'SUMMER50', mo_ta: 'Giảm 50k', loai_giam: 'fixed', gia_tri: 50000, so_luong: 50, da_dung: 30, ngay_bat_dau: '2024-06-01', ngay_het_han: '2024-08-31' }
];

// ==================== API ====================
// Đăng nhập
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');
    res.json({
      success: true,
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });
  } else {
    res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
  }
});

// Dashboard stats
app.get('/api/dashboard/stats', (req, res) => {
  res.json({ success: true, data: dashboardStats });
});

// Doanh thu theo tháng
app.get('/api/dashboard/revenue-by-month', (req, res) => {
  res.json({ success: true, data: revenueByMonth });
});

// Doanh thu theo tuần
app.get('/api/dashboard/revenue-by-week', (req, res) => {
  res.json({ success: true, data: revenueByWeek });
});

// Tuyến phổ biến
app.get('/api/dashboard/popular-routes', (req, res) => {
  res.json({ success: true, data: popularRoutes });
});

// Đơn hàng gần đây
app.get('/api/dashboard/recent-orders', (req, res) => {
  res.json({ success: true, data: recentOrders });
});

// Lịch chạy sắp tới
app.get('/api/dashboard/upcoming-trains', (req, res) => {
  res.json({ success: true, data: upcomingTrains });
});

// Top ga
app.get('/api/dashboard/top-stations', (req, res) => {
  res.json({ success: true, data: topStations });
});

// Phân bố khách hàng
app.get('/api/dashboard/customer-distribution', (req, res) => {
  res.json({ success: true, data: customerDistribution });
});

// Coupons
app.get('/api/coupons', (req, res) => {
  res.json({ success: true, data: coupons });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running with Mock Data' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`\n📌 Tài khoản đăng nhập:`);
  console.log(`   - Email: admin@vnr.com.vn`);
  console.log(`   - Mật khẩu: admin`);
  console.log(`\n   - Email: dichvu@vnr.com.vn`);
  console.log(`   - Mật khẩu: 123`);
  console.log(`\n✅ Đang chạy với MOCK DATA (không cần database)`);
});