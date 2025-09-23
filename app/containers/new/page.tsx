'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { containerAPI } from '@/lib/mockApi'
import { withAuth } from '@/hooks/useAuth'
import AppLayout from '@/components/Layout/AppLayout'
import ContainerForm from '@/components/ContainerForm'
import { ContainerForm as ContainerFormType } from '@/types'
import toast from 'react-hot-toast'
import { ArrowLeft, Package } from 'lucide-react'
import Link from 'next/link'

function NewContainerPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (data: ContainerFormType) => {
    setIsLoading(true)
    try {
      const response = await containerAPI.create(data)
      toast.success('Konteyner başarıyla oluşturuldu!')
      router.push('/containers')
    } catch (error) {
      console.error('Error creating container:', error)
      toast.error('Konteyner oluşturulurken hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/containers')
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link
              href="/containers"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Konteynerlere Geri Dön
            </Link>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-lg">
              <Package className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Yeni Konteyner Oluştur</h1>
              <p className="text-sm text-gray-500">
                Yeni bir konteyner kaydı oluşturun ve tüm gerekli bilgileri girin
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <ContainerForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </div>
    </AppLayout>
  )
}

export default withAuth(NewContainerPage, ['admin', 'manager'])
