'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import {
  LayoutDashboard,
  Package,
  FileText,
  Truck,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  MapPin,
  DollarSign,
  AlertTriangle,
  BarChart3
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

interface MenuItem {
  name: string
  href?: string
  icon: React.ElementType
  current?: boolean
  children?: MenuItem[]
  roles?: string[]
  badge?: string
}

const navigation: MenuItem[] = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: LayoutDashboard 
  },
  {
    name: 'Konteynerler',
    icon: Package,
    children: [
      { name: 'Tüm Konteynerler', href: '/containers', icon: Package },
      { name: 'Konteyner Takip', href: '/containers/tracking', icon: MapPin },
      { name: 'Yeni Konteyner', href: '/containers/new', icon: Package, roles: ['admin', 'manager'] },
    ]
  },
  {
    name: 'Faturalar',
    icon: FileText,
    children: [
      { name: 'Tüm Faturalar', href: '/invoices', icon: FileText },
      { name: 'Ödeme Bekleyen', href: '/invoices?status=SENT', icon: DollarSign },
      { name: 'Geciken Faturalar', href: '/invoices?status=OVERDUE', icon: AlertTriangle },
      { name: 'Yeni Fatura', href: '/invoices/new', icon: FileText, roles: ['admin', 'manager'] },
    ]
  },
  {
    name: 'Taşıyıcı Firmalar',
    icon: Truck,
    children: [
      { name: 'Tüm Firmalar', href: '/carriers', icon: Truck },
      { name: 'Aktif Firmalar', href: '/carriers?status=ACTIVE', icon: Truck },
      { name: 'Performans Raporu', href: '/carriers/performance', icon: BarChart3 },
      { name: 'Yeni Firma', href: '/carriers/new', icon: Truck, roles: ['admin', 'manager'] },
    ]
  },
  {
    name: 'Raporlar',
    icon: BarChart3,
    children: [
      { name: 'Performans Raporu', href: '/reports/performance', icon: BarChart3 },
      { name: 'Finansal Rapor', href: '/reports/financial', icon: DollarSign },
      { name: 'Operasyonel Rapor', href: '/reports/operational', icon: Package },
    ],
    roles: ['admin', 'manager']
  },
  {
    name: 'Ayarlar',
    href: '/settings',
    icon: Settings,
    roles: ['admin']
  },
]

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>(['Dashboard'])
  const pathname = usePathname()
  const { user, logout, hasRole } = useAuth()

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    )
  }

  const isCurrentPath = (href: string) => {
    if (href === '/dashboard') return pathname === href
    return pathname.startsWith(href)
  }

  const filterMenuByRole = (items: MenuItem[]): MenuItem[] => {
    return items.filter(item => {
      if (item.roles && !hasRole(item.roles)) {
        return false
      }
      
      if (item.children) {
        item.children = filterMenuByRole(item.children)
        return item.children.length > 0 || !item.roles
      }
      
      return true
    })
  }

  const filteredNavigation = filterMenuByRole(navigation)

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 px-4 bg-primary-600">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <Package className="h-8 w-8 text-white" />
          <span className="text-xl font-bold text-white">GreenLog</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {filteredNavigation.map((item) => (
          <div key={item.name}>
            {item.href ? (
              <Link
                href={item.href}
                className={clsx(
                  'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isCurrentPath(item.href)
                    ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
                {item.badge && (
                  <span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            ) : (
              <div>
                <button
                  onClick={() => toggleExpanded(item.name)}
                  className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                  {expandedItems.includes(item.name) ? (
                    <ChevronDown className="ml-auto h-4 w-4" />
                  ) : (
                    <ChevronRight className="ml-auto h-4 w-4" />
                  )}
                </button>
                
                <AnimatePresence>
                  {expandedItems.includes(item.name) && item.children && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-6 mt-1 space-y-1 overflow-hidden"
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href!}
                          className={clsx(
                            'flex items-center px-3 py-2 text-sm rounded-md transition-colors',
                            isCurrentPath(child.href!)
                              ? 'bg-primary-50 text-primary-600 font-medium'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          )}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <child.icon className="mr-3 h-4 w-4" />
                          {child.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* User info and logout */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center mb-3">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.role === 'admin' ? 'Yönetici' : 
               user?.role === 'manager' ? 'Müdür' : 'Operatör'}
            </p>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-700 rounded-md hover:bg-red-50 transition-colors"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Çıkış Yap
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden">
        <button
          type="button"
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Menüyü aç</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden"
            >
              <div
                className="fixed inset-0 bg-black bg-opacity-50"
                onClick={() => setSidebarOpen(false)}
              />
              
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    type="button"
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Menüyü kapat</span>
                    <X className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
                <SidebarContent />
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="bg-white border-r border-gray-200 shadow-sm">
          <SidebarContent />
        </div>
      </div>
    </>
  )
}
