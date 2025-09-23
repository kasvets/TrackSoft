'use client'

import React, { useState, useEffect } from 'react'
import { Container } from '@/types'
import AppLayout from '@/components/Layout/AppLayout'
import { containerAPI } from '@/lib/mockApi'
import { 
  MapPin, 
  Package, 
  Truck, 
  Clock, 
  Navigation, 
  Search,
  Filter,
  RefreshCw,
  Eye,
  Route,
  AlertCircle,
  CheckCircle,
  Loader2,
  X,
  Calendar,
  CheckSquare,
  Square,
  FileText,
  Shield,
  ArrowRight,
  Download
} from 'lucide-react'
import toast from 'react-hot-toast'

interface TrackingEvent {
  id: string
  timestamp: string
  location: string
  status: string
  description: string
  type: 'pickup' | 'transit' | 'customs' | 'delivery' | 'delay' | 'completed'
}

interface ContainerTracking extends Container {
  trackingEvents: TrackingEvent[]
  estimatedDelivery?: string
  currentCarrier?: {
    id: string
    name: string
    phone: string
  }
  progress: number
}

interface TrackingStep {
  id: string
  title: string
  description: string
  checkInDate?: string
  checkOutDate?: string
  completed: boolean
  icon: React.ReactNode
  color: string
  hasDocument?: boolean
  documentUrl?: string
}

interface ContainerStepsModalProps {
  container: ContainerTracking | null
  isOpen: boolean
  onClose: () => void
}

