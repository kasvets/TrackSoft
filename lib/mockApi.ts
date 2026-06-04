// Mock API for demo purposes
import toast from 'react-hot-toast'
import { User, LoginForm } from '@/types'

// Mock delay to simulate API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock user data
const mockUser: User = {
  id: '1',
  firstName: 'Mert',
  lastName: 'K.',
  email: 'admin@greenlog.com',
  phone: '+90 532 123 4567',
  role: 'admin',
  companyName: 'Bey Logistics',
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
}

// Mock statistics data
const mockStats = {
  containers: {
    total: 156,
    active: 89,
    inTransit: 45,
    delivered: 22
  },
  invoices: {
    total: 234,
    paid: 198,
    pending: 28,
    overdue: 8,
    totalAmount: 125000
  },
  loaders: {
    total: 45,
    active: 38,
    available: 12,
    busy: 26,
    averageRating: 4.2
  }
}

// Mock recent activities
const mockActivities = [
  {
    id: '1',
    type: 'container' as const,
    title: 'Konteyner Teslim Edildi',
    description: 'TCLU-1234567 konteynerı teslim edildi',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    user: 'Mehmet Kaya',
    metadata: { containerNumber: 'TCLU-1234567', status: 'delivered' }
  },
  {
    id: '2',
    type: 'invoice' as const,
    title: 'Yeni Fatura Oluşturuldu',
    description: 'Yeni fatura oluşturuldu: #INV-2024-001',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    user: 'Ayşe Demir',
    metadata: { invoiceNumber: 'INV-2024-001', amount: 5000 }
  },
  {
    id: '3',
    type: 'loader' as const,
    title: 'Yükleyici Atandı',
    description: 'Yükleyici atandı: Ali Veli - TCLU-9876543',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    user: 'Admin',
    metadata: { loaderName: 'Ali Veli', containerNumber: 'TCLU-9876543' }
  },
  {
    id: '4',
    type: 'container' as const,
    title: 'Konteyner Durumu Güncellendi',
    description: 'MSKU-4567890 konteyneri transit durumuna geçti',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    user: 'Fatma Özkan',
    metadata: { containerNumber: 'MSKU-4567890', newStatus: 'IN_TRANSIT' }
  }
]

// Mock alerts
const mockAlerts = [
  {
    id: '1',
    type: 'warning' as const,
    category: 'container' as const,
    title: 'Geciken Teslimat',
    message: 'TCLU-1111111 konteynerı teslimat süresini aştı',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    priority: 'high' as const,
    isRead: false
  },
  {
    id: '2',
    type: 'info' as const,
    category: 'container' as const,
    title: 'Yeni Sipariş',
    message: '3 yeni konteyner siparişi alındı',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    priority: 'medium' as const,
    isRead: false
  },
  {
    id: '3',
    type: 'error' as const,
    category: 'loader' as const,
    title: 'Sistem Uyarısı',
    message: 'GPS bağlantısı kesildi: Yükleyici #45',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    priority: 'high' as const,
    isRead: true
  }
]

// Auth API Mock
export const authAPI = {
  login: async (data: LoginForm) => {
    await delay(1000)
    
    // Demo hesabı: demo/demo123
    if (data.login === 'demo' && data.password === 'demo123') {
      return {
        data: {
          token: 'mock-jwt-token',
          user: mockUser
        }
      }
    } else {
      throw new Error('Geçersiz kullanıcı adı veya şifre. Demo hesabı: demo/demo123')
    }
  },
  
  register: async (data: any) => {
    await delay(1000)
    return { data: { message: 'Kayıt başarılı' } }
  },
  
  getProfile: async () => {
    await delay(500)
    return { data: { user: mockUser } }
  },
  
  updateProfile: async (data: any) => {
    await delay(1000)
    return { data: { user: { ...mockUser, ...data } } }
  },
  
  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    await delay(1000)
    return { data: { message: 'Şifre başarıyla değiştirildi' } }
  },
  
  logout: async () => {
    await delay(500)
    return { data: { message: 'Başarıyla çıkış yapıldı' } }
  },
}

