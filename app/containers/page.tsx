'use client'

import React, { useState, useEffect } from 'react'
import { ContainerForm as ContainerFormType, Container, ContainerDocument } from '@/types'
import ContainerForm from '@/components/ContainerForm'
import AppLayout from '@/components/Layout/AppLayout'
import { containerAPI } from '@/lib/mockApi'
import { Plus, Search, Filter, Package, Eye, Edit2, Trash2, Download } from 'lucide-react'
import toast from 'react-hot-toast'

const ContainersPage = () => {
  const [containers, setContainers] = useState<Container[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingContainer, setEditingContainer] = useState<Container | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  // Container verilerini yükle
  const loadContainers = async () => {
    try {
      setLoading(true)
      const response = await containerAPI.getAll({
        search: searchTerm,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        type: typeFilter !== 'all' ? typeFilter : undefined
      })
      setContainers(response.data?.containers || [])
    } catch (error) {
      console.error('Error loading containers:', error)
      toast.error('Konteynerler yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadContainers()
  }, [searchTerm, statusFilter, typeFilter])

  // Yeni konteyner ekle
  const handleCreateContainer = async (formData: ContainerFormType) => {
    try {
      await containerAPI.create(formData)
      toast.success('Konteyner başarıyla oluşturuldu')
      setShowForm(false)
      loadContainers()
    } catch (error) {
      console.error('Error creating container:', error)
      toast.error('Konteyner oluşturulurken hata oluştu')
    }
  }

  // Konteyner güncelle
  const handleUpdateContainer = async (formData: ContainerFormType) => {
    if (!editingContainer) return
    
    try {
      await containerAPI.update(editingContainer._id, formData)
      toast.success('Konteyner başarıyla güncellendi')
      setEditingContainer(null)
      setShowForm(false)
      loadContainers()
    } catch (error) {
      console.error('Error updating container:', error)
      toast.error('Konteyner güncellenirken hata oluştu')
    }
  }

  // Konteyner sil
  const handleDeleteContainer = async (id: string) => {
    if (!confirm('Bu konteyner silinecek. Emin misiniz?')) return
    
    try {
      await containerAPI.delete(id)
      toast.success('Konteyner başarıyla silindi')
      loadContainers()
    } catch (error) {
      console.error('Error deleting container:', error)
      toast.error('Konteyner silinirken hata oluştu')
    }
  }

  // Form açma/kapatma
  const openCreateForm = () => {
    setEditingContainer(null)
    setShowForm(true)
  }

  const openEditForm = (container: Container) => {
    setEditingContainer(container)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingContainer(null)
  }

  // Durum badge rengi
  const getStatusBadge = (status: string) => {
    const statusColors = {
      AVAILABLE: 'bg-green-100 text-green-800',
      EMPTY: 'bg-gray-100 text-gray-800',
      LOADED: 'bg-blue-100 text-blue-800',
      IN_TRANSIT: 'bg-yellow-100 text-yellow-800',
      DELIVERED: 'bg-purple-100 text-purple-800',
      MAINTENANCE: 'bg-red-100 text-red-800'
    }
    
    const statusLabels = {
      AVAILABLE: 'Müsait',
      EMPTY: 'Boş',
      LOADED: 'Yüklü',
      IN_TRANSIT: 'Transit',
      DELIVERED: 'Teslim Edildi',
      MAINTENANCE: 'Bakım'
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
      }`}>
        {statusLabels[status as keyof typeof statusLabels] || status}
      </span>
    )
  }

  // Tip badge rengi
  const getTypeBadge = (type: string) => {
    const typeColors = {
      '20FT': 'bg-indigo-100 text-indigo-800',
      '40FT': 'bg-orange-100 text-orange-800',
      '40HC': 'bg-teal-100 text-teal-800',
      '45FT': 'bg-pink-100 text-pink-800',
      'REEFER': 'bg-cyan-100 text-cyan-800'
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        typeColors[type as keyof typeof typeColors] || 'bg-gray-100 text-gray-800'
      }`}>
        {type}
      </span>
    )
  }

  if (showForm) {
    return (
      <AppLayout>
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {editingContainer ? 'Konteyner Düzenle' : 'Yeni Konteyner'}
            </h1>
            <p className="mt-2 text-gray-600">
              {editingContainer ? 'Mevcut konteyner bilgilerini güncelleyin' : 'Yeni bir konteyner ekleyin'}
            </p>
          </div>

          <ContainerForm
            initialData={editingContainer ? {
              referenceNumber: editingContainer.containerNumber, // Geçici
              containerNumber: editingContainer.containerNumber,
              type: editingContainer.type,
              // Diğer alanlar için varsayılan değerler
              pickupAddress: {
                address: '',
                city: '',
                country: ''
              },
              customsAddress: {
                address: '',
                city: '',
                country: ''
              },
              deliveryAddress: {
                address: '',
                city: '',
                country: ''
              },
              dropAddress: {
                address: '',
                city: '',
                country: ''
              },
              carrierId: ''
            } : undefined}
            onSubmit={editingContainer ? handleUpdateContainer : handleCreateContainer}
            onCancel={closeForm}
          />
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Konteynerler</h1>
              <p className="mt-2 text-gray-600">
                Konteyner yönetimi ve takibi
              </p>
            </div>
            <button
              onClick={openCreateForm}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Yeni Konteyner
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Konteyner numarası ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="AVAILABLE">Müsait</option>
                <option value="EMPTY">Boş</option>
                <option value="LOADED">Yüklü</option>
                <option value="IN_TRANSIT">Transit</option>
                <option value="DELIVERED">Teslim Edildi</option>
                <option value="MAINTENANCE">Bakım</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tüm Tipler</option>
                <option value="20FT">20FT</option>
                <option value="40FT">40FT</option>
                <option value="40HC">40HC</option>
                <option value="45FT">45FT</option>
                <option value="REEFER">REEFER</option>
              </select>
            </div>

            {/* Export Button */}
            <div>
              <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <Download className="w-4 h-4 mr-2" />
                Dışa Aktar
              </button>
            </div>
          </div>
        </div>

        {/* Container List */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Yükleniyor...</span>
            </div>
          </div>
        ) : containers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Henüz konteyner yok
            </h3>
            <p className="text-gray-600 mb-4">
              İlk konteynerinizi ekleyerek başlayın
            </p>
            <button
              onClick={openCreateForm}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Konteyner Ekle
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Konteyner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tip
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lokasyon
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Oluşturma
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {containers.map((container) => (
                    <tr key={container._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                              <Package className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {container.containerNumber}
                            </div>
                            <div className="text-sm text-gray-500">
                              {container._id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getTypeBadge(container.type)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(container.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {container.currentLocation?.address || 'Belirtilmemiş'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(container.createdAt).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="text-blue-600 hover:text-blue-900 p-1">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditForm(container)}
                            className="text-indigo-600 hover:text-indigo-900 p-1"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteContainer(container._id)}
                            className="text-red-600 hover:text-red-900 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Önceki
                </button>
                <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Sonraki
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">0</span> sonuçtan{' '}
                    <span className="font-medium">0</span> -{' '}
                    <span className="font-medium">0</span> arası gösteriliyor
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      Önceki
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                      1
                    </button>
                    <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      Sonraki
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}

export default ContainersPage
