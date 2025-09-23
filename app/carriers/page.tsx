'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Truck, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Star,
  Phone,
  Mail,
  MapPin,
  Calendar,
  TrendingUp,
  Package
} from 'lucide-react'
import Link from 'next/link'
import { useAuth, withAuth } from '@/hooks/useAuth'
import AppLayout from '@/components/Layout/AppLayout'
import { Carrier } from '@/types'
import { mockCarriers } from '@/lib/mockCarriers'

const statusColors = {
  ACTIVE: 'bg-green-100 text-green-800',
  INACTIVE: 'bg-gray-100 text-gray-800',
  SUSPENDED: 'bg-red-100 text-red-800'
}

const statusLabels = {
  ACTIVE: 'Aktif',
  INACTIVE: 'Pasif',
  SUSPENDED: 'Askıya Alınmış'
}

function CarriersPage() {
  const [carriers, setCarriers] = useState<Carrier[]>(mockCarriers)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'totalJobs'>('name')
  const { hasRole } = useAuth()

  const filteredCarriers = carriers
    .filter(carrier => {
      const matchesSearch = carrier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          carrier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          carrier.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'ALL' || carrier.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'totalJobs':
          return b.totalJobs - a.totalJobs
        default:
          return a.name.localeCompare(b.name)
      }
    })

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
              <Truck className="mr-3 h-8 w-8 text-primary-600" />
              Taşıyıcı Firmalar
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Taşıyıcı firmalarınızı yönetin ve performanslarını takip edin
            </p>
          </div>
          
          {hasRole(['admin', 'manager']) && (
            <Link
              href="/carriers/new"
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors"
            >
              <Plus className="mr-2 h-4 w-4" />
              Yeni Firma Ekle
            </Link>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Firma adı, kişi veya e-posta ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="ALL">Tüm Durumlar</option>
              <option value="ACTIVE">Aktif</option>
              <option value="INACTIVE">Pasif</option>
              <option value="SUSPENDED">Askıya Alınmış</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'rating' | 'totalJobs')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="name">İsme Göre Sırala</option>
              <option value="rating">Puana Göre Sırala</option>
              <option value="totalJobs">İş Sayısına Göre Sırala</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Truck className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Toplam Firma</p>
              <p className="text-2xl font-bold text-gray-900">{carriers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Aktif Firma</p>
              <p className="text-2xl font-bold text-gray-900">
                {carriers.filter(c => c.status === 'ACTIVE').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Package className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Aktif İşler</p>
              <p className="text-2xl font-bold text-gray-900">
                {carriers.reduce((sum, c) => sum + c.activeJobs, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Ort. Puan</p>
              <p className="text-2xl font-bold text-gray-900">
                {(carriers.reduce((sum, c) => sum + c.rating, 0) / carriers.length).toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Carriers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCarriers.map((carrier) => (
          <motion.div
            key={carrier.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {carrier.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[carrier.status]}`}>
                      {statusLabels[carrier.status]}
                    </span>
                  </div>
                </div>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center space-x-1">
                  {getRatingStars(carrier.rating)}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {carrier.rating.toFixed(1)}
                </span>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{carrier.contactPerson}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{carrier.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{carrier.address}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">{carrier.totalJobs}</p>
                  <p className="text-xs text-gray-500">Toplam İş</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-primary-600">{carrier.activeJobs}</p>
                  <p className="text-xs text-gray-500">Aktif İş</p>
                </div>
              </div>

              {/* Specializations */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {carrier.specializations.slice(0, 2).map((spec, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                    >
                      {spec}
                    </span>
                  ))}
                  {carrier.specializations.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                      +{carrier.specializations.length - 2}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Link
                  href={`/carriers/${carrier.id}`}
                  className="flex-1 text-center px-3 py-2 bg-primary-50 text-primary-700 text-sm font-medium rounded-md hover:bg-primary-100 transition-colors"
                >
                  Detaylar
                </Link>
                <Link
                  href={`/carriers/${carrier.id}/performance`}
                  className="flex-1 text-center px-3 py-2 bg-gray-50 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors"
                >
                  Performans
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCarriers.length === 0 && (
        <div className="text-center py-12">
          <Truck className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Taşıyıcı firma bulunamadı</h3>
          <p className="mt-1 text-sm text-gray-500">
            Arama kriterlerinizi değiştirin veya yeni bir firma ekleyin.
          </p>
        </div>
      )}
      </div>
    </AppLayout>
  )
}

export default withAuth(CarriersPage)
