import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getRevenueByMonth: () => api.get('/dashboard/revenue-by-month'),
  getRecentOrders: () => api.get('/dashboard/recent-orders'),
};

// Train API
export const trainAPI = {
  getAll: () => api.get('/trains'),
  getById: (id) => api.get(`/trains/${id}`),
  create: (data) => api.post('/trains', data),
  update: (id, data) => api.put(`/trains/${id}`, data),
  delete: (id) => api.delete(`/trains/${id}`),
};

// Station API
export const stationAPI = {
  getAll: () => api.get('/stations'),
  getById: (id) => api.get(`/stations/${id}`),
  create: (data) => api.post('/stations', data),
  update: (id, data) => api.put(`/stations/${id}`, data),
  delete: (id) => api.delete(`/stations/${id}`),
};

// Schedule API 
export const scheduleAPI = {
  getAll: () => api.get('/schedules'),
  getById: (id) => api.get(`/schedules/${id}`),
  getStations: (id) => api.get(`/schedules/${id}/stations`),
  create: (data) => api.post('/schedules', data),
  update: (id, data) => api.put(`/schedules/${id}`, data),
  delete: (id) => api.delete(`/schedules/${id}`),
  addStation: (id, data) => api.post(`/schedules/${id}/stations`, data),
  getChuyenTau: (params) => api.get('/schedules/chuyen-tau', { params }),
  generateChuyen: (data) => api.post('/schedules/generate', data),
};

// Ticket API
export const ticketAPI = {
  getAll: () => api.get('/tickets'),
  getById: (id) => api.get(`/tickets/${id}`),
  confirm: (id) => api.put(`/tickets/${id}/confirm`),
  cancel: (id, ly_do) => api.put(`/tickets/${id}/cancel`, { ly_do }),
};

// Customer API
export const customerAPI = {
  getAll: () => api.get('/customers'),
  getById: (id) => api.get(`/customers/${id}`),
};

export default api;