// Mock container data
const mockContainers = [
  {
    _id: '1',
    containerNumber: 'TCLU-1234567',
    referenceNumber: 'REF-240923-ABC',
    type: '40FT' as const,
    status: 'DELIVERED' as const,
    currentLocation: {
      address: 'İstanbul Limanı, Zeytinburnu',
      city: 'İstanbul',
      country: 'Türkiye'
    },
    destination: {
      address: 'Hamburg Limanı',
      city: 'Hamburg',
      country: 'Almanya'
    },
    pickupAddress: {
      address: 'Atatürk Organize Sanayi Bölgesi, 1. Cadde No:15',
      city: 'İstanbul',
      country: 'Türkiye',
      postalCode: '34158',
      contactPerson: 'Ahmet Yılmaz',
      contactPhone: '+90 532 123 4567'
    },
    customsAddress: {
      address: 'İstanbul Gümrük Müdürlüğü, Zeytinburnu',
      city: 'İstanbul',
      country: 'Türkiye',
      postalCode: '34020',
      contactPerson: 'Mehmet Kaya',
      contactPhone: '+90 532 987 6543'
    },
    deliveryAddress: {
      address: 'Hamburg Port Authority, Neuer Wandrahm 4',
      city: 'Hamburg',
      country: 'Almanya',
      postalCode: '20457',
      contactPerson: 'Klaus Mueller',
      contactPhone: '+49 40 123 456'
    },
    dropAddress: {
      address: 'Container Terminal Tollerort, Dradenaustr. 1',
      city: 'Hamburg',
      country: 'Almanya',
      postalCode: '21129',
      contactPerson: 'Hans Weber',
      contactPhone: '+49 40 987 654'
    },
    cargo: {
      description: 'Tekstil ürünleri ve konfeksiyon',
      weight: 15500,
      volume: 67.2,
      value: 125000
    },
    departureDate: '2024-09-20T10:00:00Z',
    estimatedArrival: '2024-09-30T14:00:00Z',
    notes: 'Soğuk zincir korunmalı. Özel dikkat gerekli.',
    documents: [
      {
        id: 'doc1',
        name: 'CMR_TCLU1234567.pdf',
        type: 'CMR' as const,
        fileType: 'PDF' as const,
        url: '/documents/cmr_tclu1234567.pdf',
        uploadDate: '2024-09-20T08:30:00Z',
        size: 245760
      },
      {
        id: 'doc2',
        name: 'T1_Declaration.pdf',
        type: 'T1' as const,
        fileType: 'PDF' as const,
        url: '/documents/t1_declaration.pdf',
        uploadDate: '2024-09-20T08:45:00Z',
        size: 189432
      }
    ],
    trackingHistory: [] as any[],
    isActive: true,
    createdAt: '2024-09-20T08:00:00Z',
    updatedAt: '2024-09-23T10:30:00Z'
  },
  {
    _id: '2',
    containerNumber: 'MSKU-9876543',
    referenceNumber: 'REF-240922-XYZ',
    type: '20FT' as const,
    status: 'LOADED' as const,
    currentLocation: {
      address: 'Mersin Uluslararası Limanı',
      city: 'Mersin',
      country: 'Türkiye'
    },
    destination: {
      address: 'Port of Piraeus',
      city: 'Piraeus',
      country: 'Yunanistan'
    },
    pickupAddress: {
      address: 'Tarsus Organize Sanayi Bölgesi, B Blok',
      city: 'Mersin',
      country: 'Türkiye',
      postalCode: '33110',
      contactPerson: 'Fatma Özkan',
      contactPhone: '+90 324 555 0123'
    },
    customsAddress: {
      address: 'Mersin Gümrük Müdürlüğü',
      city: 'Mersin',
      country: 'Türkiye',
      postalCode: '33070',
      contactPerson: 'Ali Demir',
      contactPhone: '+90 324 555 0456'
    },
    deliveryAddress: {
      address: 'Piraeus Port Authority, Gate E1',
      city: 'Piraeus',
      country: 'Yunanistan',
      postalCode: '18510',
      contactPerson: 'Dimitris Papadopoulos',
      contactPhone: '+30 210 123 4567'
    },
    dropAddress: {
      address: 'Container Terminal III, Pier II',
      city: 'Piraeus',
      country: 'Yunanistan',
      postalCode: '18510',
      contactPerson: 'Maria Georgiou',
      contactPhone: '+30 210 987 6543'
    },
    cargo: {
      description: 'Makine parçaları ve yedek parça',
      weight: 8200,
      volume: 28.5,
      value: 75000
    },
    departureDate: '2024-09-25T16:00:00Z',
    estimatedArrival: '2024-09-28T12:00:00Z',
    notes: 'Fragile - Kırılabilir malzeme içerir.',
    documents: [] as any[],
    trackingHistory: [] as any[],
    isActive: true,
    createdAt: '2024-09-22T14:20:00Z',
    updatedAt: '2024-09-23T09:15:00Z'
  }
]

