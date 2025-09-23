import { useQuery } from 'react-query'
import { dashboardAPI } from '@/lib/mockApi'
import { Activity } from '@/types'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { Package, FileText, Truck, Clock } from 'lucide-react'
import Link from 'next/link'

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'container':
      return Package
    case 'invoice':
      return FileText
    case 'loader':
      return Truck
    default:
      return Clock
  }
}

const getActivityColor = (type: string) => {
  switch (type) {
    case 'container':
      return 'text-blue-600 bg-blue-50'
    case 'invoice':
      return 'text-green-600 bg-green-50'
    case 'loader':
      return 'text-purple-600 bg-purple-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}

export default function RecentActivities() {
  const { data, isLoading, error } = useQuery(
    'dashboard-activities',
    () => dashboardAPI.getActivities({ limit: 10 }),
    {
      refetchInterval: 30000, // Refresh every 30 seconds
    }
  )

  const activities: Activity[] = data?.data?.activities || []

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Son Aktiviteler</h3>
        </div>
        <div className="text-center py-6">
          <p className="text-red-600">Aktiviteler yüklenirken hata oluştu</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Son Aktiviteler</h3>
        <Link
          href="/activities"
          className="text-sm text-primary-600 hover:text-primary-500 font-medium"
        >
          Tümünü görüntüle
        </Link>
      </div>

      <div className="flow-root">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="shimmer h-8 w-8 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="shimmer h-4 w-3/4 rounded"></div>
                  <div className="shimmer h-3 w-1/2 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-6">
            <Clock className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">Henüz aktivite bulunmuyor</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity, index) => {
              const Icon = getActivityIcon(activity.type)
              const colorClass = getActivityColor(activity.type)

              return (
                <div key={activity.id} className="flex space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div>
                        <span
                          className={`h-10 w-10 rounded-full flex items-center justify-center ${colorClass}`}
                        >
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div>
                          <div className="text-sm">
                            <span className="font-semibold text-gray-900">
                              {activity.title}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-gray-600">
                            {activity.description}
                          </p>
                          <div className="mt-2 flex items-center space-x-2 text-xs text-gray-500">
                            <span className="font-medium">{activity.user}</span>
                            <span>•</span>
                            <span>
                              {formatDistanceToNow(new Date(activity.timestamp), {
                                addSuffix: true,
                                locale: tr,
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
