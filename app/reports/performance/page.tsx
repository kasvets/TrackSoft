'use client'

import { BarChart3, TrendingUp, Users } from 'lucide-react'
import { withAuth } from '@/hooks/useAuth'
import AppLayout from '@/components/Layout/AppLayout'

function PerformanceReportPage() {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="mr-3 h-8 w-8 text-primary-600" />
            Performans Raporu
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Personel ve operasyon genel performans değerlendirmeleri.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-4">
            <div className="p-3 bg-primary-100 text-primary-600 rounded-full">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Genel Başarı Oranı</p>
              <h3 className="text-2xl font-bold text-gray-900">%94.5</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Aktif Personel</p>
              <h3 className="text-2xl font-bold text-gray-900">12</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-full">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Aylık Görevler</p>
              <h3 className="text-2xl font-bold text-gray-900">1,245</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center py-16">
          <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-lg font-semibold text-gray-900">Grafikler (Demo)</h2>
          <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
            Performans detay grafiklerinin (BarChart, LineChart vb.) gösterileceği modül yapım aşamasındadır.
          </p>
        </div>
      </div>
    </AppLayout>
  )
}

export default withAuth(PerformanceReportPage, ['admin', 'manager'])
