'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { authAPI } from '@/lib/mockApi'
import { User, LoginForm } from '@/types'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (data: LoginForm) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  isAuthenticated: boolean
  hasRole: (roles: string | string[]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = Cookies.get('token')
      if (!token) {
        setLoading(false)
        return
      }

      const response = await authAPI.getProfile()
      setUser(response.data.user)
    } catch (error) {
      // Token is invalid, remove it
      Cookies.remove('token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (data: LoginForm) => {
    try {
      const response = await authAPI.login(data)
      const { token, user: userData } = response.data

      // Store token in cookie
      Cookies.set('token', token, { expires: 1 }) // 1 day
      setUser(userData)

      toast.success(`Hoş geldiniz, ${userData.firstName}!`)
      router.push('/dashboard')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Giriş başarısız'
      toast.error(message)
      throw error
    }
  }

  const logout = () => {
    Cookies.remove('token')
    setUser(null)
    toast.success('Başarıyla çıkış yapıldı')
    router.push('/login')
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData })
    }
  }

  const isAuthenticated = !!user

  const hasRole = (roles: string | string[]) => {
    if (!user) return false
    
    const roleArray = Array.isArray(roles) ? roles : [roles]
    return roleArray.includes(user.role)
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated,
    hasRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Higher-order component for protecting routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredRoles?: string[]
) {
  return function AuthenticatedComponent(props: P) {
    const { user, loading, hasRole } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!loading) {
        if (!user) {
          router.push('/login')
          return
        }

        if (requiredRoles && !hasRole(requiredRoles)) {
          toast.error('Bu sayfaya erişim yetkiniz bulunmuyor')
          router.push('/dashboard')
          return
        }
      }
    }, [user, loading, router])

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="loading-spinner w-8 h-8"></div>
        </div>
      )
    }

    if (!user || (requiredRoles && !hasRole(requiredRoles))) {
      return null
    }

    return <Component {...props} />
  }
}
