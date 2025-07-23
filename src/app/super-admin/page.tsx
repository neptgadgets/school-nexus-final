'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  School,
  Users,
  AlertTriangle,
  Bell,
  Settings,
  Plus,
  TrendingUp,
  Activity
} from 'lucide-react'
import { getData, getCurrentUser } from '@/lib/api'
import { formatDate } from '@/lib/utils'

interface SuperAdminStats {
  totalSchools: number
  administrators: number
  expiringSubscriptions: number
  systemNotifications: number
  activeSchools: number
}

interface RecentActivity {
  id: string
  school_name: string
  activity: string
  date: string
}

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<SuperAdminStats>({
    totalSchools: 0,
    administrators: 0,
    expiringSubscriptions: 0,
    systemNotifications: 0,
    activeSchools: 0
  })
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch analytics data
      const { data: analyticsData, error: analyticsError } = await getData('/super-admin/analytics')
      if (!analyticsError && analyticsData) {
        setStats({
          totalSchools: parseInt(analyticsData.stats.total_schools) || 0,
          administrators: parseInt(analyticsData.stats.total_administrators) || 0,
          expiringSubscriptions: 0, // This would need a separate query
          systemNotifications: 0, // This would need a separate query
          activeSchools: parseInt(analyticsData.stats.total_schools) || 0
        })
        setRecentActivities(analyticsData.recentActivity || [])
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }



  const metricCards = [
    {
      title: 'Total Schools',
      value: stats.totalSchools,
      icon: School,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Administrators',
      value: stats.administrators,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Expiring Subscriptions',
      value: stats.expiringSubscriptions,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'System Notifications',
      value: stats.systemNotifications,
      icon: Bell,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ]

  return (
    <div className="p-6">
      <Header
        title="Super Admin Dashboard"
        subtitle="Welcome back, Super Admin"
        actions={
          <div className="flex space-x-2">
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New School
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" variant="outline">
                <School className="w-4 h-4 mr-2" />
                Manage Schools
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Manage Administrators
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="w-4 h-4 mr-2" />
                View System Reports
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <p className="text-sm text-gray-600">Latest system activities</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{activity.school_name}</span>{' '}
                        {activity.activity}
                      </p>
                      <p className="text-xs text-gray-500">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Database Status</p>
                  <p className="text-xs text-gray-500">Operational</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Offline Mode</p>
                  <p className="text-xs text-gray-500">Enabled</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Data Sync</p>
                  <p className="text-xs text-gray-500">Up to date</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Active Schools</p>
                  <p className="text-xs text-gray-500">{stats.activeSchools} active</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
