'use client'

import React, { useState } from 'react'
import { ContainerForm as ContainerFormType, ContainerDocument } from '@/types'
import FileUpload from './FileUpload'
import { Save, Package, MapPin, FileText, Truck } from 'lucide-react'
import toast from 'react-hot-toast'
import { getActiveCarriers, getCarrierById } from '@/lib/mockCarriers'

interface ContainerFormProps {
  initialData?: Partial<ContainerFormType>
  onSubmit: (data: ContainerFormType) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

const ContainerForm: React.FC<ContainerFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<ContainerFormType>({
    referenceNumber: initialData?.referenceNumber || '',
    containerNumber: initialData?.containerNumber || '',
    type: initialData?.type || '20FT',
    pickupAddress: {
      address: initialData?.pickupAddress?.address || '',
      city: initialData?.pickupAddress?.city || '',
      country: initialData?.pickupAddress?.country || '',
      postalCode: initialData?.pickupAddress?.postalCode || '',
      contactPerson: initialData?.pickupAddress?.contactPerson || '',
      contactPhone: initialData?.pickupAddress?.contactPhone || '',
    },
    customsAddress: {
      address: initialData?.customsAddress?.address || '',
      city: initialData?.customsAddress?.city || '',
      country: initialData?.customsAddress?.country || '',
      postalCode: initialData?.customsAddress?.postalCode || '',
      contactPerson: initialData?.customsAddress?.contactPerson || '',
      contactPhone: initialData?.customsAddress?.contactPhone || '',
    },
    deliveryAddress: {
      address: initialData?.deliveryAddress?.address || '',
      city: initialData?.deliveryAddress?.city || '',
      country: initialData?.deliveryAddress?.country || '',
      postalCode: initialData?.deliveryAddress?.postalCode || '',
      contactPerson: initialData?.deliveryAddress?.contactPerson || '',
      contactPhone: initialData?.deliveryAddress?.contactPhone || '',
    },
    dropAddress: {
      address: initialData?.dropAddress?.address || '',
      city: initialData?.dropAddress?.city || '',
      country: initialData?.dropAddress?.country || '',
      postalCode: initialData?.dropAddress?.postalCode || '',
      contactPerson: initialData?.dropAddress?.contactPerson || '',
      contactPhone: initialData?.dropAddress?.contactPhone || '',
    },
    carrierId: initialData?.carrierId || '',
    notes: initialData?.notes || '',
    documents: initialData?.documents || [],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Referans numarası otomatik oluştur
  const generateReferenceNumber = () => {
    const prefix = 'REF'
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.random().toString(36).substr(2, 3).toUpperCase()
    return `${prefix}-${timestamp}-${random}`
  }

  // Form validasyonu
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.referenceNumber.trim()) {
      newErrors.referenceNumber = 'Referans numarası gerekli'
    }
    if (!formData.containerNumber.trim()) {
      newErrors.containerNumber = 'Konteyner numarası gerekli'
    }
    if (!formData.pickupAddress.address.trim()) {
      newErrors.pickupAddress = 'Pick up adresi gerekli'
    }
    if (!formData.customsAddress.address.trim()) {
      newErrors.customsAddress = 'Customs adresi gerekli'
    }
    if (!formData.deliveryAddress.address.trim()) {
      newErrors.deliveryAddress = 'Delivery adresi gerekli'
    }
    if (!formData.dropAddress.address.trim()) {
      newErrors.dropAddress = 'Drop adresi gerekli'
    }
    if (!formData.carrierId) {
      newErrors.carrierId = 'Taşıyıcı firma seçimi gerekli'
    }

    // CMR belgeleri kontrolü
    const cmrDocuments = formData.documents?.filter(doc => doc.type === 'CMR') || []
    if (cmrDocuments.length === 0) {
      newErrors.cmrDocuments = 'En az bir CMR belgesi yüklemeniz gerekli'
    }

    // T1 belgeleri kontrolü
    const t1Documents = formData.documents?.filter(doc => doc.type === 'T1') || []
    if (t1Documents.length === 0) {
      newErrors.t1Documents = 'En az bir T1 belgesi yüklemeniz gerekli'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Lütfen tüm gerekli alanları doldurun')
      return
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const updateFormData = (path: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev }
      const keys = path.split('.')
      let current: any = newData
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!(keys[i] in current)) {
          current[keys[i]] = {}
        }
        current = current[keys[i]]
      }
      
