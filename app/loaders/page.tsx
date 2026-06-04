'use client'

import { Users, Search } from 'lucide-react'
import { withAuth } from '@/hooks/useAuth'
import AppLayout from '@/components/Layout/AppLayout'

function LoadersPage() {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Users className="mr-3 h-8 w-8 text-primary-600" />
            Yükleyiciler
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Aktif, müsait veya yolda olan yükleyicileri yönetin.
          </p>
        </div>

        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Yükleyici ara..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 text-center py-16">
          <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-lg font-semibold text-gray-900">Yükleyici Listesi (Demo)</h2>
          <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
            Yükleyici personel veya firmaların bulunduğu liste modülü hazırlanmaktadır.
          </p>
        </div>
      </div>
    </AppLayout>
  )
}

export default withAuth(LoadersPage)
