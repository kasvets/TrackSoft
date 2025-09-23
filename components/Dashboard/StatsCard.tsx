import { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface StatsCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease'
  }
  icon: LucideIcon
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo'
  href?: string
  loading?: boolean
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
    text: 'text-blue-900',
  },
  green: {
    bg: 'bg-green-50',
    icon: 'text-green-600',
    text: 'text-green-900',
  },
  yellow: {
    bg: 'bg-yellow-50',
    icon: 'text-yellow-600',
    text: 'text-yellow-900',
  },
  red: {
    bg: 'bg-red-50',
    icon: 'text-red-600',
    text: 'text-red-900',
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'text-purple-600',
    text: 'text-purple-900',
  },
  indigo: {
    bg: 'bg-indigo-50',
    icon: 'text-indigo-600',
    text: 'text-indigo-900',
  },
}

export default function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  color,
  href,
  loading = false,
}: StatsCardProps) {
  const colors = colorClasses[color]

  const CardContent = () => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-200 ${
        href ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`p-3 rounded-lg ${colors.bg}`}>
            <Icon className={`h-6 w-6 ${colors.icon}`} />
          </div>
        </div>
        
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">
              {title}
            </dt>
            <dd className="flex items-baseline">
              {loading ? (
                <div className="shimmer h-8 w-20 rounded"></div>
              ) : (
                <div className={`text-2xl font-semibold ${colors.text}`}>
                  {typeof value === 'number' ? value.toLocaleString('de-DE') : value}
                </div>
              )}
              
              {change && !loading && (
                <div className="ml-2 flex items-baseline text-sm">
                  <span
                    className={
                      change.type === 'increase'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }
                  >
                    {change.type === 'increase' ? '+' : '-'}
                    {Math.abs(change.value)}%
                  </span>
                  <span className="ml-1 text-gray-500">
                    önceki aya göre
                  </span>
                </div>
              )}
            </dd>
          </dl>
        </div>
      </div>
    </motion.div>
  )

  if (href) {
    return (
      <Link href={href}>
        <CardContent />
      </Link>
    )
  }

  return <CardContent />
}
