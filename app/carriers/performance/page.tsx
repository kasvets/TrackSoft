'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle,
  XCircle,
  AlertTriangle,
  Star,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'
import { withAuth } from '@/hooks/useAuth'
import AppLayout from '@/components/Layout/AppLayout'

interface PerformanceMetrics {
  totalJobs: number
  completedJobs: number
  cancelledJobs: number
  averageDeliveryTime: number
  onTimeDeliveryRate: number
  customerSatisfaction: number
  revenue: number
  monthlyGrowth: number
}

interface CarrierPerformance {
  id: string
  name: string
  metrics: PerformanceMetrics
  monthlyStats: {
    month: string
    jobs: number
    revenue: number
    satisfaction: number
  }[]
  recentJobs: {
    id: string
    containerNumber: string
    route: string
    deliveryTime: number
    status: 'COMPLETED' | 'DELAYED' | 'CANCELLED'
    customerRating: number
  }[]
}

const mockData: CarrierPerformance[] = [
  {
    id: '1',
    name: 'Anadolu Lojistik A.Ş.',
    metrics: {
      totalJobs: 245,
      completedJobs: 230,
      cancelledJobs: 15,
      averageDeliveryTime: 3.2,
      onTimeDeliveryRate: 92.5,
      customerSatisfaction: 4.8,
      revenue: 125000,
      monthlyGrowth: 8.5
    },
    monthlyStats: [
      { month: 'Ocak', jobs: 45, revenue: 22500, satisfaction: 4.6 },
      { month: 'Şubat', jobs: 52, revenue: 26000, satisfaction: 4.7 },
      { month: 'Mart', jobs: 48, revenue: 24000, satisfaction: 4.8 },
      { month: 'Nisan', jobs: 55, revenue: 27500, satisfaction: 4.9 },
      { month: 'Mayıs', jobs: 45, revenue: 25000, satisfaction: 4.8 }
    ],
    recentJobs: [
      { id: '1', containerNumber: 'TCLU1234567', route: 'İstanbul → Ankara', deliveryTime: 2.5, status: 'COMPLETED', customerRating: 5 },
      { id: '2', containerNumber: 'MSCU9876543', route: 'İzmir → Bursa', deliveryTime: 4.1, status: 'DELAYED', customerRating: 3 },
      { id: '3', containerNumber: 'GESU5555555', route: 'Ankara → İstanbul', deliveryTime: 3.0, status: 'COMPLETED', customerRating: 5 },
      { id: '4', containerNumber: 'HLBU7777777', route: 'Bursa → Antalya', deliveryTime: 0, status: 'CANCELLED', customerRating: 0 },
      { id: '5', containerNumber: 'CXDU8888888', route: 'İstanbul → İzmir', deliveryTime: 2.8, status: 'COMPLETED', customerRating: 4 }
    ]
  }
]

function CarrierPerformancePage() {
  const [selectedCarrier, setSelectedCarrier] = useState<CarrierPerformance>(mockData[0])
  const [timeRange, setTimeRange] = useState<'1M' | '3M' | '6M' | '1Y'>('3M')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600 bg-green-100'
      case 'DELAYED':
        return 'text-yellow-600 bg-yellow-100'
      case 'CANCELLED':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />
      case 'DELAYED':
        return <Clock className="h-4 w-4" />
      case 'CANCELLED':
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <BarChart3 className="mr-3 h-8 w-8 text-primary-600" />
              Taşıyıcı Firma Performansı
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Taşıyıcı firmalarının performans analizi ve detaylı raporları
            </p>
          </div>
          
          <div className="flex space-x-2">
            {['1M', '3M', '6M', '1Y'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range as any)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  timeRange === range
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Carrier Selection */}
      <div className="mb-6">
        <select
          value={selectedCarrier.id}
          onChange={(e) => {
            const carrier = mockData.find(c => c.id === e.target.value)
            if (carrier) setSelectedCarrier(carrier)
          }}
          className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {mockData.map((carrier) => (
            <option key={carrier.id} value={carrier.id}>
              {carrier.name}
            </option>
          ))}
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Toplam İş</p>
              <p className="text-2xl font-bold text-gray-900">{selectedCarrier.metrics.totalJobs}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600 font-medium">
              +{selectedCarrier.metrics.monthlyGrowth}%
            </span>
            <span className="text-sm text-gray-500 ml-2">bu ay</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Zamanında Teslimat</p>
              <p className="text-2xl font-bold text-gray-900">
                %{selectedCarrier.metrics.onTimeDeliveryRate}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Hedef: %90</span>
              <span className="text-green-600 font-medium">Hedefin üstünde</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Müşteri Memnuniyeti</p>
              <p className="text-2xl font-bold text-gray-900">
                {selectedCarrier.metrics.customerSatisfaction}/5
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {getRatingStars(selectedCarrier.metrics.customerSatisfaction)}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Toplam Gelir</p>
              <p className="text-2xl font-bold text-gray-900">
                €{selectedCarrier.metrics.revenue.toLocaleString('de-DE')}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-500">
              Ortalama teslimat süresi: {selectedCarrier.metrics.averageDeliveryTime} gün
            </span>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Aylık Performans</h3>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {selectedCarrier.monthlyStats.map((stat, index) => (
              <div key={stat.month} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-primary-600 rounded-full" style={{
                    backgroundColor: `hsl(${210 + index * 30}, 70%, 50%)`
                  }}></div>
                  <span className="text-sm font-medium text-gray-900">{stat.month}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{stat.jobs} iş</p>
                  <p className="text-xs text-gray-500">€{stat.revenue.toLocaleString('de-DE')}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Job Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">İş Durumu Dağılımı</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-gray-900">Tamamlanan</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-gray-900">
                  {selectedCarrier.metrics.completedJobs}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  (%{((selectedCarrier.metrics.completedJobs / selectedCarrier.metrics.totalJobs) * 100).toFixed(1)})
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <XCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-gray-900">İptal Edilen</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-gray-900">
                  {selectedCarrier.metrics.cancelledJobs}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  (%{((selectedCarrier.metrics.cancelledJobs / selectedCarrier.metrics.totalJobs) * 100).toFixed(1)})
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-gray-900">Devam Eden</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-gray-900">
                  {selectedCarrier.metrics.totalJobs - selectedCarrier.metrics.completedJobs - selectedCarrier.metrics.cancelledJobs}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Jobs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Son İşler</h3>
          <p className="text-sm text-gray-500">En son gerçekleştirilen işlerin detayları</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Konteyner No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rota
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teslimat Süresi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Müşteri Puanı
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {selectedCarrier.recentJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {job.containerNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {job.route}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {job.deliveryTime > 0 ? `${job.deliveryTime} gün` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                      {getStatusIcon(job.status)}
                      <span className="ml-1">
                        {job.status === 'COMPLETED' ? 'Tamamlandı' :
                         job.status === 'DELAYED' ? 'Gecikti' : 'İptal Edildi'}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {job.customerRating > 0 ? (
                      <div className="flex items-center">
                        {getRatingStars(job.customerRating)}
                        <span className="ml-2 text-sm text-gray-600">{job.customerRating}/5</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
      </div>
    </AppLayout>
  )
}

export default withAuth(CarrierPerformancePage)
