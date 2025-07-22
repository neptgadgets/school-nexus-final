'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CustomPieChart, CustomBarChart } from '@/components/ui/chart'
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  DollarSign,
  Calendar,
  FileText,
  UserPlus,
  CalendarPlus
} from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'

interface DashboardStats {
  totalStudents: number
  totalTeachers: number
  totalSubjects: number
  totalFees: number
  collectedFees: number
  pendingFees: number
  maleStudents: number
  femaleStudents: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalSubjects: 0,
    totalFees: 0,
    collectedFees: 0,
    pendingFees: 0,
    maleStudents: 0,
    femaleStudents: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createSupabaseClient()

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      // Get current user's school
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data: admin } = await supabase
        .from('administrators')
        .select('school_id')
        .eq('user_id', session.user.id)
        .single()

      if (!admin?.school_id) return

      // Fetch all stats in parallel
      const [
        studentsResult,
        teachersResult,
        subjectsResult,
        feesResult
      ] = await Promise.all([
        supabase.from('students').select('gender').eq('school_id', admin.school_id).eq('status', 'active'),
        supabase.from('teachers').select('id').eq('school_id', admin.school_id).eq('status', 'active'),
        supabase.from('subjects').select('id').eq('school_id', admin.school_id).eq('is_active', true),
        supabase.from('fee_records').select('total_amount, paid_amount, payment_status').eq('school_id', admin.school_id)
      ])

      // Process students data
      const students = studentsResult.data || []
      const maleStudents = students.filter(s => s.gender === 'male').length
      const femaleStudents = students.filter(s => s.gender === 'female').length

      // Process fees data
      const feeRecords = feesResult.data || []
      const totalFees = feeRecords.reduce((sum, record) => sum + record.total_amount, 0)
      const collectedFees = feeRecords.reduce((sum, record) => sum + record.paid_amount, 0)
      const pendingFees = totalFees - collectedFees

      setStats({
        totalStudents: students.length,
        totalTeachers: teachersResult.data?.length || 0,
        totalSubjects: subjectsResult.data?.length || 0,
        totalFees,
        collectedFees,
        pendingFees,
        maleStudents,
        femaleStudents,
      })
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const genderData = [
    { name: 'Boys', value: stats.maleStudents, color: '#3b82f6' },
    { name: 'Girls', value: stats.femaleStudents, color: '#ec4899' },
  ]

  const feeCollectionData = [
    { name: 'P.7', value: 1500 },
    { name: 'P.6', value: 1400 },
  ]

  const metricCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Teachers',
      value: stats.totalTeachers,
      icon: GraduationCap,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Fees Collections',
      value: formatCurrency(stats.collectedFees),
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Total Subjects',
      value: stats.totalSubjects,
      icon: BookOpen,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]

  return (
    <div className="p-6">
      <Header
        title="Dashboard"
        subtitle="Overview of your school management system"
        actions={
          <div className="flex space-x-2">
            <Button>
              <CalendarPlus className="w-4 h-4 mr-2" />
              Schedule Exam
            </Button>
            <Button variant="outline">
              <UserPlus className="w-4 h-4 mr-2" />
              Register New Student
            </Button>
          </div>
        }
      />

      <div className="mt-6 space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricCards.map((metric, index) => {
            const Icon = metric.icon
            return (
              <Card key={index} className="metric-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        {metric.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {isLoading ? '...' : metric.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full ${metric.bgColor}`}>
                      <Icon className={`w-6 h-6 ${metric.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gender Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Students by Gender</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <CustomPieChart data={genderData} height={250} />
                </div>
                <div className="ml-6 space-y-4">
                  {genderData.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium">{item.name}: {item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fee Collections Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Fee Collections by Class</CardTitle>
            </CardHeader>
            <CardContent>
              <CustomBarChart data={feeCollectionData} height={250} />
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Fees</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.totalFees)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Collected</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.collectedFees)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Pending</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.pendingFees)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
