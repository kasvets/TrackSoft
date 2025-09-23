import { useQuery } from 'react-query'
import { dashboardAPI } from '@/lib/mockApi'
import { Alert } from '@/types'
import { AlertTriangle, AlertCircle, Info, X } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const getAlertIcon = (type: string) => {
  switch (type) {
    case 'error':
      return AlertCircle
    case 'warning':
      return AlertTriangle
    case 'info':
      return Info
    default:
      return Info
  }
}

const getAlertColor = (type: string, priority: string) => {
  if (type === 'error' || priority === 'high') {
    return {
      bg: 'bg-red-50 border-red-200',
      icon: 'text-red-600',
      text: 'text-red-800',
      title: 'text-red-900',
    }
  }
  
  if (type === 'warning' || priority === 'medium') {
    return {
      bg: 'bg-yellow-50 border-yellow-200',
      icon: 'text-yellow-600',
      text: 'text-yellow-800',
      title: 'text-yellow-900',
    }
  }
  
  return {
    bg: 'bg-blue-50 border-blue-200',
    icon: 'text-blue-600',
    text: 'text-blue-800',
    title: 'text-blue-900',
  }
}

export default function AlertsPanel() {
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([])

  const { data, isLoading, error } = useQuery(
    'dashboard-alerts',
    () => dashboardAPI.getAlerts(),
    {
      refetchInterval: 60000, // Refresh every minute
    }
  )

  const alerts: Alert[] = data?.data?.alerts || []
  const visibleAlerts = alerts.filter(alert => !dismissedAlerts.includes(alert.title))

  const dismissAlert = (alertTitle: string) => {
    setDismissedAlerts(prev => [...prev, alertTitle])
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Uyarılar</h3>
        </div>
        <div className="text-center py-6">
          <p className="text-red-600">Uyarılar yüklenirken hata oluştu</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Uyarılar</h3>
        {data?.data?.summary && (
          <div className="flex items-center space-x-2">
            {data.data.summary.high > 0 && (
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium">
                {data.data.summary.high} Yüksek
              </span>
            )}
            {data.data.summary.medium > 0 && (
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                {data.data.summary.medium} Orta
              </span>
            )}
          </div>
        )}
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="shimmer h-16 rounded-md"></div>
            ))}
          </div>
        ) : visibleAlerts.length === 0 ? (
          <div className="text-center py-6">
            <Info className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">
              {alerts.length === 0 ? 'Uyarı bulunmuyor' : 'Tüm uyarılar kapatıldı'}
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {visibleAlerts.slice(0, 5).map((alert) => {
              const Icon = getAlertIcon(alert.type)
              const colors = getAlertColor(alert.type, alert.priority)

              return (
                <motion.div
                  key={alert.title}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`p-4 rounded-lg border-l-4 bg-gray-50 hover:bg-gray-100 transition-colors ${colors.bg}`}
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Icon className={`h-6 w-6 ${colors.icon}`} />
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className={`text-sm font-semibold ${colors.title}`}>
                        {alert.title}
                      </h4>
                      <p className={`mt-1 text-sm ${colors.text}`}>
                        {alert.message}
                      </p>
                      <p className="mt-2 text-xs text-gray-500 font-medium">
                        {formatDistanceToNow(new Date(alert.timestamp), {
                          addSuffix: true,
                          locale: tr,
                        })}
                      </p>
                    </div>
                    <div className="ml-auto pl-3">
                      <button
                        type="button"
                        onClick={() => dismissAlert(alert.title)}
                        className="inline-flex rounded-full p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <span className="sr-only">Kapat</span>
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        )}

        {visibleAlerts.length > 5 && (
          <div className="text-center pt-2">
            <p className="text-sm text-gray-500">
              +{visibleAlerts.length - 5} uyarı daha
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
