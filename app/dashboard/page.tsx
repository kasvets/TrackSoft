'use client'

import React from 'react'
import { useQuery } from 'react-query'
import { dashboardAPI } from '@/lib/mockApi'
import { withAuth } from '@/hooks/useAuth'
import AppLayout from '@/components/Layout/AppLayout'
import StatsCard from '@/components/Dashboard/StatsCard'
import RecentActivities from '@/components/Dashboard/RecentActivities'
import AlertsPanel from '@/components/Dashboard/AlertsPanel'
import {
  Package,
  FileText,
  Truck,
  Users,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Clock,
  Euro
} from 'lucide-react'
import { DashboardOverview } from '@/types'

function DashboardPage() {
  const { data, isLoading, error } = useQuery(
    'dashboard-overview',
    () => dashboardAPI.getOverview(),
    {
      refetchInterval: 30000, // Refresh every 30 seconds
    }
  )

  const overview: DashboardOverview = data?.data || {
    containers: {
      total: 0,
      byStatus: {},
      recentlyAdded: 0,
      deliveredThisMonth: 0
    },
    invoices: {
      byStatus: {},
      totalRevenue: 0,
      pendingRevenue: 0,
      overdue: 0,
      recentlyCreated: 0
    },
    loaders: {
      total: 0,
      byStatus: {}
    },
    team: {
      activeManagers: 0
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Lojistik operasyonlarınızın genel görünümü
          </p>
        </div>

        {/* Error State */}
        {(error as any) && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Veriler yüklenirken hata oluştu
                </h3>
                <p className="mt-2 text-sm text-red-700">
                  Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Toplam Konteyner"
            value={overview?.containers?.total || 0}
            icon={Package}
            color="blue"
            href="/containers"
            loading={isLoading}
            change={{
              value: overview?.containers?.recentlyAdded || 0,
              type: 'increase'
            }}
          />
          
          <StatsCard
            title="Aktif Taşımalar"
            value={overview?.containers?.byStatus?.IN_TRANSIT || 0}
            icon={Truck}
            color="purple"
            href="/containers?status=IN_TRANSIT"
            loading={isLoading}
          />
          
          <StatsCard
            title="Bu Ay Gelir"
            value={overview?.invoices?.totalRevenue 
              ? `€${overview.invoices.totalRevenue.toLocaleString('de-DE')}` 
              : '€0'
            }
            icon={Euro}
            color="green"
            href="/invoices?status=PAID"
            loading={isLoading}
          />
          
          <StatsCard
            title="Geciken Faturalar"
            value={overview?.invoices?.overdue || 0}
            icon={AlertTriangle}
            color="red"
            href="/invoices?status=OVERDUE"
            loading={isLoading}
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Müsait Yükleyici"
            value={overview?.loaders?.byStatus?.AVAILABLE || 0}
            icon={Users}
            color="indigo"
            href="/loaders?status=AVAILABLE"
            loading={isLoading}
          />
          
          <StatsCard
            title="Teslim Edildi (Bu Ay)"
            value={overview?.containers?.deliveredThisMonth || 0}
            icon={TrendingUp}
            color="green"
            href="/containers?status=DELIVERED"
            loading={isLoading}
          />
          
          <StatsCard
            title="Bekleyen Gelir"
            value={overview?.invoices?.pendingRevenue 
              ? `€${overview.invoices.pendingRevenue.toLocaleString('de-DE')}` 
              : '€0'
            }
            icon={Clock}
            color="yellow"
            href="/invoices?status=SENT"
            loading={isLoading}
          />
          
          <StatsCard
            title="Aktif Yöneticiler"
            value={overview?.team?.activeManagers || 0}
            icon={Users}
            color="blue"
            href="/container-managers"
            loading={isLoading}
          />
        </div>

        {/* Status Breakdown */}
        {overview && !isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Container Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Konteyner Durumları</h3>
              </div>
              <div className="space-y-4">
                {Object.entries(overview.containers?.byStatus || {}).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-sm font-medium text-gray-700">
                      {status === 'AVAILABLE' ? 'Müsait' :
                       status === 'LOADED' ? 'Yüklü' :
                       status === 'IN_TRANSIT' ? 'Yolda' :
                       status === 'DELIVERED' ? 'Teslim' :
                       status === 'MAINTENANCE' ? 'Bakım' :
                       status === 'EMPTY' ? 'Boş' : status}
                    </span>
                    <span className="text-sm font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Invoice Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Fatura Durumları</h3>
              </div>
              <div className="space-y-4">
                {Object.entries(overview.invoices?.byStatus || {}).map(([status, data]) => (
                  <div key={status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-sm font-medium text-gray-700">
                      {status === 'DRAFT' ? 'Taslak' :
                       status === 'SENT' ? 'Gönderildi' :
                       status === 'PAID' ? 'Ödendi' :
                       status === 'OVERDUE' ? 'Gecikmiş' :
                       status === 'CANCELLED' ? 'İptal' : status}
                    </span>
                    <span className="text-sm font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                      {typeof data === 'object' ? data.count : data}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Loader Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Yükleyici Durumları</h3>
              </div>
              <div className="space-y-4">
                {Object.entries(overview.loaders?.byStatus || {}).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-sm font-medium text-gray-700">
                      {status === 'AVAILABLE' ? 'Müsait' :
                       status === 'ASSIGNED' ? 'Atanmış' :
                       status === 'IN_TRANSIT' ? 'Yolda' :
                       status === 'LOADING' ? 'Yükleme' :
                       status === 'UNLOADING' ? 'Boşaltma' :
                       status === 'MAINTENANCE' ? 'Bakım' :
                       status === 'OFF_DUTY' ? 'Mesai Dışı' : status}
                    </span>
                    <span className="text-sm font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Activities and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivities />
          <AlertsPanel />
        </div>
      </div>
    </AppLayout>
  )
}

export default withAuth(DashboardPage)