// Container Steps Modal Component
const ContainerStepsModal: React.FC<ContainerStepsModalProps> = ({ container, isOpen, onClose }) => {
  const [steps, setSteps] = useState<TrackingStep[]>([])

  // Demo veriler ile adımları oluştur
  useEffect(() => {
    if (container) {
      const mockSteps: TrackingStep[] = [
        {
          id: 'pickup',
          title: '1. Adım - Pickup',
          description: 'Konteyner alma işlemi',
          checkInDate: '2024-01-15T08:00:00',
          checkOutDate: '2024-01-15T09:30:00',
          completed: true,
          icon: <Package className="w-5 h-5" />,
          color: 'bg-blue-500'
        },
        {
          id: 'customs',
          title: '2. Adım - Customs',
          description: 'Gümrük işlemleri',
          checkInDate: '2024-01-15T14:00:00',
          checkOutDate: '2024-01-15T16:15:00',
          completed: true,
          icon: <Shield className="w-5 h-5" />,
          color: 'bg-orange-500'
        },
        {
          id: 'delivery',
          title: '3. Adım - Delivery + Boşaltma SMR',
          description: 'Teslimat ve boşaltma işlemleri',
          checkInDate: '2024-01-16T08:00:00',
          checkOutDate: '',
          completed: false,
          icon: <Truck className="w-5 h-5" />,
          color: 'bg-purple-500',
          hasDocument: true,
          documentUrl: '/demo/bosaltma-smr-demo.pdf'
        },
        {
          id: 'drop',
          title: '4. Adım - Drop',
          description: 'Konteyner bırakma işlemi',
          checkInDate: '',
          checkOutDate: '',
          completed: false,
          icon: <ArrowRight className="w-5 h-5" />,
          color: 'bg-red-500'
        }
      ]
      setSteps(mockSteps)
    }
  }, [container])

  const handleDateChange = (stepId: string, field: 'checkInDate' | 'checkOutDate', value: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, [field]: value }
        : step
    ))
  }

  const toggleStepCompletion = (stepId: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, completed: !step.completed }
        : step
    ))
  }

  if (!isOpen || !container) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Konteyner Takip Adımları
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {container.containerNumber} - {container.type}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`border rounded-lg p-4 transition-all ${
                  step.completed 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {/* Step Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`${step.color} text-white p-2 rounded-full`}>
                      {step.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{step.title}</h3>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleStepCompletion(step.id)}
                    className={`flex items-center justify-center w-6 h-6 rounded border-2 transition-colors ${
                      step.completed
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 hover:border-green-500'
                    }`}
                  >
                    {step.completed && <CheckSquare className="w-4 h-4" />}
                  </button>
                </div>

                {/* Date Inputs */}
                <div className="space-y-3">
                  {/* Check In Date */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Check In Tarihi
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="datetime-local"
                        value={step.checkInDate ? step.checkInDate.slice(0, 16) : ''}
                        onChange={(e) => handleDateChange(step.id, 'checkInDate', e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                  </div>

                  {/* Check Out Date */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Check Out Tarihi
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="datetime-local"
                        value={step.checkOutDate ? step.checkOutDate.slice(0, 16) : ''}
                        onChange={(e) => handleDateChange(step.id, 'checkOutDate', e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Document Section */}
                {step.hasDocument && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-medium text-gray-700">
                        Boşaltma SMR Dosyası
                      </label>
                    </div>
                    <div className="flex items-center space-x-3">
                      {/* Demo Image */}
                      <div className="flex-1">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50">
                          <FileText className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">bosaltma-smr-demo.pdf</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">Demo dosya - 2.4 MB</div>
                        </div>
                      </div>
                      {/* Action Buttons */}
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => window.open(step.documentUrl, '_blank')}
                          className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Görüntüle
                        </button>
                        <button
                          onClick={() => {
                            // Demo download
                            toast.success('Demo dosya indirildi!')
                          }}
                          className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          İndir
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Status Badge */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    step.completed
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {step.completed ? 'Tamamlandı' : 'Bekliyor'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            Kapat
          </button>
          <button
            onClick={() => {
              toast.success('Adımlar kaydedildi!')
              onClose()
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  )
}

// Helper function to get progress percentage by status
const getProgressByStatus = (status: Container['status']): number => {
  switch (status) {
    case 'DELIVERED':
      return 100
    case 'IN_TRANSIT':
      return 75
    case 'LOADED':
      return 50
    case 'EMPTY':
    case 'AVAILABLE':
      return 25
    case 'MAINTENANCE':
      return 10
    default:
      return 0
  }
}

const ContainerTrackingPage = () => {
  const [containers, setContainers] = useState<ContainerTracking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedContainer, setSelectedContainer] = useState<ContainerTracking | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showStepsModal, setShowStepsModal] = useState(false)
  const [modalContainer, setModalContainer] = useState<ContainerTracking | null>(null)

  // Mock tracking verileri
  const generateMockTrackingEvents = (container: Container): TrackingEvent[] => {
    const events: TrackingEvent[] = [
      {
        id: '1',
        timestamp: '2024-01-15T08:00:00Z',
        location: 'İstanbul Limanı',
        status: 'PICKUP',
        description: 'Konteyner yükleyici tarafından alındı',
        type: 'pickup'
      },
      {
        id: '2',
        timestamp: '2024-01-15T14:30:00Z',
        location: 'Ankara - Gümrük',
        status: 'CUSTOMS',
        description: 'Gümrük işlemleri tamamlandı',
        type: 'customs'
      },
      {
        id: '3',
        timestamp: '2024-01-16T09:15:00Z',
        location: 'İzmir Yolu - KM 245',
        status: 'IN_TRANSIT',
        description: 'Konteyner yolda',
        type: 'transit'
      }
    ]

    if (container.status === 'DELIVERED') {
      events.push({
        id: '4',
        timestamp: '2024-01-16T16:45:00Z',
        location: 'İzmir - Teslimat Adresi',
        status: 'DELIVERED',
        description: 'Konteyner başarıyla teslim edildi',
        type: 'completed'
      })
    }

    return events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  }

  // Konteyner verilerini yükle
  const loadContainers = async () => {
    try {
      setLoading(true)
      const response = await containerAPI.getAll({
        search: searchTerm,
        status: statusFilter !== 'all' ? statusFilter : undefined
      })
      
      const containersWithTracking = (response.data?.containers || []).map(container => ({
        ...container,
        trackingEvents: generateMockTrackingEvents(container),
        estimatedDelivery: '2024-01-17T15:00:00Z',
        currentCarrier: {
          id: 'carrier1',
          name: 'Anadolu Nakliyat',
          phone: '+90 555 123 4567'
        },
        progress: getProgressByStatus(container.status)
      }))
      
      setContainers(containersWithTracking)
    } catch (error) {
      console.error('Error loading containers:', error)
      toast.error('Konteyner takip verileri yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadContainers()
  }, [searchTerm, statusFilter])

  // Durum badge rengi
  const getStatusBadge = (status: string) => {
    const statusColors = {
      AVAILABLE: 'bg-green-600 hover:bg-green-700 text-white',
      EMPTY: 'bg-gray-600 hover:bg-gray-700 text-white',
      LOADED: 'bg-blue-600 hover:bg-blue-700 text-white',
      IN_TRANSIT: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      DELIVERED: 'bg-purple-600 hover:bg-purple-700 text-white',
      MAINTENANCE: 'bg-red-600 hover:bg-red-700 text-white'
    }
    
    const statusLabels = {
      AVAILABLE: 'Müsait',
      EMPTY: 'Boş',
      LOADED: 'Yüklü',
      IN_TRANSIT: 'Yolda',
      DELIVERED: 'Teslim Edildi',
      MAINTENANCE: 'Bakım'
    }

    return (
      <span className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        statusColors[status as keyof typeof statusColors] || 'bg-gray-600 hover:bg-gray-700 text-white'
      }`}>
        {statusLabels[status as keyof typeof statusLabels] || status}
      </span>
    )
  }

  // Event icon
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'pickup':
        return <Package className="w-4 h-4" />
      case 'transit':
        return <Truck className="w-4 h-4" />
      case 'customs':
        return <AlertCircle className="w-4 h-4" />
      case 'delivery':
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'delay':
        return <Clock className="w-4 h-4" />
      default:
        return <MapPin className="w-4 h-4" />
    }
  }

  // Event rengi
  const getEventColor = (type: string) => {
    switch (type) {
      case 'pickup':
        return 'bg-blue-100 text-blue-600 border-blue-200'
      case 'transit':
        return 'bg-yellow-100 text-yellow-600 border-yellow-200'
      case 'customs':
        return 'bg-orange-100 text-orange-600 border-orange-200'
      case 'delivery':
      case 'completed':
        return 'bg-green-100 text-green-600 border-green-200'
      case 'delay':
        return 'bg-red-100 text-red-600 border-red-200'
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200'
    }
  }

  // Konteyner detaylarını göster
  const showContainerDetails = (container: ContainerTracking) => {
    setSelectedContainer(container)
    setShowDetails(true)
  }

  // Konteyner adımları modal'ını göster
  const showContainerSteps = (container: ContainerTracking) => {
    setModalContainer(container)
    setShowStepsModal(true)
  }

  // Progress bar rengi
  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-green-500'
    if (progress >= 75) return 'bg-yellow-500'
    if (progress >= 50) return 'bg-blue-500'
    return 'bg-gray-400'
  }

  // Konteyner için adımları al
  const getContainerSteps = (container: ContainerTracking) => {
    const steps = [
      {
        id: 'pickup',
        title: '1. Pickup',
        icon: <Package className="w-4 h-4" />,
        color: 'bg-blue-500',
        completed: true,
        date: '15.01.2024 08:00'
      },
      {
        id: 'customs',
        title: '2. Customs',
        icon: <Shield className="w-4 h-4" />,
        color: 'bg-orange-500',
        completed: true,
        date: '15.01.2024 14:00'
      },
      {
        id: 'delivery',
        title: '3. Delivery',
        icon: <Truck className="w-4 h-4" />,
        color: 'bg-purple-500',
        completed: container.status === 'DELIVERED',
        inProgress: container.status === 'IN_TRANSIT',
        date: container.status === 'DELIVERED' || container.status === 'IN_TRANSIT' ? '16.01.2024 08:00' : '-'
      },
      {
        id: 'drop',
        title: '4. Drop',
        icon: <ArrowRight className="w-4 h-4" />,
        color: 'bg-red-500',
        completed: container.status === 'DELIVERED',
        date: container.status === 'DELIVERED' ? '17.01.2024 10:00' : '-'
      }
    ]

    return steps
  }

  if (showDetails && selectedContainer) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
                >
                  ← Geri Dön
                </button>
                <h1 className="text-3xl font-bold text-gray-900">
                  Konteyner Takip Detayı
                </h1>
                <p className="mt-2 text-gray-600">
                  {selectedContainer.containerNumber}
                </p>
              </div>
              <button
                onClick={loadContainers}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Yenile
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Konteyner Bilgileri */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Konteyner Bilgileri
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Konteyner Numarası
                    </label>
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedContainer.containerNumber}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Tip
                    </label>
                    <p className="text-sm text-gray-900">
                      {selectedContainer.type}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Durum
                    </label>
                    <div className="mt-1">
                      {getStatusBadge(selectedContainer.status)}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      İlerleme
                    </label>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                        <span>%{selectedContainer.progress}</span>
                        <span>Tamamlandı</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(selectedContainer.progress)}`}
                          style={{ width: `${selectedContainer.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {selectedContainer.currentCarrier && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Taşıyıcı Firma
                      </label>
                      <p className="text-sm text-gray-900">
                        {selectedContainer.currentCarrier.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedContainer.currentCarrier.phone}
                      </p>
                    </div>
                  )}

                  {selectedContainer.estimatedDelivery && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        Tahmini Teslimat
                      </label>
                      <p className="text-sm text-gray-900">
                        {new Date(selectedContainer.estimatedDelivery).toLocaleDateString('tr-TR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Takip Geçmişi */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Takip Geçmişi
                </h3>
                
                <div className="flow-root">
                  <ul className="-mb-8">
                    {selectedContainer.trackingEvents.map((event, eventIdx) => (
                      <li key={event.id}>
                        <div className="relative pb-8">
                          {eventIdx !== selectedContainer.trackingEvents.length - 1 ? (
                            <span
                              className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                              aria-hidden="true"
                            />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white border-2 ${getEventColor(event.type)}`}>
                                {getEventIcon(event.type)}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {event.description}
                                </p>
                                <p className="text-sm text-gray-500">
                                  <MapPin className="inline w-4 h-4 mr-1" />
                                  {event.location}
                                </p>
                              </div>
                              <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                <time dateTime={event.timestamp}>
                                  {new Date(event.timestamp).toLocaleDateString('tr-TR', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </time>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Konteyner Takip</h1>
              <p className="mt-2 text-gray-600">
                Konteynerlerin anlık lokasyon ve durum takibi
              </p>
            </div>
            <button
              onClick={loadContainers}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Yenile
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Konteyner numarası ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="LOADED">Yüklü</option>
                <option value="IN_TRANSIT">Yolda</option>
                <option value="DELIVERED">Teslim Edildi</option>
              </select>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center justify-center bg-gray-50 rounded-md p-2">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {containers.filter(c => c.status === 'IN_TRANSIT').length}
                </div>
                <div className="text-xs text-gray-500">Aktif Takip</div>
              </div>
            </div>
          </div>
        </div>

        {/* Container Tracking Cards */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-center">
              <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
              <span className="ml-3 text-gray-600">Takip verileri yükleniyor...</span>
            </div>
          </div>
        ) : containers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <Navigation className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Takip edilecek konteyner bulunamadı
            </h3>
            <p className="text-gray-600">
              Arama kriterlerinizi değiştirin veya yeni konteyner ekleyin
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {containers.map((container) => (
              <div
                key={container._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => showContainerDetails(container)}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <Package className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {container.containerNumber}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{container.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(container.status)}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          showContainerSteps(container)
                        }}
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Adımları Görüntüle
                      </button>
                      <button 
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                        title="Detayları Görüntüle"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Detaylar
                      </button>
                    </div>
                  </div>

                  {/* Steps Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {getContainerSteps(container).map((step) => (
                      <div 
                        key={step.id}
                        className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                          step.completed 
                            ? 'bg-green-50 border border-green-200' 
                            : step.inProgress 
                              ? 'bg-yellow-50 border border-yellow-200' 
                              : 'bg-gray-50 border border-gray-200'
                        }`}
                      >
                        <div className={`${step.color} text-white p-2 rounded-full`}>
                          {step.icon}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{step.title}</div>
                          <div className="flex items-center space-x-1 mt-1">
                            {step.completed ? (
                              <>
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-xs text-green-700 font-medium">Tamamlandı</span>
                              </>
                            ) : step.inProgress ? (
                              <>
                                <Clock className="w-4 h-4 text-yellow-600" />
                                <span className="text-xs text-yellow-700 font-medium">Devam Ediyor</span>
                              </>
                            ) : (
                              <>
                                <Square className="w-4 h-4 text-gray-500" />
                                <span className="text-xs text-gray-500 font-medium">Bekliyor</span>
                              </>
                            )}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">{step.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>Toplam İlerleme</span>
                      <span>%{container.progress}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(container.progress)}`}
                        style={{ width: `${container.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Container Steps Modal */}
      <ContainerStepsModal
        container={modalContainer}
        isOpen={showStepsModal}
        onClose={() => {
          setShowStepsModal(false)
          setModalContainer(null)
        }}
      />
    </AppLayout>
  )
}

export default ContainerTrackingPage
