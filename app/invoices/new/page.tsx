'use client'

import { FileText, Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { withAuth } from '@/hooks/useAuth'
import AppLayout from '@/components/Layout/AppLayout'

function NewInvoicePage() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/invoices" className="mr-4 text-gray-500 hover:text-gray-700">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <FileText className="mr-3 h-8 w-8 text-primary-600" />
              Yeni Fatura Oluştur
            </h1>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-lg font-semibold text-gray-900">Fatura Formu (Demo)</h2>
            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto mb-6">
              Bu ekran üzerinden yeni fatura oluşturma işlemleri yapılabilecektir. 
              Müşteri seçimi, kalem ekleme ve tutar hesaplama gibi özellikler yakında eklenecektir.
            </p>
            <button disabled className="inline-flex items-center px-4 py-2 bg-gray-300 text-gray-500 text-sm font-medium rounded-md cursor-not-allowed">
              <Save className="mr-2 h-4 w-4" />
              Kaydet (Devre Dışı)
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default withAuth(NewInvoicePage, ['admin', 'manager'])
