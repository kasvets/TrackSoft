// User types
export interface User {
  _id?: string
  id?: string
  username?: string
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'manager' | 'operator'
  phone?: string
  companyName?: string
  isActive: boolean
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  message: string
  token: string
  user: User
}

// Container types
export interface Container {
  _id: string
  containerNumber: string
  type: '20FT' | '40FT' | '40HC' | '45FT' | 'REEFER'
  status: 'EMPTY' | 'LOADED' | 'IN_TRANSIT' | 'DELIVERED' | 'MAINTENANCE' | 'AVAILABLE'
  currentLocation?: Location
  destination?: Location
  assignedLoader?: Loader
  assignedManager?: User
  cargo?: {
    description?: string
    weight?: number
    volume?: number
    value?: number
  }
  estimatedArrival?: string
  actualArrival?: string
  departureDate?: string
  trackingHistory: TrackingEntry[]
  documents: ContainerDocument[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Location {
  address?: string
  city?: string
  country?: string
  coordinates?: {
    latitude: number
    longitude: number
  }
}

export interface TrackingEntry {
  _id: string
  timestamp: string
  location?: Location
  status: string
  notes?: string
}

// Invoice types
export interface Invoice {
  _id: string
  invoiceNumber: string
  customer: {
    name: string
    email?: string
    phone?: string
    address?: {
      street?: string
      city?: string
      state?: string
      zipCode?: string
      country?: string
    }
    taxId?: string
  }
  container: Container | string
  services: Service[]
  subtotal: number
  taxRate: number
  taxAmount: number
  totalAmount: number
  currency: 'EUR' | 'USD' | 'TRY'
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED'
  issueDate: string
  dueDate: string
  paidDate?: string
  paymentMethod?: 'CASH' | 'BANK_TRANSFER' | 'CREDIT_CARD' | 'CHECK'
  notes?: string
  createdBy: User | string
  createdAt: string
  updatedAt: string
}

export interface Service {
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

// Loader types
export interface Loader {
  _id: string
  driverName: string
  licenseNumber: string
  phone: string
  email?: string
  vehicleInfo: {
    plateNumber: string
    brand?: string
    model?: string
    year?: number
    capacity?: number
    type: 'TRUCK' | 'TRAILER' | 'CONTAINER_CARRIER'
  }
  currentLocation?: Location & { lastUpdated: string }
  status: 'AVAILABLE' | 'ASSIGNED' | 'IN_TRANSIT' | 'LOADING' | 'UNLOADING' | 'MAINTENANCE' | 'OFF_DUTY'
  assignedContainers: Container[]
  ratings: {
    average: number
    totalRatings: number
  }
  documents: LoaderDocument[]
  emergencyContact?: {
    name?: string
    phone?: string
    relation?: string
  }
  isActive: boolean
  joinDate: string
  totalTrips: number
  totalDistance: number
  createdAt: string
  updatedAt: string
}

export interface LoaderDocument {
  _id: string
  type: 'LICENSE' | 'INSURANCE' | 'REGISTRATION' | 'MEDICAL_REPORT' | 'OTHER'
  name: string
  url: string
  expiryDate?: string
  isExpired: boolean
  uploadDate: string
}

// Carrier types
export interface Carrier {
  id: string
  name: string
  contactPerson: string
  phone: string
  email: string
  address: string
  rating: number
  totalJobs: number
  activeJobs: number
  registrationDate: string
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  specializations: string[]
}

export interface Document {
  _id: string
  name: string
  type: string
  url: string
  uploadDate: string
}

// Dashboard types
export interface DashboardOverview {
  containers: {
    total: number
    byStatus: Record<string, number>
    recentlyAdded: number
    deliveredThisMonth: number
  }
  invoices: {
    byStatus: Record<string, { count: number; totalAmount: number }>
    totalRevenue: number
    pendingRevenue: number
    overdue: number
    recentlyCreated: number
  }
  loaders: {
    total: number
    byStatus: Record<string, number>
  }
  team: {
    activeManagers: number
  }
}

export interface Activity {
  type: 'container' | 'invoice' | 'loader'
  id: string
  title: string
  description: string
  timestamp: string
  user: string
  metadata: Record<string, any>
}

export interface Alert {
  type: 'warning' | 'error' | 'info'
  category: 'container' | 'invoice' | 'loader'
  title: string
  message: string
  timestamp: string
  priority: 'high' | 'medium' | 'low'
  data?: any
}

// API Response types
export interface ApiResponse<T> {
  message?: string
  data?: T
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    current: number
    pages: number
    total: number
    limit: number
  }
}

// Form types
export interface LoginForm {
  login: string
  password: string
}

export interface RegisterForm {
  username: string
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  phone?: string
  role?: 'admin' | 'manager' | 'operator'
}

export interface ContainerForm {
  referenceNumber: string
  containerNumber: string
  type: '20FT' | '40FT' | '40HC' | '45FT' | 'REEFER'
  
  // Adres bilgileri
  pickupAddress: {
    address: string
    city: string
    country: string
    postalCode?: string
    contactPerson?: string
    contactPhone?: string
  }
  customsAddress: {
    address: string
    city: string
    country: string
    postalCode?: string
    contactPerson?: string
    contactPhone?: string
  }
  deliveryAddress: {
    address: string
    city: string
    country: string
    postalCode?: string
    contactPerson?: string
    contactPhone?: string
  }
  dropAddress: {
    address: string
    city: string
    country: string
    postalCode?: string
    contactPerson?: string
    contactPhone?: string
  }
  
  // Taşıyıcı firma
  carrierId?: string
  
  // Notlar
  notes?: string
  
  // Dosyalar
  documents?: ContainerDocument[]
}

export interface ContainerDocument {
  id: string
  name: string
  type: 'CMR' | 'T1' | 'OTHER'
  fileType: 'PDF' | 'EXCEL' | 'IMAGE'
  url?: string
  file?: File
  uploadDate: string
  size?: number
}

export interface InvoiceForm {
  customer: {
    name: string
    email?: string
    phone?: string
    address?: {
      street?: string
      city?: string
      state?: string
      zipCode?: string
      country?: string
    }
    taxId?: string
  }
  container: string
  services: Service[]
  dueDate: string
  currency?: 'EUR' | 'USD' | 'TRY'
  notes?: string
}

export interface LoaderForm {
  driverName: string
  licenseNumber: string
  phone: string
  email?: string
  vehicleInfo: {
    plateNumber: string
    brand?: string
    model?: string
    year?: number
    capacity?: number
    type?: 'TRUCK' | 'TRAILER' | 'CONTAINER_CARRIER'
  }
  emergencyContact?: {
    name?: string
    phone?: string
    relation?: string
  }
}

// Filter types
export interface ContainerFilters {
  status?: string
  type?: string
  search?: string
  page?: number
  limit?: number
}

export interface InvoiceFilters {
  status?: string
  search?: string
  page?: number
  limit?: number
}

export interface LoaderFilters {
  status?: string
  search?: string
  page?: number
  limit?: number
}
