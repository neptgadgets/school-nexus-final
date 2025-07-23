'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { School, User, Lock, Eye, EyeOff, AlertCircle, Crown, Users, GraduationCap, BookOpen, Heart } from 'lucide-react'

const demoAccounts = [
  {
    type: 'Super Administrator',
    email: 'superadmin@schoolnexus.com',
    password: 'demo123',
    icon: Crown,
    color: 'from-purple-500 to-indigo-600',
    description: 'System-wide management and oversight',
    redirectPath: '/super-admin'
  },
  {
    type: 'School Administrator',
    email: 'admin@schoolnexus.com',
    password: 'demo123',
    icon: Users,
    color: 'from-blue-500 to-cyan-600',
    description: 'Complete school management and operations',
    redirectPath: '/dashboard'
  },
  {
    type: 'Teacher',
    email: 'teacher@schoolnexus.com',
    password: 'demo123',
    icon: GraduationCap,
    color: 'from-green-500 to-emerald-600',
    description: 'Classroom management and student tracking',
    redirectPath: '/teacher'
  },
  {
    type: 'Student',
    email: 'student@schoolnexus.com',
    password: 'demo123',
    icon: BookOpen,
    color: 'from-orange-500 to-red-600',
    description: 'Academic progress and learning portal',
    redirectPath: '/student'
  },
  {
    type: 'Parent/Guardian',
    email: 'parent@schoolnexus.com',
    password: 'demo123',
    icon: Heart,
    color: 'from-pink-500 to-rose-600',
    description: "Monitor your child's academic journey",
    redirectPath: '/parent'
  }
]

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Store token in localStorage for client-side access
      if (data.token) {
        localStorage.setItem('auth-token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
      }

      // Redirect based on user role
      const redirectPath = getRedirectPath(data.user.role)
      const returnUrl = searchParams.get('returnUrl')
      
      router.push(returnUrl || redirectPath)
    } catch (error) {
      console.error('Login error:', error)
      setError(error instanceof Error ? error.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const getRedirectPath = (role: string) => {
    switch (role) {
      case 'super_admin':
        return '/super-admin'
      case 'school_admin':
        return '/dashboard'
      case 'teacher':
        return '/teacher'
      case 'student':
        return '/student'
      case 'parent':
        return '/parent'
      default:
        return '/dashboard'
    }
  }

  const handleDemoLogin = async (demoAccount: typeof demoAccounts[0]) => {
    setEmail(demoAccount.email)
    setPassword(demoAccount.password)
    
    // Auto-login with demo credentials
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: demoAccount.email, 
          password: demoAccount.password 
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Store token in localStorage for client-side access
      if (data.token) {
        localStorage.setItem('auth-token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
      }

      router.push(demoAccount.redirectPath)
    } catch (error) {
      console.error('Demo login error:', error)
      setError(error instanceof Error ? error.message : 'Demo login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side - Branding */}
        <div className="lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-blue-600 to-purple-700">
          <div className="max-w-md text-center text-white">
            <div className="mb-8">
              <School className="w-20 h-20 mx-auto mb-4" />
              <h1 className="text-4xl font-bold mb-2">SchoolNexus</h1>
              <p className="text-blue-100 text-lg">
                Comprehensive Education Management Platform
              </p>
            </div>
            <div className="space-y-4 text-left bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Platform Features</h2>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                  <span>Multi-school management system</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                  <span>Student information management</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                  <span>Academic performance tracking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                  <span>Financial management & reporting</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                  <span>Communication & notifications</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
                <CardDescription>
                  Sign in to your account to continue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">{error}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or try demo accounts</span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    {demoAccounts.map((account, index) => {
                      const IconComponent = account.icon
                      return (
                        <button
                          key={index}
                          onClick={() => handleDemoLogin(account)}
                          disabled={isLoading}
                          className={`w-full flex items-center space-x-3 p-3 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group`}
                        >
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${account.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-medium text-gray-900">{account.type}</div>
                            <div className="text-xs text-gray-500">{account.description}</div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500">
                    Demo accounts use password: <code className="bg-gray-100 px-1 rounded">demo123</code>
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8 text-center text-sm text-gray-600">
              <p>Need help? Contact your system administrator</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}
