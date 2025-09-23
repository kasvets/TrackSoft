'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Save, 
  Truck,
  User,
  Phone,
  Mail,
  MapPin,
  Building,
  FileText,
  Star,
  Plus,
  X
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { withAuth } from '@/hooks/useAuth'
import AppLayout from '@/components/Layout/AppLayout'

interface CarrierFormData {
  name: string
  taxNumber: string
  contactPerson: string
  phone: string
  email: string
  address: string
  city: string
  country: string
  website: string
  description: string
  specializations: string[]
  bankAccount: {
    bankName: string
    accountNumber: string
    iban: string
  }
  documents: {
    licenseNumber: string
    insurancePolicy: string
    taxCertificate: string
  }
}

const specializationOptions = [
  'Konteyner Taşımacılığı',
  'Uluslararası Nakliye',
  'Yurtiçi Taşımacılık',
  'Hızlı Teslimat',
  'Soğuk Zincir',
  'Özel Taşımacılık',
  'Bölgesel Taşımacılık',
  'Ağır Yük Taşımacılığı',
  'Kimyasal Madde Taşımacılığı',
  'Tehlikeli Madde Taşımacılığı'
]

function NewCarrierPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [newSpecialization, setNewSpecialization] = useState('')
  const [formData, setFormData] = useState<CarrierFormData>({
    name: '',
    taxNumber: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    country: 'Türkiye',
    website: '',
    description: '',
    specializations: [],
    bankAccount: {
      bankName: '',
      accountNumber: '',
      iban: ''
    },
    documents: {
      licenseNumber: '',
      insurancePolicy: '',
      taxCertificate: ''
    }
  })

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => {
        const parentKey = parent as keyof CarrierFormData
        const parentValue = prev[parentKey]
        
        // Type guard to ensure we're dealing with an object
        if (typeof parentValue === 'object' && parentValue !== null && !Array.isArray(parentValue)) {
          return {
            ...prev,
            [parent]: {
              ...parentValue,
              [child]: value
            }
          }
        }
        
        return prev
      })
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const addSpecialization = (specialization: string) => {
    if (specialization && !formData.specializations.includes(specialization)) {
      setFormData(prev => ({
        ...prev,
        specializations: [...prev.specializations, specialization]
      }))
    }
  }

  const removeSpecialization = (specialization: string) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.filter(s => s !== specialization)
    }))
  }

  const addCustomSpecialization = () => {
    if (newSpecialization.trim()) {
      addSpecialization(newSpecialization.trim())
      setNewSpecialization('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success('Taşıyıcı firma başarıyla eklendi!')
      router.push('/carriers')
    } catch (error) {
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link
            href="/carriers"
            className="mr-4 p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Truck className="mr-3 h-8 w-8 text-primary-600" />
              Yeni Taşıyıcı Firma Ekle
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Yeni bir taşıyıcı firma kaydı oluşturun
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center mb-4">
            <Building className="h-5 w-5 text-primary-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Temel Bilgiler</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Firma Adı *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Firma adını girin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vergi Numarası *
              </label>
              <input
                type="text"
                required
                value={formData.taxNumber}
                onChange={(e) => handleInputChange('taxNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Vergi numarasını girin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                İletişim Kişisi *
              </label>
              <input
                type="text"
                required
                value={formData.contactPerson}
                onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="İletişim kişisinin adını girin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefon *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="+90 XXX XXX XX XX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-posta *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="E-posta adresini girin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Web Sitesi
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Açıklama
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Firma hakkında kısa bir açıklama..."
            />
          </div>
        </motion.div>

        {/* Address Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center mb-4">
            <MapPin className="h-5 w-5 text-primary-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Adres Bilgileri</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adres *
              </label>
              <textarea
                rows={3}
                required
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Tam adresi girin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Şehir *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Şehir adını girin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ülke *
              </label>
              <input
                type="text"
                required
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </motion.div>

        {/* Specializations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center mb-4">
            <Star className="h-5 w-5 text-primary-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Uzmanlık Alanları</h2>
          </div>

          <div className="space-y-4">
            {/* Selected Specializations */}
            {formData.specializations.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Seçili Uzmanlık Alanları:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.specializations.map((spec) => (
                    <span
                      key={spec}
                      className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full"
                    >
                      {spec}
                      <button
                        type="button"
                        onClick={() => removeSpecialization(spec)}
                        className="ml-2 text-primary-600 hover:text-primary-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Available Specializations */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Mevcut Uzmanlık Alanları:</p>
              <div className="flex flex-wrap gap-2">
                {specializationOptions
                  .filter(spec => !formData.specializations.includes(spec))
                  .map((spec) => (
                    <button
                      key={spec}
                      type="button"
                      onClick={() => addSpecialization(spec)}
                      className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {spec}
                    </button>
                  ))}
              </div>
            </div>

            {/* Custom Specialization */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Özel Uzmanlık Alanı Ekle:</p>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newSpecialization}
                  onChange={(e) => setNewSpecialization(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Özel uzmanlık alanı girin"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSpecialization())}
                />
                <button
                  type="button"
                  onClick={addCustomSpecialization}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  Ekle
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bank Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center mb-4">
            <FileText className="h-5 w-5 text-primary-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Banka Bilgileri</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banka Adı
              </label>
              <input
                type="text"
                value={formData.bankAccount.bankName}
                onChange={(e) => handleInputChange('bankAccount.bankName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Banka adını girin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hesap Numarası
              </label>
              <input
                type="text"
                value={formData.bankAccount.accountNumber}
                onChange={(e) => handleInputChange('bankAccount.accountNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Hesap numarasını girin"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IBAN
              </label>
              <input
                type="text"
                value={formData.bankAccount.iban}
                onChange={(e) => handleInputChange('bankAccount.iban', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="TR XX XXXX XXXX XXXX XXXX XXXX XX"
              />
            </div>
          </div>
        </motion.div>

        {/* Documents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center mb-4">
            <FileText className="h-5 w-5 text-primary-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Belgeler</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ruhsat Numarası
              </label>
              <input
                type="text"
                value={formData.documents.licenseNumber}
                onChange={(e) => handleInputChange('documents.licenseNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Ruhsat numarasını girin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sigorta Poliçe No
              </label>
              <input
                type="text"
                value={formData.documents.insurancePolicy}
                onChange={(e) => handleInputChange('documents.insurancePolicy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Sigorta poliçe numarasını girin"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vergi Levhası No
              </label>
              <input
                type="text"
                value={formData.documents.taxCertificate}
                onChange={(e) => handleInputChange('documents.taxCertificate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Vergi levhası numarasını girin"
              />
            </div>
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex justify-end space-x-4"
        >
          <Link
            href="/carriers"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            İptal
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Kaydediliyor...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Kaydet
              </>
            )}
          </button>
        </motion.div>
      </form>
      </div>
    </AppLayout>
  )
}

export default withAuth(NewCarrierPage)
