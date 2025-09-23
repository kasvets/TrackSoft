import axios, { AxiosError, AxiosResponse } from 'axios'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'

// Use mock API for demo
const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true' || true
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// Import mock API
import * as mockAPI from './mockApi'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error: AxiosError) => {
    const message = (error.response?.data as any)?.message || error.message || 'Bir hata oluştu'
    
    // Handle specific error codes
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      Cookies.remove('token')
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
      toast.error('Oturum süreniz doldu. Lütfen tekrar giriş yapın.')
    } else if (error.response?.status === 403) {
      toast.error('Bu işlem için yetkiniz bulunmuyor.')
    } else if (error.response?.status === 404) {
      toast.error('Aranan kaynak bulunamadı.')
    } else if (error.response?.status === 409) {
      toast.error(message)
    } else if (error.response?.status && error.response.status >= 500) {
      toast.error('Sunucu hatası. Lütfen daha sonra tekrar deneyin.')
    } else {
      toast.error(message)
    }
    
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = USE_MOCK_API ? mockAPI.authAPI : {
  login: (data: { login: string; password: string }) =>
    api.post('/auth/login', data),
  
  register: (data: any) =>
    api.post('/auth/register', data),
  
  getProfile: () =>
    api.get('/auth/profile'),
  
  updateProfile: (data: any) =>
    api.put('/auth/profile', data),
  
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/auth/change-password', data),
  
  logout: () =>
    api.post('/auth/logout'),
}

// Container API
export const containerAPI = USE_MOCK_API ? mockAPI.containerAPI : {
  getAll: (params?: any) =>
    api.get('/containers', { params }),
  
  getById: (id: string) =>
    api.get(`/containers/${id}`),
  
  create: (data: any) =>
    api.post('/containers', data),
  
  update: (id: string, data: any) =>
    api.put(`/containers/${id}`, data),
  
  delete: (id: string) =>
    api.delete(`/containers/${id}`),
  
  addTracking: (id: string, data: any) =>
    api.post(`/containers/${id}/tracking`, data),
  
  getStats: () =>
    api.get('/containers/stats/overview'),
}

// Invoice API
export const invoiceAPI = USE_MOCK_API ? mockAPI.invoiceAPI : {
  getAll: (params?: any) =>
    api.get('/invoices', { params }),
  
  getById: (id: string) =>
    api.get(`/invoices/${id}`),
  
  create: (data: any) =>
    api.post('/invoices', data),
  
  update: (id: string, data: any) =>
    api.put(`/invoices/${id}`, data),
  
  delete: (id: string) =>
    api.delete(`/invoices/${id}`),
  
  markAsPaid: (id: string, data: any) =>
    api.patch(`/invoices/${id}/pay`, data),
  
  getStats: () =>
    api.get('/invoices/stats/overview'),
}

// Loader API
export const loaderAPI = USE_MOCK_API ? mockAPI.loaderAPI : {
  getAll: (params?: any) =>
    api.get('/loaders', { params }),
  
  getById: (id: string) =>
    api.get(`/loaders/${id}`),
  
  create: (data: any) =>
    api.post('/loaders', data),
  
  update: (id: string, data: any) =>
    api.put(`/loaders/${id}`, data),
  
  delete: (id: string) =>
    api.delete(`/loaders/${id}`),
  
  updateLocation: (id: string, data: any) =>
    api.patch(`/loaders/${id}/location`, data),
  
  addDocument: (id: string, data: any) =>
    api.post(`/loaders/${id}/documents`, data),
  
  rate: (id: string, data: { rating: number }) =>
    api.post(`/loaders/${id}/rate`, data),
  
  getStats: () =>
    api.get('/loaders/stats/overview'),
}

// Container Manager API
export const containerManagerAPI = USE_MOCK_API ? mockAPI.containerManagerAPI : {
  getAll: (params?: any) =>
    api.get('/container-managers', { params }),
  
  getById: (id: string) =>
    api.get(`/container-managers/${id}`),
  
  create: (data: any) =>
    api.post('/container-managers', data),
  
  delete: (id: string) =>
    api.delete(`/container-managers/${id}`),
  
  assignContainer: (managerId: string, data: { containerId: string }) =>
    api.post(`/container-managers/${managerId}/assign-container`, data),
  
  unassignContainer: (managerId: string, containerId: string) =>
    api.delete(`/container-managers/${managerId}/unassign-container/${containerId}`),
  
  bulkAssign: (managerId: string, data: { containerIds: string[] }) =>
    api.post(`/container-managers/${managerId}/bulk-assign`, data),
  
  getStats: (id: string) =>
    api.get(`/container-managers/${id}/stats`),
}

// Dashboard API
export const dashboardAPI = USE_MOCK_API ? mockAPI.dashboardAPI : {
  getOverview: () =>
    api.get('/dashboard/overview'),
  
  getActivities: (params?: { limit?: number }) =>
    api.get('/dashboard/activities', { params }),
  
  getMetrics: (params?: { days?: number }) =>
    api.get('/dashboard/metrics', { params }),
  
  getAlerts: () =>
    api.get('/dashboard/alerts'),
}

// Health check
export const healthAPI = USE_MOCK_API ? mockAPI.healthAPI : {
  check: () =>
    api.get('/health'),
}

export default api
