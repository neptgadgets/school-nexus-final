'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  FileText,
  CheckSquare,
  MessageSquare,
  Clock,
  TrendingUp,
  Award,
  Bell,
  User
} from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabase'
import { CustomPieChart, CustomBarChart } from '@/components/ui/chart'

interface TeacherStats {
  totalClasses: number
  totalStudents: number
  upcomingLessons: number
  pendingAssignments: number
  attendanceRate: number
  averageGrade: number
}

export default function TeacherDashboard() {
  const [stats, setStats] = useState<TeacherStats>({
    totalClasses: 0,
    totalStudents: 0,
    upcomingLessons: 0,
    pendingAssignments: 0,
    attendanceRate: 0,
    averageGrade: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [recentActivities, setRecentActivities] = useState<any[]>([])
  const [upcomingSchedule, setUpcomingSchedule] = useState<any[]>([])
  const supabase = createSupabaseClient()

  useEffect(() => {
    fetchTeacherData()
  }, [])

  const fetchTeacherData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      // Mock data for teacher dashboard
      setStats({
        totalClasses: 5,
        totalStudents: 120,
        upcomingLessons: 8,
        pendingAssignments: 12,
        attendanceRate: 92.5,
        averageGrade: 78.3
      })

      setRecentActivities([
        {
          id: 1,
          type: 'assignment',
          title: 'Mathematics Quiz submitted',
          description: 'Grade 10A - 25 submissions received',
          time: '2 hours ago',
          icon: FileText
        },
        {
          id: 2,
          type: 'attendance',
          title: 'Attendance marked',
          description: 'Grade 10B - 28/30 students present',
          time: '4 hours ago',
          icon: CheckSquare
        },
        {
          id: 3,
          type: 'message',
          title: 'New parent message',
          description: 'From Sarah Johnson\'s parent',
          time: '1 day ago',
          icon: MessageSquare
        }
      ])

      setUpcomingSchedule([
        {
          id: 1,
          subject: 'Mathematics',
          class: 'Grade 10A',
          time: '09:00 AM',
          room: 'Room 101',
          type: 'lesson'
        },
        {
          id: 2,
          subject: 'Mathematics',
          class: 'Grade 10B',
          time: '10:30 AM',
          room: 'Room 101',
          type: 'lesson'
        },
        {
          id: 3,
          subject: 'Mathematics Test',
          class: 'Grade 10A',
          time: '02:00 PM',
          room: 'Room 101',
          type: 'exam'
        }
      ])

    } catch (error) {
      console.error('Error fetching teacher data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const gradeDistributionData = [
    { name: 'A Grade', value: 15, color: '#10b981' },
    { name: 'B Grade', value: 35, color: '#3b82f6' },
    { name: 'C Grade', value: 40, color: '#f59e0b' },
    { name: 'D Grade', value: 8, color: '#ef4444' },
    { name: 'F Grade', value: 2, color: '#6b7280' }
  ]

  const attendanceData = [
    { name: 'Mon', value: 95 },
    { name: 'Tue', value: 88 },
    { name: 'Wed', value: 92 },
    { name: 'Thu', value: 96 },
    { name: 'Fri', value: 89 }
  ]

  const quickActions = [
    { title: 'Take Attendance', description: 'Mark today\'s attendance', icon: CheckSquare, color: 'bg-green-500', href: '/teacher/attendance' },
    { title: 'Grade Assignments', description: 'Review pending submissions', icon: FileText, color: 'bg-blue-500', href: '/teacher/assignments' },
    { title: 'View Schedule', description: 'Check your timetable', icon: Calendar, color: 'bg-purple-500', href: '/teacher/schedule' },
    { title: 'Student Progress', description: 'Track student performance', icon: TrendingUp, color: 'bg-orange-500', href: '/teacher/progress' },
    { title: 'Messages', description: 'Communication center', icon: MessageSquare, color: 'bg-pink-500', href: '/teacher/messages' },
    { title: 'Resources', description: 'Teaching materials', icon: BookOpen, color: 'bg-indigo-500', href: '/teacher/resources' }
  ]

  return (
    <div className="p-6">
      <Header
        title="Teacher Dashboard"
        subtitle="Welcome back! Here's your teaching overview"
        actions={
          <div className="flex space-x-2">
            <Button variant="outline">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </Button>
            <Button>
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
          </div>
        }
      />

      <div className="mt-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">My Classes</p>
                  <p className="text-2xl font-bold">{stats.totalClasses}</p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold">{stats.totalStudents}</p>
                </div>
                <Users className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Upcoming Lessons</p>
                  <p className="text-2xl font-bold">{stats.upcomingLessons}</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Assignments</p>
                  <p className="text-2xl font-bold">{stats.pendingAssignments}</p>
                </div>
                <FileText className="w-8 h-8 text-orange-500" />
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center mb-3`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-medium text-sm text-center mb-1">{action.title}</h3>
                    <p className="text-xs text-gray-600 text-center">{action.description}</p>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Grade Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>Grade Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <CustomPieChart data={gradeDistributionData} height={200} />
                </div>
                <div className="ml-6 space-y-3">
                  {gradeDistributionData.map((item, index) => (
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

          {/* Weekly Attendance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckSquare className="w-5 h-5" />
                <span>Weekly Attendance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CustomBarChart data={attendanceData} height={200} />
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Average attendance: <span className="font-semibold text-green-600">{stats.attendanceRate}%</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Today's Schedule</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingSchedule.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        item.type === 'exam' ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                        {item.type === 'exam' ? (
                          <FileText className={`w-5 h-5 ${item.type === 'exam' ? 'text-red-600' : 'text-blue-600'}`} />
                        ) : (
                          <BookOpen className={`w-5 h-5 ${item.type === 'exam' ? 'text-red-600' : 'text-blue-600'}`} />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.subject}</h4>
                      <p className="text-sm text-gray-600">{item.class} • {item.room}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{item.time}</p>
                      <p className={`text-xs px-2 py-1 rounded-full ${
                        item.type === 'exam' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                      }`}>
                        {item.type === 'exam' ? 'Exam' : 'Lesson'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Recent Activities</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const Icon = activity.icon
                  return (
                    <div key={activity.id} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <Icon className="w-4 h-4 text-gray-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{activity.title}</p>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-4">
                <Button variant="outline" className="w-full">
                  View All Activities
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Performance Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg">{stats.averageGrade}%</h3>
                <p className="text-sm text-gray-600">Average Grade</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckSquare className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg">{stats.attendanceRate}%</h3>
                <p className="text-sm text-gray-600">Attendance Rate</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg">{stats.totalStudents}</h3>
                <p className="text-sm text-gray-600">Students Taught</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
