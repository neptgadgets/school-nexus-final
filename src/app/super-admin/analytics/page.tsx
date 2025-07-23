'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  School,
  DollarSign,
  Activity,
  Download,
  Filter,
  Calendar,
  Globe,
  Smartphone,
  Clock
} from 'lucide-react'
import { getData, getCurrentUser } from '@/lib/api'
import { CustomBarChart, CustomLineChart, CustomPieChart } from '@/components/ui/chart'

interface AnalyticsData {
  totalSchools: number
  totalUsers: number
  totalRevenue: number
  activeSubscriptions: number
  monthlyGrowth: number
  userEngagement: number
  systemUptime: number
  supportTickets: number
}

export default function SuperAdminAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalSchools: 0,
    totalUsers: 0,
    totalRevenue: 0,
    activeSubscriptions: 0,
    monthlyGrowth: 0,
    userEngagement: 0,
    systemUptime: 99.9,
    supportTickets: 0
  })
  const [timeRange, setTimeRange] = useState('30d')
  const [isLoading, setIsLoading] = useState(true)
  

  useEffect(() => {
    fetchAnalyticsData()
  }, [timeRange])

  const fetchAnalyticsData = async () => {
    setIsLoading(true)
    try {
      // Mock data for demo - replace with real Supabase queries
      const mockData: AnalyticsData = {
        totalSchools: 245,
        totalUsers: 15420,
        totalRevenue: 892500,
        activeSubscriptions: 238,
        monthlyGrowth: 12.5,
        userEngagement: 87.3,
        systemUptime: 99.95,
        supportTickets: 23
      }
      setAnalyticsData(mockData)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    }
    setIsLoading(false)
  }

  const revenueData = [
    { name: 'Jan', value: 65000 },
    { name: 'Feb', value: 72000 },
    { name: 'Mar', value: 68000 },
    { name: 'Apr', value: 78000 },
    { name: 'May', value: 85000 },
    { name: 'Jun', value: 92000 },
    { name: 'Jul', value: 89000 },
    { name: 'Aug', value: 95000 },
    { name: 'Sep', value: 88000 },
    { name: 'Oct', value: 92000 },
    { name: 'Nov', value: 98000 },
    { name: 'Dec', value: 105000 }
  ]

  const userGrowthData = [
    { name: 'Week 1', value: 12500 },
    { name: 'Week 2', value: 13200 },
    { name: 'Week 3', value: 13800 },
    { name: 'Week 4', value: 14500 },
    { name: 'Week 5', value: 15100 },
    { name: 'Week 6', value: 15420 }
  ]

  const subscriptionDistribution = [
    { name: 'Basic', value: 120, color: '#8884d8' },
    { name: 'Pro', value: 85, color: '#82ca9d' },
    { name: 'Enterprise', value: 33, color: '#ffc658' },
    { name: 'Trial', value: 7, color: '#ff7c7c' }
  ]

  const userActivityData = [
    { name: 'Mon', value: 8500 },
    { name: 'Tue', value: 9200 },
    { name: 'Wed', value: 8800 },
    { name: 'Thu', value: 9500 },
    { name: 'Fri', value: 9800 },
    { name: 'Sat', value: 7200 },
    { name: 'Sun', value: 6800 }
  ]

  const topSchoolsByRevenue = [
    { name: 'Central High School', revenue: 15000, students: 1200 },
    { name: 'Westside Academy', revenue: 12500, students: 950 },
    { name: 'Northpoint School', revenue: 11800, students: 880 },
    { name: 'Riverside Elementary', revenue: 9500, students: 650 },
    { name: 'Mountain View High', revenue: 8900, students: 720 }
  ]

  const systemMetrics = [
    { metric: 'API Response Time', value: '145ms', trend: 'down', color: 'green' },
    { metric: 'Database Query Time', value: '23ms', trend: 'down', color: 'green' },
    { metric: 'Error Rate', value: '0.12%', trend: 'down', color: 'green' },
    { metric: 'Memory Usage', value: '67%', trend: 'up', color: 'yellow' },
    { metric: 'CPU Usage', value: '45%', trend: 'stable', color: 'blue' },
    { metric: 'Storage Used', value: '78%', trend: 'up', color: 'orange' }
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Header
        title="System Analytics"
        subtitle="Comprehensive insights into system performance and business metrics"
        actions={
          <div className="flex space-x-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        }
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <School className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Schools</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.totalSchools)}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +{analyticsData.monthlyGrowth}% this month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.totalUsers)}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8.2% this month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.totalRevenue)}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +15.3% this month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">System Uptime</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.systemUptime}%</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Excellent
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue and Growth Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue & School Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomBarChart data={revenueData} height={350} color="#3b82f6" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Growth Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomLineChart data={userGrowthData} height={350} color="#10b981" />
          </CardContent>
        </Card>
      </div>

      {/* Subscription Distribution and User Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Subscription Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomPieChart data={subscriptionDistribution} height={350} />
            <div className="mt-4 grid grid-cols-2 gap-4">
              {subscriptionDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly User Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomBarChart data={userActivityData} height={350} color="#8b5cf6" />
          </CardContent>
        </Card>
      </div>

      {/* Top Schools and System Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Top Schools by Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSchoolsByRevenue.map((school, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{school.name}</h4>
                      <p className="text-sm text-gray-600">{school.students} students</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatCurrency(school.revenue)}</p>
                    <p className="text-sm text-gray-600">monthly</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      metric.color === 'green' ? 'bg-green-500' :
                      metric.color === 'yellow' ? 'bg-yellow-500' :
                      metric.color === 'orange' ? 'bg-orange-500' :
                      metric.color === 'red' ? 'bg-red-500' : 'bg-blue-500'
                    }`}></div>
                    <span className="font-medium text-gray-900">{metric.metric}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900">{metric.value}</span>
                    {metric.trend === 'up' && <TrendingUp className="w-4 h-4 text-orange-500" />}
                    {metric.trend === 'down' && <TrendingDown className="w-4 h-4 text-green-500" />}
                    {metric.trend === 'stable' && <Activity className="w-4 h-4 text-blue-500" />}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-blue-600" />
              <span>Global Reach</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Countries</span>
                <span className="font-semibold">24</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time Zones</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Languages</span>
                <span className="font-semibold">8</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Smartphone className="w-5 h-5 text-green-600" />
              <span>Device Usage</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Desktop</span>
                <span className="font-semibold">68%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mobile</span>
                <span className="font-semibold">28%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tablet</span>
                <span className="font-semibold">4%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <span>Peak Usage</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Peak Hour</span>
                <span className="font-semibold">2:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Peak Day</span>
                <span className="font-semibold">Tuesday</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Session</span>
                <span className="font-semibold">24 min</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
