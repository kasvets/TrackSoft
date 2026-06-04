'use client'

import { Settings, Save, Bell, Shield, User } from 'lucide-react'
import { withAuth } from '@/hooks/useAuth'
import AppLayout from '@/components/Layout/AppLayout'

function SettingsPage() {
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Settings className="mr-3 h-8 w-8 text-primary-600" />
              Sistem Ayarları
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Profil, güvenlik ve genel uygulama tercihlerini yönetin.
            </p>
          </div>
          <button className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors">
            <Save className="mr-2 h-4 w-4" />
            Değişiklikleri Kaydet
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button className="flex-1 py-4 px-6 text-sm font-medium text-primary-600 border-b-2 border-primary-600 flex items-center justify-center bg-gray-50">
              <User className="mr-2 h-4 w-4" />
              Profil Bilgileri
            </button>
            <button className="flex-1 py-4 px-6 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 flex items-center justify-center">
              <Shield className="mr-2 h-4 w-4" />
              Güvenlik
            </button>
            <button className="flex-1 py-4 px-6 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 flex items-center justify-center">
              <Bell className="mr-2 h-4 w-4" />
              Bildirimler
            </button>
          </div>
          
          <div className="p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent" defaultValue="Mert K." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-posta Adresi</label>
                <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent" defaultValue="admin@greenlog.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Şirket Adı</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent" defaultValue="Bey Logistics" disabled />
                <p className="mt-1 text-xs text-gray-500">Şirket bilgileri sadece sistem yöneticisi tarafından değiştirilebilir.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default withAuth(SettingsPage, ['admin'])
