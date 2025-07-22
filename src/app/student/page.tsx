'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
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
  Download
} from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabase-client'
import { CustomPieChart, CustomBarChart } from '@/components/ui/chart'

interface StudentStats {
  currentGPA: number
  totalSubjects: number
  completedAssignments: number
  upcomingExams: number
  attendanceRate: number
  pendingFees: number
}

export default function StudentDashboard() {
  const [stats, setStats] = useState<StudentStats>({
    currentGPA: 0,
    totalSubjects: 0,
    completedAssignments: 0,
    upcomingExams: 0,
    attendanceRate: 0,
    pendingFees: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [recentGrades, setRecentGrades] = useState<any[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([])
  const [todaySchedule, setTodaySchedule] = useState<any[]>([])
  const supabase = createSupabaseClient()

  useEffect(() => {
    fetchStudentData()
  }, [])

  const fetchStudentData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      // Mock data for student dashboard
      setStats({
        currentGPA: 3.7,
        totalSubjects: 8,
        completedAssignments: 24,
        upcomingExams: 3,
        attendanceRate: 94.5,
        pendingFees: 150000
      })

      setRecentGrades([
        { subject: 'Mathematics', grade: 'A', score: 89, date: '2024-01-15' },
        { subject: 'English', grade: 'B+', score: 82, date: '2024-01-12' },
        { subject: 'Science', grade: 'A-', score: 87, date: '2024-01-10' },
        { subject: 'History', grade: 'B', score: 78, date: '2024-01-08' }
      ])

      setUpcomingEvents([
        { title: 'Mathematics Test', type: 'exam', date: '2024-01-20', time: '10:00 AM' },
        { title: 'Science Project Due', type: 'assignment', date: '2024-01-22', time: '11:59 PM' },
        { title: 'Parent-Teacher Meeting', type: 'meeting', date: '2024-01-25', time: '2:00 PM' }
      ])

      setTodaySchedule([
        { subject: 'Mathematics', teacher: 'Mr. Johnson', time: '08:00 - 08:45', room: 'Room 101' },
        { subject: 'English', teacher: 'Ms. Smith', time: '08:45 - 09:30', room: 'Room 205' },
        { subject: 'Break', time: '09:30 - 09:45', isBreak: true },
        { subject: 'Science', teacher: 'Dr. Wilson', time: '09:45 - 10:30', room: 'Lab A' },
        { subject: 'History', teacher: 'Mrs. Davis', time: '10:30 - 11:15', room: 'Room 301' }
      ])

    } catch (error) {
      console.error('Error fetching student data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const gradeDistributionData = [
    { name: 'A Grades', value: 35, color: '#10b981' },
    { name: 'B Grades', value: 45, color: '#3b82f6' },
    { name: 'C Grades', value: 15, color: '#f59e0b' },
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
    { title: 'View Grades', description: 'Check your academic performance', icon: Award, color: 'bg-green-500' },
    { title: 'Assignments', description: 'Pending and completed work', icon: FileText, color: 'bg-blue-500' },
    { title: 'Timetable', description: 'Your class schedule', icon: Calendar, color: 'bg-purple-500' },
    { title: 'Attendance', description: 'View attendance record', icon: CheckSquare, color: 'bg-orange-500' },
    { title: 'Messages', description: 'Communications', icon: MessageSquare, color: 'bg-pink-500' },
    { title: 'Library', description: 'Digital resources', icon: BookOpen, color: 'bg-indigo-500' }
  ]

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-100'
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-100'
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'exam': return 'bg-red-100 text-red-600'
      case 'assignment': return 'bg-blue-100 text-blue-600'
      case 'meeting': return 'bg-green-100 text-green-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className="p-6">
      <Header
        title="Student Dashboard"
        subtitle="Welcome back! Here's your academic overview"
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
                  <p className="text-sm text-gray-600">Current GPA</p>
                  <p className="text-2xl font-bold text-green-600">{stats.currentGPA}</p>
                </div>
                <Award className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Subjects</p>
                  <p className="text-2xl font-bold">{stats.totalSubjects}</p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Attendance Rate</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.attendanceRate}%</p>
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

          {/* Attendance Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Attendance Trend</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CustomBarChart data={attendanceData} height={200} />
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Current attendance: <span className="font-semibold text-green-600">{stats.attendanceRate}%</span>
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
              <div className="space-y-3">
                {todaySchedule.map((item, index) => (
                  <div key={index} className={`flex items-center space-x-4 p-3 rounded-lg ${
                    item.isBreak ? 'bg-gray-50' : 'border'
                  }`}>
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        item.isBreak ? 'bg-gray-200' : 'bg-blue-100'
                      }`}>
                        {item.isBreak ? (
                          <Clock className="w-5 h-5 text-gray-600" />
                        ) : (
                          <BookOpen className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.subject}</h4>
                      {!item.isBreak && (
                        <p className="text-sm text-gray-600">{item.teacher} • {item.room}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Grades */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>Recent Grades</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentGrades.map((grade, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{grade.subject}</h4>
                      <p className="text-sm text-gray-600">{grade.date}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(grade.grade)}`}>
                        {grade.grade}
                      </span>
                      <p className="text-sm text-gray-600 mt-1">{grade.score}%</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button variant="outline" className="w-full">
                  View All Grades
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Upcoming Events</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{event.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                      {event.type}
                    </span>
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
          </CardContent>
        </Card>

        {/* Academic Performance Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Academic Performance Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg">{stats.currentGPA}</h3>
                <p className="text-sm text-gray-600">Current GPA</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg">{stats.completedAssignments}</h3>
                <p className="text-sm text-gray-600">Completed Assignments</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckSquare className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-lg">{stats.attendanceRate}%</h3>
                <p className="text-sm text-gray-600">Attendance Rate</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="font-semibold text-lg">{stats.upcomingExams}</h3>
                <p className="text-sm text-gray-600">Upcoming Exams</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
