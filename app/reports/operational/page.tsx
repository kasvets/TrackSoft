'use client'

import { Package, Truck, MapPin } from 'lucide-react'
import { withAuth } from '@/hooks/useAuth'
import AppLayout from '@/components/Layout/AppLayout'

function OperationalReportPage() {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Package className="mr-3 h-8 w-8 text-primary-600" />
            Operasyonel Rapor
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Lojistik süreçleri, konteyner hareketleri ve rota analizleri.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
            <Truck className="mx-auto h-8 w-8 text-blue-600 mb-2" />
            <h3 className="text-2xl font-bold text-gray-900">45</h3>
            <p className="text-sm text-gray-500">Aktif Sefer</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
            <Package className="mx-auto h-8 w-8 text-green-600 mb-2" />
            <h3 className="text-2xl font-bold text-gray-900">128</h3>
            <p className="text-sm text-gray-500">Teslim Edilen Konteyner</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
            <MapPin className="mx-auto h-8 w-8 text-yellow-600 mb-2" />
            <h3 className="text-2xl font-bold text-gray-900">12</h3>
            <p className="text-sm text-gray-500">Gecikmeli Teslimat</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center py-16">
          <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-lg font-semibold text-gray-900">Harita ve Rota Analizleri (Demo)</h2>
          <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
            Gelişmiş harita destekli rota analizi ve operasyonel dar boğaz raporlaması entegrasyonu hazırlanmaktadır.
          </p>
        </div>
      </div>
    </AppLayout>
  )
}

export default withAuth(OperationalReportPage, ['admin', 'manager'])
