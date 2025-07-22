'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Users,
  BookOpen,
  Calendar,
  FileText,
  Award,
  Clock,
  TrendingUp,
  User,
  Bell,
  MessageSquare,
  CheckSquare,
  DollarSign,
  Phone,
  Mail,
  AlertTriangle
} from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabase'
import { CustomPieChart, CustomBarChart } from '@/components/ui/chart'

interface Child {
  id: string
  name: string
  class: string
  grade: string
  attendance: number
  gpa: number
  avatar?: string
}

interface ParentStats {
  totalChildren: number
  averageGPA: number
  averageAttendance: number
  pendingFees: number
  upcomingEvents: number
  unreadMessages: number
}

export default function ParentDashboard() {
  const [stats, setStats] = useState<ParentStats>({
    totalChildren: 0,
    averageGPA: 0,
    averageAttendance: 0,
    pendingFees: 0,
    upcomingEvents: 0,
    unreadMessages: 0
  })
  const [children, setChildren] = useState<Child[]>([])
  const [selectedChild, setSelectedChild] = useState<string>('')
  const [recentActivities, setRecentActivities] = useState<any[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createSupabaseClient()

  useEffect(() => {
    fetchParentData()
  }, [])

  const fetchParentData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      // Mock data for parent dashboard
      const mockChildren = [
        { id: '1', name: 'Sarah Johnson', class: 'Grade 10A', grade: 'A-', attendance: 94, gpa: 3.7 },
        { id: '2', name: 'Michael Johnson', class: 'Grade 8B', grade: 'B+', attendance: 88, gpa: 3.3 }
      ]

      setChildren(mockChildren)
      setSelectedChild(mockChildren[0]?.id || '')

      setStats({
        totalChildren: mockChildren.length,
        averageGPA: mockChildren.reduce((sum, child) => sum + child.gpa, 0) / mockChildren.length,
        averageAttendance: mockChildren.reduce((sum, child) => sum + child.attendance, 0) / mockChildren.length,
        pendingFees: 350000,
        upcomingEvents: 5,
        unreadMessages: 3
      })

      setRecentActivities([
        {
          id: 1,
          childName: 'Sarah Johnson',
          type: 'grade',
          title: 'New grade posted',
          description: 'Mathematics Test - Grade: A (89%)',
          time: '2 hours ago',
          icon: Award
        },
        {
          id: 2,
          childName: 'Michael Johnson',
          type: 'attendance',
          title: 'Absent from school',
          description: 'Marked absent for Period 1-3',
          time: '1 day ago',
          icon: AlertTriangle
        },
        {
          id: 3,
          childName: 'Sarah Johnson',
          type: 'assignment',
          title: 'Assignment submitted',
          description: 'Science Project submitted on time',
          time: '2 days ago',
          icon: FileText
        }
      ])

      setUpcomingEvents([
        { title: 'Parent-Teacher Meeting', date: '2024-01-25', time: '2:00 PM', child: 'Sarah Johnson' },
        { title: 'Science Fair', date: '2024-01-28', time: '10:00 AM', child: 'All Children' },
        { title: 'Mathematics Test', date: '2024-01-30', time: '9:00 AM', child: 'Michael Johnson' }
      ])

    } catch (error) {
      console.error('Error fetching parent data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const selectedChildData = children.find(child => child.id === selectedChild)

  const gradeDistributionData = [
    { name: 'A Grades', value: 40, color: '#10b981' },
    { name: 'B Grades', value: 35, color: '#3b82f6' },
    { name: 'C Grades', value: 20, color: '#f59e0b' },
    { name: 'D Grades', value: 5, color: '#ef4444' }
  ]

  const attendanceData = [
    { name: 'Jan', value: 95 },
    { name: 'Feb', value: 92 },
    { name: 'Mar', value: 96 },
    { name: 'Apr', value: 89 },
    { name: 'May', value: 94 }
  ]

  const quickActions = [
    { title: 'View Grades', description: 'Check children\'s academic performance', icon: Award, color: 'bg-green-500' },
    { title: 'Attendance', description: 'View attendance records', icon: CheckSquare, color: 'bg-blue-500' },
    { title: 'Messages', description: 'Communicate with teachers', icon: MessageSquare, color: 'bg-purple-500' },
    { title: 'Pay Fees', description: 'Make fee payments', icon: DollarSign, color: 'bg-orange-500' },
    { title: 'Schedule', description: 'View timetables', icon: Calendar, color: 'bg-pink-500' },
    { title: 'Contact School', description: 'Get in touch', icon: Phone, color: 'bg-indigo-500' }
  ]

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-100'
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-100'
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  return (
    <div className="p-6">
      <Header
        title="Parent Dashboard"
        subtitle="Monitor your children's academic progress"
        actions={
          <div className="flex space-x-2">
            <Button variant="outline">
              <Bell className="w-4 h-4 mr-2" />
              Notifications ({stats.unreadMessages})
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
                  <p className="text-sm text-gray-600">My Children</p>
                  <p className="text-2xl font-bold">{stats.totalChildren}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Average GPA</p>
                  <p className="text-2xl font-bold text-green-600">{stats.averageGPA.toFixed(1)}</p>
                </div>
                <Award className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg. Attendance</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.averageAttendance.toFixed(1)}%</p>
                </div>
                <CheckSquare className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Fees</p>
                  <p className="text-2xl font-bold text-red-600">UGX {stats.pendingFees.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Children Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>My Children</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {children.map((child) => (
                <div 
                  key={child.id} 
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedChild === child.id ? 'border-primary bg-primary/5' : 'hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedChild(child.id)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-medium text-blue-600">
                        {child.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{child.name}</h3>
                      <p className="text-sm text-gray-600">{child.class}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${getGradeColor(child.grade)}`}>
                        {child.grade}
                      </span>
                      <p className="text-sm text-gray-600 mt-1">GPA: {child.gpa}</p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Attendance</p>
                      <p className="font-medium">{child.attendance}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Current Grade</p>
                      <p className="font-medium">{child.grade}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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

        {selectedChildData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Grade Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>{selectedChildData.name} - Grade Distribution</span>
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

            {/* Attendance Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>{selectedChildData.name} - Attendance Trend</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CustomBarChart data={attendanceData} height={200} />
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    Current attendance: <span className="font-semibold text-green-600">{selectedChildData.attendance}%</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          activity.type === 'grade' ? 'bg-green-100' :
                          activity.type === 'attendance' ? 'bg-red-100' : 'bg-blue-100'
                        }`}>
                          <Icon className={`w-4 h-4 ${
                            activity.type === 'grade' ? 'text-green-600' :
                            activity.type === 'attendance' ? 'text-red-600' : 'text-blue-600'
                          }`} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{activity.title}</p>
                        <p className="text-sm text-gray-600">{activity.childName}</p>
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

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Upcoming Events</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{event.title}</h4>
                      <span className="text-xs text-gray-500">{event.child}</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {event.date}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {event.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button variant="outline" className="w-full">
                  View All Events
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Communication Center */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>Communication Center</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg">{stats.unreadMessages}</h3>
                <p className="text-sm text-gray-600">Unread Messages</p>
                <Button variant="outline" size="sm" className="mt-2">
                  View Messages
                </Button>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Phone className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg">Contact</h3>
                <p className="text-sm text-gray-600">School Office</p>
                <Button variant="outline" size="sm" className="mt-2">
                  Call Now
                </Button>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg">Email</h3>
                <p className="text-sm text-gray-600">Send Message</p>
                <Button variant="outline" size="sm" className="mt-2">
                  Compose
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
