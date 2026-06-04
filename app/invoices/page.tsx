'use client'

import { FileText, Plus, Search, MoreVertical } from 'lucide-react'
import Link from 'next/link'
import { withAuth } from '@/hooks/useAuth'
import AppLayout from '@/components/Layout/AppLayout'

function InvoicesPage() {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <FileText className="mr-3 h-8 w-8 text-primary-600" />
              Tüm Faturalar
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Sisteme kayıtlı tüm faturaları görüntüleyin ve yönetin.
            </p>
          </div>
          <Link
            href="/invoices/new"
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors"
          >
            <Plus className="mr-2 h-4 w-4" />
            Yeni Fatura Ekle
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Fatura No veya Müşteri ara..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Demo Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 text-center py-16">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-lg font-semibold text-gray-900">Faturalar (Demo)</h2>
          <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
            Faturalar sayfası şu anda geliştirme aşamasındadır. Burada tüm faturaların listelendiği gelişmiş bir veri tablosu yer alacaktır.
          </p>
        </div>
      </div>
    </AppLayout>
  )
}

export default withAuth(InvoicesPage)
