'use client'

import { useState, useEffect } from 'react'
import { getCurrentUser } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Bell,
  FileText,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { CustomBarChart, CustomLineChart } from '@/components/ui/chart'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)
  }, [])

  // Mock data for dashboard
  const dashboardStats = {
    totalStudents: 1247,
    totalTeachers: 68,
    totalClasses: 42,
    totalRevenue: 156780,
    attendanceRate: 94.2,
    newEnrollments: 23,
    pendingFees: 8,
    upcomingExams: 5
  }

  const monthlyData = [
    { month: 'Jan', students: 1180, revenue: 145000 },
    { month: 'Feb', students: 1195, revenue: 148000 },
    { month: 'Mar', students: 1210, revenue: 152000 },
    { month: 'Apr', students: 1225, revenue: 155000 },
    { month: 'May', students: 1240, revenue: 157000 },
    { month: 'Jun', students: 1247, revenue: 156780 }
  ]

  const attendanceData = [
    { day: 'Mon', rate: 95 },
    { day: 'Tue', rate: 97 },
    { day: 'Wed', rate: 93 },
    { day: 'Thu', rate: 96 },
    { day: 'Fri', rate: 92 },
    { day: 'Sat', rate: 89 }
  ]

  const recentActivities = [
    { type: 'enrollment', message: 'New student enrolled in Grade 10A', time: '2 hours ago', icon: Users },
    { type: 'payment', message: 'Fee payment received from John Smith', time: '4 hours ago', icon: DollarSign },
    { type: 'exam', message: 'Mathematics exam scheduled for Grade 12', time: '6 hours ago', icon: FileText },
    { type: 'notification', message: 'Parent-teacher meeting reminder sent', time: '8 hours ago', icon: Bell }
  ]

  const pendingTasks = [
    { task: 'Review pending fee waivers', priority: 'high', count: 3 },
    { task: 'Approve new teacher applications', priority: 'medium', count: 2 },
    { task: 'Update exam schedules', priority: 'low', count: 1 },
    { task: 'Generate monthly reports', priority: 'medium', count: 1 }
  ]

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        {/* Loading skeleton */}
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.first_name || 'Administrator'}</p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalStudents.toLocaleString()}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +{dashboardStats.newEnrollments} this month
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Teachers</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalTeachers}</p>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  All active
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Classes</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalClasses}</p>
                <p className="text-xs text-purple-600 flex items-center mt-1">
                  <BookOpen className="w-3 h-3 mr-1" />
                  Across all grades
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${dashboardStats.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-orange-600 flex items-center mt-1">
                  <DollarSign className="w-3 h-3 mr-1" />
                  {dashboardStats.pendingFees} pending
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Student Enrollment Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomLineChart data={monthlyData} height={300} color="#3b82f6" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomBarChart data={attendanceData} height={300} color="#10b981" />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities and Pending Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Recent Activities</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => {
                const IconComponent = activity.icon
                return (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span>Pending Tasks</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingTasks.map((task, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{task.task}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        task.priority === 'high' ? 'bg-red-100 text-red-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {task.priority}
                      </span>
                      <span className="text-xs text-gray-500">{task.count} items</span>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 text-center rounded-lg border hover:bg-gray-50 transition-colors">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Add Student</p>
            </button>
            <button className="p-4 text-center rounded-lg border hover:bg-gray-50 transition-colors">
              <GraduationCap className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Add Teacher</p>
            </button>
            <button className="p-4 text-center rounded-lg border hover:bg-gray-50 transition-colors">
              <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Schedule Exam</p>
            </button>
            <button className="p-4 text-center rounded-lg border hover:bg-gray-50 transition-colors">
              <FileText className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="text-sm font-medium">Generate Report</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
