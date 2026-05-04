import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor cho token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getRevenueByMonth: () => api.get('/dashboard/revenue-by-month'),
  getRevenueByWeek: () => api.get('/dashboard/revenue-by-week'),
  getPopularRoutes: () => api.get('/dashboard/popular-routes'),
  getRecentOrders: () => api.get('/dashboard/recent-orders'),
  getUpcomingTrains: () => api.get('/dashboard/upcoming-trains'),
  getTopStations: () => api.get('/dashboard/top-stations'),
  getCustomerDistribution: () => api.get('/dashboard/customer-distribution'),
};

// Auth API
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
};

// Coupon API
export const couponAPI = {
  getAll: () => api.get('/coupons'),
  create: (data) => api.post('/coupons', data),
  update: (id, data) => api.put(`/coupons/${id}`, data),
  delete: (id) => api.delete(`/coupons/${id}`),
};

export default api;