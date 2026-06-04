'use client'

import { DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { withAuth } from '@/hooks/useAuth'
import AppLayout from '@/components/Layout/AppLayout'

function FinancialReportPage() {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <DollarSign className="mr-3 h-8 w-8 text-primary-600" />
            Finansal Rapor
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Aylık ve yıllık gelir-gider dengeleri ile finansal istatistikler.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Toplam Gelir (Bu Ay)</p>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">₺145,000</h3>
              <span className="flex items-center text-green-600 text-sm font-medium">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                12%
              </span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Toplam Gider (Bu Ay)</p>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">₺82,400</h3>
              <span className="flex items-center text-red-600 text-sm font-medium">
                <ArrowDownRight className="h-4 w-4 mr-1" />
                4%
              </span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Net Kar</p>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">₺62,600</h3>
              <span className="flex items-center text-green-600 text-sm font-medium">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                8%
              </span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Bekleyen Ödemeler</p>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-yellow-600">₺15,200</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center py-16">
          <DollarSign className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-lg font-semibold text-gray-900">Finansal Grafikler (Demo)</h2>
          <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
            Gelişmiş finansal tablo ve grafik analizleri modülü yakında aktif edilecektir.
          </p>
        </div>
      </div>
    </AppLayout>
  )
}

export default withAuth(FinancialReportPage, ['admin', 'manager'])
