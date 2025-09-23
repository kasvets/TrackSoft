import { Carrier } from '@/types'

export const mockCarriers: Carrier[] = [
  {
    id: '1',
    name: 'Anadolu Lojistik A.Ş.',
    contactPerson: 'Mehmet Yılmaz',
    phone: '+90 212 555 0101',
    email: 'mehmet@anadolulojistik.com',
    address: 'İstanbul, Türkiye',
    rating: 4.8,
    totalJobs: 245,
    activeJobs: 12,
    registrationDate: '2023-01-15',
    status: 'ACTIVE',
    specializations: ['Konteyner Taşımacılığı', 'Uluslararası Nakliye']
  },
  {
    id: '2',
    name: 'Marmara Taşımacılık Ltd.',
    contactPerson: 'Ayşe Kaya',
    phone: '+90 216 555 0202',
    email: 'ayse@marmaratasimacilik.com',
    address: 'Bursa, Türkiye',
    rating: 4.6,
    totalJobs: 189,
    activeJobs: 8,
    registrationDate: '2023-03-22',
    status: 'ACTIVE',
    specializations: ['Yurtiçi Taşımacılık', 'Hızlı Teslimat']
  },
  {
    id: '3',
    name: 'Ege Kargo Sistemleri',
    contactPerson: 'Okan Demir',
    phone: '+90 232 555 0303',
    email: 'okan@egekargo.com',
    address: 'İzmir, Türkiye',
    rating: 4.4,
    totalJobs: 156,
    activeJobs: 5,
    registrationDate: '2023-05-10',
    status: 'ACTIVE',
    specializations: ['Soğuk Zincir', 'Özel Taşımacılık']
  },
  {
    id: '4',
    name: 'Karadeniz Nakliyat',
    contactPerson: 'Fatma Özkan',
    phone: '+90 462 555 0404',
    email: 'fatma@karadeniznakliyat.com',
    address: 'Trabzon, Türkiye',
    rating: 4.2,
    totalJobs: 98,
    activeJobs: 3,
    registrationDate: '2023-07-18',
    status: 'INACTIVE',
    specializations: ['Bölgesel Taşımacılık']
  }
]

// Sadece aktif firmaları döndüren helper fonksiyon
export const getActiveCarriers = (): Carrier[] => {
  return mockCarriers.filter(carrier => carrier.status === 'ACTIVE')
}

// ID'ye göre firma bilgisi döndüren helper fonksiyon
export const getCarrierById = (id: string): Carrier | undefined => {
  return mockCarriers.find(carrier => carrier.id === id)
}
