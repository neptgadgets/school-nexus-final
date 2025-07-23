'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CustomPieChart, CustomBarChart } from '@/components/ui/chart'
import { 
  FileBarChart,
  Download,
  Calendar,
  TrendingUp,
  Users,
  School,
  DollarSign,
  BookOpen,
  FileText,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'
import { getData, getCurrentUser } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'

interface SystemStats {
  totalSchools: number
  totalStudents: number
  totalTeachers: number
  totalRevenue: number
  activeSubscriptions: number
  trialSubscriptions: number
  expiredSubscriptions: number
}

export default function ReportsPage() {
  const [stats, setStats] = useState<SystemStats>({
    totalSchools: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalRevenue: 0,
    activeSubscriptions: 0,
    trialSubscriptions: 0,
    expiredSubscriptions: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('monthly')
  

  useEffect(() => {
    fetchSystemStats()
  }, [])

  const fetchSystemStats = async () => {
    try {
      // Fetch schools data
      const { data: schools } = await supabase.from('schools').select('*')
      
      // Fetch students data (aggregate from all schools)
      const { data: students } = await supabase.from('students').select('id').eq('status', 'active')
      
      // Fetch teachers data (aggregate from all schools)
      const { data: teachers } = await supabase.from('teachers').select('id').eq('status', 'active')

      const totalSchools = schools?.length || 0
      const activeSubscriptions = schools?.filter(s => s.subscription_status === 'active').length || 0
      const trialSubscriptions = schools?.filter(s => s.subscription_status === 'trial').length || 0
      const expiredSubscriptions = schools?.filter(s => s.subscription_status === 'expired').length || 0

      setStats({
        totalSchools,
        totalStudents: students?.length || 0,
        totalTeachers: teachers?.length || 0,
        totalRevenue: activeSubscriptions * 500000, // Mock revenue calculation
        activeSubscriptions,
        trialSubscriptions,
        expiredSubscriptions
      })
    } catch (error) {
      console.error('Error fetching system stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const subscriptionData = [
    { name: 'Active', value: stats.activeSubscriptions, color: '#10b981' },
    { name: 'Trial', value: stats.trialSubscriptions, color: '#3b82f6' },
    { name: 'Expired', value: stats.expiredSubscriptions, color: '#ef4444' },
  ]

  const revenueData = [
    { name: 'Jan', value: 2400000 },
    { name: 'Feb', value: 1800000 },
    { name: 'Mar', value: 3200000 },
    { name: 'Apr', value: 2800000 },
    { name: 'May', value: 3600000 },
    { name: 'Jun', value: 4200000 },
  ]

  const schoolGrowthData = [
    { name: 'Jan', value: 1 },
    { name: 'Feb', value: 1 },
    { name: 'Mar', value: 2 },
    { name: 'Apr', value: 2 },
    { name: 'May', value: 3 },
    { name: 'Jun', value: 3 },
  ]

  const reportCards = [
    {
      title: 'System Overview Report',
      description: 'Complete system statistics and metrics',
      icon: Activity,
      color: 'bg-blue-500',
      action: 'Generate Report'
    },
    {
      title: 'Financial Report',
      description: 'Revenue, subscriptions, and billing analysis',
      icon: DollarSign,
      color: 'bg-green-500',
      action: 'Generate Report'
    },
    {
      title: 'Schools Performance',
      description: 'Individual school performance metrics',
      icon: School,
      color: 'bg-purple-500',
      action: 'Generate Report'
    },
    {
      title: 'User Analytics',
      description: 'Students, teachers, and admin statistics',
      icon: Users,
      color: 'bg-orange-500',
      action: 'Generate Report'
    },
    {
      title: 'Subscription Report',
      description: 'Subscription status and trends',
      icon: FileBarChart,
      color: 'bg-pink-500',
      action: 'Generate Report'
    },
    {
      title: 'Custom Report',
      description: 'Build your own custom report',
      icon: FileText,
      color: 'bg-gray-500',
      action: 'Create Report'
    }
  ]

  return (
    <div className="p-6">
      <Header
        title="System Reports"
        subtitle="Generate comprehensive system reports and analytics"
        actions={
          <div className="flex space-x-2">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Custom Range
            </Button>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
          </div>
        }
      />

      <div className="mt-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(stats.totalRevenue)}
                  </p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                    <span className="text-xs text-green-600">+12% from last month</span>
                  </div>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Schools</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalSchools}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 text-blue-500 mr-1" />
                    <span className="text-xs text-blue-600">+2 this month</span>
                  </div>
                </div>
                <School className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.totalStudents}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 text-purple-500 mr-1" />
                    <span className="text-xs text-purple-600">+45 this month</span>
                  </div>
                </div>
                <Users className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Teachers</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.totalTeachers}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 text-orange-500 mr-1" />
                    <span className="text-xs text-orange-600">+8 this month</span>
                  </div>
                </div>
                <BookOpen className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Subscription Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="w-5 h-5" />
                <span>Subscription Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <CustomPieChart data={subscriptionData} height={250} />
                </div>
                <div className="ml-6 space-y-4">
                  {subscriptionData.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Monthly Revenue</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CustomBarChart data={revenueData} height={250} />
            </CardContent>
          </Card>
        </div>

        {/* School Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>School Growth Over Time</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CustomBarChart data={schoolGrowthData} height={300} />
          </CardContent>
        </Card>

        {/* Report Generation Cards */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Generate Reports</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportCards.map((report, index) => {
              const Icon = report.icon
              return (
                <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 ${report.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 mb-1">{report.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{report.description}</p>
                        <Button size="sm" variant="outline" className="w-full">
                          <FileText className="w-4 h-4 mr-2" />
                          {report.action}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileBarChart className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Monthly System Report - June 2024</p>
                    <p className="text-sm text-gray-600">Generated 2 hours ago</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Financial Report - Q2 2024</p>
                    <p className="text-sm text-gray-600">Generated 1 day ago</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">User Analytics Report - May 2024</p>
                    <p className="text-sm text-gray-600">Generated 3 days ago</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
