import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

export const authApi = {
  sendOtp: (email: string) => api.post('/auth/send-otp', { email }),
  verifyOtp: (email: string, otp: string) => api.post('/auth/verify-otp', { email, otp }),
  register: (data: Record<string, unknown>) => api.post('/auth/register', data),
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data: Record<string, unknown>) => api.post('/auth/reset-password', data),
};

export const companyApi = {
  get: () => api.get('/company/company'),
  update: (data: Record<string, unknown>) => api.patch('/company/company', data),
  uploadLogo: (file: File) => {
    const formData = new FormData();
    formData.append('logo', file);
    return api.post('/company/company/logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getContacts: () => api.get('/company/company/contacts'),
  updateContacts: (contacts: Record<string, unknown>[]) => api.patch('/company/company/contacts', { contacts }),
};

export const notificationsApi = {
  list: () => api.get('/notifications/notifications'),
  create: (data: { type: 'jnf' | 'inf'; season: number; year: number }) => 
    api.post('/notifications/notifications', data),
  get: (id: number | string) => api.get(`/notifications/notifications/${id}`),
  updateJobProfile: (id: number | string, data: Record<string, unknown>) => 
    api.patch(`/notifications/notifications/${id}/job-profile`, data),
  updateInternProfile: (id: number | string, data: Record<string, unknown>) => 
    api.patch(`/notifications/notifications/${id}/intern-profile`, data),
  updateEligibility: (id: number | string, data: Record<string, unknown>) => 
    api.patch(`/notifications/notifications/${id}/eligibility`, data),
  updateSalary: (id: number | string, data: Record<string, unknown>) => 
    api.patch(`/notifications/notifications/${id}/salary`, data),
  updateSelection: (id: number | string, data: Record<string, unknown>) => 
    api.patch(`/notifications/notifications/${id}/selection`, data),
  uploadJdPdf: (id: number | string, file: File) => {
    const formData = new FormData();
    formData.append('jd_pdf', file);
    return api.post(`/notifications/notifications/${id}/jd-pdf`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadSelectionPdf: (id: number, file: File) => {
    const formData = new FormData();
    formData.append('selection_pdf', file);
    return api.post(`/notifications/notifications/${id}/selection-pdf`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  submit: (id: number) => api.post(`/notifications/notifications/${id}/submit`),
  preview: (id: number) => api.get(`/notifications/notifications/${id}/preview`),
  updateDeclaration: (id: number, data: Record<string, unknown>) => 
    api.patch(`/notifications/notifications/${id}/declaration`, data),
  updateStipend: (id: number | string, data: Record<string, unknown>) =>
    api.patch(`/notifications/notifications/${id}/stipend`, data),
  duplicate: (id: number) => api.post(`/notifications/notifications/${id}/duplicate`),
  delete: (id: number) => api.delete(`/notifications/notifications/${id}`),
};

export const adminApi = {
  listNotifications: (params?: Record<string, unknown>) => api.get('/admin/notifications', { params }),
  updateNotificationStatus: (id: number, data: Record<string, unknown>) => 
    api.patch(`/admin/notifications/${id}/status`, data),
  export: (type?: string) => api.get('/admin/export', { params: { type } }),
  listUsers: (params?: Record<string, unknown>) => api.get('/admin/users', { params }),
  updateUser: (id: number, data: Record<string, unknown>) => api.patch(`/admin/users/${id}`, data),
  deleteUser: (id: number) => api.delete(`/admin/users/${id}`),
  getAnalytics: () => api.get('/admin/analytics'),
  getAuditLogs: (params?: Record<string, unknown>) => api.get('/admin/audit-logs', { params }),
};
