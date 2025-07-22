'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createSupabaseClient } from '@/lib/supabase-client'
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
    description: 'Monitor children\'s academic journey',
    redirectPath: '/parent'
  }
]

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || null
  const supabase = createSupabaseClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Check for demo credentials first
      const demoAccount = demoAccounts.find(account => 
        account.email === email && account.password === password
      )

      if (demoAccount) {
        // Handle demo login - redirect to appropriate dashboard
        router.push(demoAccount.redirectPath)
        return
      }

      // Real Supabase authentication
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError(authError.message)
        setIsLoading(false)
        return
      }

      if (data.user) {
        // Get user role from administrators table
        const { data: admin, error: adminError } = await supabase
          .from('administrators')
          .select('role, school_id, is_active')
          .eq('user_id', data.user.id)
          .single()

        if (adminError || !admin) {
          setError('User not found in administrators. Please contact support.')
          await supabase.auth.signOut()
          setIsLoading(false)
          return
        }

        if (!admin.is_active) {
          setError('Your account has been deactivated. Please contact support.')
          await supabase.auth.signOut()
          setIsLoading(false)
          return
        }

        // Redirect based on role
        if (redirectTo) {
          router.push(redirectTo)
        } else if (admin.role === 'super_admin') {
          router.push('/super-admin')
        } else {
          router.push('/dashboard')
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('An unexpected error occurred. Please try again.')
    }

    setIsLoading(false)
  }

  const handleDemoLogin = (demoAccount: typeof demoAccounts[0]) => {
    setEmail(demoAccount.email)
    setPassword(demoAccount.password)
    setSelectedDemo(demoAccount.type)
    setError('')
  }

  const handleQuickDemo = async (demoAccount: typeof demoAccounts[0]) => {
    setIsLoading(true)
    setError('')
    
    // Simulate quick login
    setTimeout(() => {
      router.push(demoAccount.redirectPath)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Login Form */}
          <div className="flex flex-col justify-center">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <School className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-gray-600">Sign in to access your SchoolNexus dashboard</p>
            </div>

            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl">Sign In</CardTitle>
                <CardDescription>
                  Enter your credentials or use demo accounts below
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="pl-10"
                        required
                        disabled={isLoading}
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="pl-10 pr-10"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {selectedDemo && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-3">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-700 font-medium">
                          Demo account selected: {selectedDemo}
                        </span>
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Signing In...</span>
                      </div>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <button className="text-primary hover:underline font-medium">
                      Contact Administrator
                    </button>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Demo Accounts */}
          <div className="flex flex-col justify-center">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Try Demo Accounts</h2>
              <p className="text-gray-600">
                Experience different user roles with our interactive demo accounts
              </p>
            </div>

            <div className="space-y-4">
              {demoAccounts.map((account, index) => {
                const Icon = account.icon
                return (
                  <Card 
                    key={index} 
                    className={`cursor-pointer transition-all duration-300 hover:shadow-xl border-2 ${
                      selectedDemo === account.type 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-200 hover:border-gray-300'
                    } bg-white/80 backdrop-blur-sm`}
                    onClick={() => handleDemoLogin(account)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${account.color} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-1">{account.type}</h3>
                          <p className="text-sm text-gray-600 mb-2">{account.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                              {account.email}
                            </span>
                            <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                              {account.password}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDemoLogin(account)
                            }}
                            className="text-xs"
                          >
                            Fill Form
                          </Button>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleQuickDemo(account)
                            }}
                            className={`text-xs bg-gradient-to-r ${account.color} border-0 hover:opacity-90`}
                            disabled={isLoading}
                          >
                            Quick Demo
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
              <div className="text-center">
                <h3 className="font-semibold text-gray-800 mb-2">🎯 Demo Features</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✅ Full dashboard access for each user type</li>
                  <li>✅ Interactive features and realistic data</li>
                  <li>✅ No registration or setup required</li>
                  <li>✅ Switch between user types instantly</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            © 2024 SchoolNexus. Built with Next.js, TypeScript, and Supabase.
          </p>
          <div className="flex justify-center space-x-4 mt-2">
            <button className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              Privacy Policy
            </button>
            <button className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              Terms of Service
            </button>
            <button className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              Support
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