      current[keys[keys.length - 1]] = value
      return newData
    })
  }

  const handleDocumentsChange = (documents: ContainerDocument[]) => {
    setFormData(prev => ({ ...prev, documents }))
  }

  const AddressSection: React.FC<{
    title: string
    icon: React.ReactNode
    prefix: string
    data: any
    error?: string
  }> = ({ title, icon, prefix, data, error }) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center space-x-2 mb-4">
        {icon}
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Adres *
          </label>
          <textarea
            value={data.address}
            onChange={(e) => updateFormData(`${prefix}.address`, e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Tam adres giriniz"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Şehir *
          </label>
          <input
            type="text"
            value={data.city}
            onChange={(e) => updateFormData(`${prefix}.city`, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Şehir"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ülke *
          </label>
          <input
            type="text"
            value={data.country}
            onChange={(e) => updateFormData(`${prefix}.country`, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Ülke"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Posta Kodu
          </label>
          <input
            type="text"
            value={data.postalCode}
            onChange={(e) => updateFormData(`${prefix}.postalCode`, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Posta kodu"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            İletişim Kişisi
          </label>
          <input
            type="text"
            value={data.contactPerson}
            onChange={(e) => updateFormData(`${prefix}.contactPerson`, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="İletişim kişisi adı"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            İletişim Telefonu
          </label>
          <input
            type="tel"
            value={data.contactPhone}
            onChange={(e) => updateFormData(`${prefix}.contactPhone`, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="+90 XXX XXX XX XX"
          />
        </div>
      </div>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Temel Bilgiler */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-2 mb-6">
          <Package className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Konteyner Bilgileri</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Referans Numarası *
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={formData.referenceNumber}
                onChange={(e) => updateFormData('referenceNumber', e.target.value)}
                className={`flex-1 px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.referenceNumber ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="REF-XXXXXX-XXX"
              />
              <button
                type="button"
                onClick={() => updateFormData('referenceNumber', generateReferenceNumber())}
                className="px-3 py-2 text-sm bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Otomatik
              </button>
            </div>
            {errors.referenceNumber && (
              <p className="text-sm text-red-600 mt-1">{errors.referenceNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Konteyner Numarası *
            </label>
            <input
              type="text"
              value={formData.containerNumber}
              onChange={(e) => updateFormData('containerNumber', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                errors.containerNumber ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="TCLU-1234567"
            />
            {errors.containerNumber && (
              <p className="text-sm text-red-600 mt-1">{errors.containerNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Konteyner Tipi
            </label>
            <select
              value={formData.type}
              onChange={(e) => updateFormData('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="20FT">20FT</option>
              <option value="40FT">40FT</option>
              <option value="40HC">40HC</option>
              <option value="45FT">45FT</option>
              <option value="REEFER">REEFER</option>
            </select>
          </div>

        </div>
      </div>

      {/* Adres Bilgileri */}
      <div className="space-y-6">
        <AddressSection
          title="Pick Up Adresi"
          icon={<MapPin className="w-5 h-5 text-green-600" />}
          prefix="pickupAddress"
          data={formData.pickupAddress}
          error={errors.pickupAddress}
        />

        <AddressSection
          title="Customs Adresi"
          icon={<MapPin className="w-5 h-5 text-orange-600" />}
          prefix="customsAddress"
          data={formData.customsAddress}
          error={errors.customsAddress}
        />

        <AddressSection
          title="Delivery Adresi"
          icon={<MapPin className="w-5 h-5 text-blue-600" />}
          prefix="deliveryAddress"
          data={formData.deliveryAddress}
          error={errors.deliveryAddress}
        />

        <AddressSection
          title="Drop Adresi"
          icon={<MapPin className="w-5 h-5 text-red-600" />}
          prefix="dropAddress"
          data={formData.dropAddress}
          error={errors.dropAddress}
        />
      </div>

      {/* Notlar */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-2 mb-6">
          <FileText className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Notlar</h3>
        </div>

        <textarea
          value={formData.notes}
          onChange={(e) => updateFormData('notes', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Ek notlar, özel talimatlar..."
        />
      </div>

      {/* CMR Belgeleri */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-2 mb-6">
          <FileText className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">CMR Belgeleri *</h3>
          <span className="text-sm text-red-600">(Zorunlu)</span>
        </div>

        {errors.cmrDocuments && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errors.cmrDocuments}</p>
          </div>
        )}

        <FileUpload
          documents={formData.documents?.filter(doc => doc.type === 'CMR') || []}
          onDocumentsChange={(docs) => {
            const otherDocs = formData.documents?.filter(doc => doc.type !== 'CMR') || []
            const cmrDocs = docs.map(doc => ({ ...doc, type: 'CMR' as const }))
            handleDocumentsChange([...otherDocs, ...cmrDocs])
          }}
          maxFiles={5}
          documentType="CMR"
        />
      </div>

      {/* T1 Belgeleri */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-2 mb-6">
          <FileText className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">T1 Belgeleri *</h3>
          <span className="text-sm text-red-600">(Zorunlu)</span>
        </div>

        {errors.t1Documents && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errors.t1Documents}</p>
          </div>
        )}

        <FileUpload
          documents={formData.documents?.filter(doc => doc.type === 'T1') || []}
          onDocumentsChange={(docs) => {
            const otherDocs = formData.documents?.filter(doc => doc.type !== 'T1') || []
            const t1Docs = docs.map(doc => ({ ...doc, type: 'T1' as const }))
            handleDocumentsChange([...otherDocs, ...t1Docs])
          }}
          maxFiles={5}
          documentType="T1"
        />
      </div>

      {/* Taşıyıcı Firma Seçimi */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center space-x-2 mb-6">
          <Truck className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">Taşıyıcı Firma Seçimi</h3>
          <span className="text-sm text-red-600">*</span>
        </div>

        {errors.carrierId && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errors.carrierId}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Taşıyıcı Firma *
            </label>
            <select
              value={formData.carrierId}
              onChange={(e) => updateFormData('carrierId', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                errors.carrierId ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Taşıyıcı firma seçiniz...</option>
              {getActiveCarriers().map((carrier) => (
                <option key={carrier.id} value={carrier.id}>
                  {carrier.name} - {carrier.contactPerson} (Puan: {carrier.rating})
                </option>
              ))}
            </select>
          </div>

          {formData.carrierId && (
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Seçili Firma Bilgileri</h4>
              {(() => {
                const selectedCarrier = getCarrierById(formData.carrierId)
                if (!selectedCarrier) return null
                
                return (
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">Firma:</span> {selectedCarrier.name}</p>
                    <p><span className="font-medium">İletişim:</span> {selectedCarrier.contactPerson}</p>
                    <p><span className="font-medium">Telefon:</span> {selectedCarrier.phone}</p>
                    <p><span className="font-medium">E-posta:</span> {selectedCarrier.email}</p>
                    <p><span className="font-medium">Adres:</span> {selectedCarrier.address}</p>
                    <p><span className="font-medium">Puan:</span> ⭐ {selectedCarrier.rating}/5.0</p>
                    <p><span className="font-medium">Aktif İşler:</span> {selectedCarrier.activeJobs}</p>
                    <div className="mt-2">
                      <span className="font-medium">Uzmanlık:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedCarrier.specializations.map((spec, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Form Butonları */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          İptal
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>
    </form>
  )
}

export default ContainerForm