// Container API Mock
export const containerAPI = {
  getAll: async (params?: any) => {
    await delay(800)
    
    let filteredContainers = [...mockContainers]
    
    // Search filter
    if (params?.search) {
      const searchTerm = params.search.toLowerCase()
      filteredContainers = filteredContainers.filter(container =>
        container.containerNumber.toLowerCase().includes(searchTerm) ||
        container.referenceNumber.toLowerCase().includes(searchTerm)
      )
    }
    
    // Status filter
    if (params?.status) {
      filteredContainers = filteredContainers.filter(container =>
        container.status === params.status
      )
    }
    
    // Type filter
    if (params?.type) {
      filteredContainers = filteredContainers.filter(container =>
        container.type === params.type
      )
    }
    
    return { 
      data: { 
        containers: filteredContainers, 
        total: filteredContainers.length 
      } 
    }
  },
  
  getById: async (id: string) => {
    await delay(500)
    const container = mockContainers.find(c => c._id === id)
    return { data: { container: container || null } }
  },
  
  create: async (data: any) => {
    await delay(1000)
    
    const newContainer = {
      _id: Math.random().toString(36).substr(2, 9),
      ...data,
      trackingHistory: [] as any[],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    mockContainers.push(newContainer)
    
    return { data: { container: newContainer } }
  },
  
  update: async (id: string, data: any) => {
    await delay(1000)
    
    const index = mockContainers.findIndex(c => c._id === id)
    if (index !== -1) {
      mockContainers[index] = {
        ...mockContainers[index],
        ...data,
        updatedAt: new Date().toISOString()
      }
      return { data: { container: mockContainers[index] } }
    }
    
    throw new Error('Container not found')
  },
  
  delete: async (id: string) => {
    await delay(500)
    
    const index = mockContainers.findIndex(c => c._id === id)
    if (index !== -1) {
      mockContainers.splice(index, 1)
      return { data: { message: 'Konteyner silindi' } }
    }
    
    throw new Error('Container not found')
  },
  
  addTracking: async (id: string, data: any) => {
    await delay(800)
    
    const container = mockContainers.find(c => c._id === id)
    if (container) {
      const trackingEntry = {
        _id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        location: data.location,
        status: data.status,
        notes: data.notes
      }
      container.trackingHistory.push(trackingEntry)
      container.updatedAt = new Date().toISOString()
      
      return { data: { tracking: trackingEntry } }
    }
    
    throw new Error('Container not found')
  },
  
  addDocument: async (id: string, document: any) => {
    await delay(800)
    
    const container = mockContainers.find(c => c._id === id)
    if (container) {
      const newDocument = {
        ...document,
        id: Math.random().toString(36).substr(2, 9),
        uploadDate: new Date().toISOString()
      }
      
      if (!container.documents) {
        container.documents = []
      }
      
      container.documents.push(newDocument)
      container.updatedAt = new Date().toISOString()
      
      return { data: { document: newDocument } }
    }
    
    throw new Error('Container not found')
  },
  
  removeDocument: async (id: string, documentId: string) => {
    await delay(500)
    
    const container = mockContainers.find(c => c._id === id)
    if (container && container.documents) {
      container.documents = container.documents.filter(doc => doc.id !== documentId)
      container.updatedAt = new Date().toISOString()
      
      return { data: { message: 'Doküman silindi' } }
    }
    
    throw new Error('Container or document not found')
  },
  
  updateStatus: async (id: string, status: string, notes?: string) => {
    await delay(600)
    
    const container = mockContainers.find(c => c._id === id)
    if (container) {
      container.status = status as any
      container.updatedAt = new Date().toISOString()
      
      // Add tracking entry
      const trackingEntry = {
        _id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        status: status,
        notes: notes || `Durum ${status} olarak güncellendi`
      }
      
      container.trackingHistory.push(trackingEntry)
      
      return { data: { container, tracking: trackingEntry } }
    }
    
    throw new Error('Container not found')
  },
  
  getStats: async () => {
    await delay(600)
    
    const stats = {
      total: mockContainers.length,
      byStatus: mockContainers.reduce((acc, container) => {
        acc[container.status] = (acc[container.status] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      byType: mockContainers.reduce((acc, container) => {
        acc[container.type] = (acc[container.type] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      recentlyAdded: mockContainers.filter(c => {
        const created = new Date(c.createdAt)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return created > weekAgo
      }).length
    }
    
    return { data: stats }
  },
}

// Invoice API Mock
export const invoiceAPI = {
  getAll: async (params?: any) => {
    await delay(800)
    return { data: { invoices: [], total: 0 } }
  },
  
  getById: async (id: string) => {
    await delay(500)
    return { data: { invoice: {} } }
  },
  
  create: async (data: any) => {
    await delay(1000)
    return { data: { invoice: data } }
  },
  
  update: async (id: string, data: any) => {
    await delay(1000)
    return { data: { invoice: data } }
  },
  
  delete: async (id: string) => {
    await delay(500)
    return { data: { message: 'Fatura silindi' } }
  },
  
  markAsPaid: async (id: string, data: any) => {
    await delay(800)
    return { data: { invoice: data } }
  },
  
  getStats: async () => {
    await delay(600)
    return { data: mockStats.invoices }
  },
}

// Loader API Mock
export const loaderAPI = {
  getAll: async (params?: any) => {
    await delay(800)
    return { data: { loaders: [], total: 0 } }
  },
  
  getById: async (id: string) => {
    await delay(500)
    return { data: { loader: {} } }
  },
  
  create: async (data: any) => {
    await delay(1000)
    return { data: { loader: data } }
  },
  
  update: async (id: string, data: any) => {
    await delay(1000)
    return { data: { loader: data } }
  },
  
  delete: async (id: string) => {
    await delay(500)
    return { data: { message: 'Yükleyici silindi' } }
  },
  
  updateLocation: async (id: string, data: any) => {
    await delay(600)
    return { data: { loader: data } }
  },
  
  addDocument: async (id: string, data: any) => {
    await delay(800)
    return { data: { document: data } }
  },
  
  rate: async (id: string, data: { rating: number }) => {
    await delay(600)
    return { data: { rating: data.rating } }
  },
  
  getStats: async () => {
    await delay(600)
    return { data: mockStats.loaders }
  },
}

// Container Manager API Mock
export const containerManagerAPI = {
  getAll: async (params?: any) => {
    await delay(800)
    return { data: { managers: [], total: 0 } }
  },
  
  getById: async (id: string) => {
    await delay(500)
    return { data: { manager: {} } }
  },
  
  create: async (data: any) => {
    await delay(1000)
    return { data: { manager: data } }
  },
  
  delete: async (id: string) => {
    await delay(500)
    return { data: { message: 'Yönetici silindi' } }
  },
  
  assignContainer: async (managerId: string, data: { containerId: string }) => {
    await delay(800)
    return { data: { message: 'Konteyner atandı' } }
  },
  
  unassignContainer: async (managerId: string, containerId: string) => {
    await delay(600)
    return { data: { message: 'Konteyner ataması kaldırıldı' } }
  },
  
  bulkAssign: async (managerId: string, data: { containerIds: string[] }) => {
    await delay(1200)
    return { data: { message: 'Toplu atama başarılı' } }
  },
  
  getStats: async (id: string) => {
    await delay(600)
    return { data: {} }
  },
}

// Dashboard API Mock
export const dashboardAPI = {
  getOverview: async () => {
    await delay(800)
    return { 
      data: {
        containers: {
          total: 156,
          recentlyAdded: 12,
          deliveredThisMonth: 34,
          byStatus: {
            AVAILABLE: 45,
            LOADED: 23,
            IN_TRANSIT: 45,
            DELIVERED: 22,
            MAINTENANCE: 8,
            EMPTY: 13
          }
        },
        invoices: {
          total: 234,
          totalRevenue: 125000,
          pendingRevenue: 45000,
          overdue: 8,
          recentlyCreated: 12,
          byStatus: {
            DRAFT: { count: 12, totalAmount: 15000 },
            SENT: { count: 28, totalAmount: 45000 },
            PAID: { count: 198, totalAmount: 125000 },
            OVERDUE: { count: 8, totalAmount: 8000 },
            CANCELLED: { count: 3, totalAmount: 2000 }
          }
        },
        loaders: {
          total: 45,
          byStatus: {
            AVAILABLE: 12,
            ASSIGNED: 18,
            IN_TRANSIT: 8,
            LOADING: 3,
            UNLOADING: 2,
            MAINTENANCE: 1,
            OFF_DUTY: 1
          }
        },
        team: {
          activeManagers: 8
        }
      }
    }
  },
  
  getActivities: async (params?: { limit?: number }) => {
    await delay(600)
    const limit = params?.limit || 10
    return { 
      data: { 
        activities: mockActivities.slice(0, limit) 
      }
    }
  },
  
  getMetrics: async (params?: { days?: number }) => {
    await delay(700)
    return { 
      data: { 
        metrics: {
          revenue: [12000, 13500, 14800, 16200, 17500, 18900, 20500],
          containers: [45, 52, 48, 61, 55, 67, 73],
          deliveries: [23, 28, 25, 31, 29, 34, 38]
        }
      }
    }
  },
  
  getAlerts: async () => {
    await delay(500)
    const summary = {
      high: mockAlerts.filter(a => a.priority === 'high' && !a.isRead).length,
      medium: mockAlerts.filter(a => a.priority === 'medium' && !a.isRead).length,
      low: 0 // No low priority alerts in mock data
    }
    return { 
      data: { 
        alerts: mockAlerts,
        summary: summary
      }
    }
  },
}

// Health check Mock
export const healthAPI = {
  check: async () => {
    await delay(200)
    return { 
      data: { 
        status: 'ok', 
        timestamp: new Date().toISOString() 
      }
    }
  },
}
