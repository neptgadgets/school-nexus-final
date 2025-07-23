'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Calendar,
  Users,
  UserCheck,
  UserX,
  Clock,
  Download,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  TrendingUp,
  FileText
} from 'lucide-react'
import { getData } from '@/lib/api'

// Utility function for date formatting
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

interface AttendanceRecord {
  id: string
  student_id: string
  date: string
  status: 'present' | 'absent' | 'late' | 'excused'
  time_in?: string
  time_out?: string
  notes?: string
  student_first_name?: string
  student_last_name?: string
  class_name?: string
  class_level?: string
}

interface AttendanceStats {
  totalStudents: number
  presentToday: number
  absentToday: number
  lateToday: number
  attendanceRate: number
}

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState('daily')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedClass, setSelectedClass] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [stats, setStats] = useState<AttendanceStats>({
    totalStudents: 0,
    presentToday: 0,
    absentToday: 0,
    lateToday: 0,
    attendanceRate: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [classes, setClasses] = useState<any[]>([])
  

  useEffect(() => {
    fetchAttendanceData()
    fetchClasses()
  }, [selectedDate, selectedClass])

  const fetchAttendanceData = async () => {
    try {
      const { data: { session } } = await Promise.resolve({data: {session: null}})
      if (!session) return

      const { data: admin } = await supabase
        .from('administrators')
        .select('school_id')
        .eq('user_id', session.user.id)
        .single()

      if (!admin?.school_id) return

      let query = supabase
        .from('attendance_records')
        .select(`
          *,
          students (
            first_name,
            last_name,
            student_id,
            classes (
              name
            )
          )
        `)
        .eq('date', selectedDate)
        .eq('students.school_id', admin.school_id)

      if (selectedClass !== 'all') {
        query = query.eq('students.class_id', selectedClass)
      }

      const { data, error } = await query.order('students.first_name', { ascending: true })

      if (error) {
        console.error('Error fetching attendance:', error)
        return
      }

      setAttendanceRecords(data || [])
      calculateStats(data || [])
    } catch (error) {
      console.error('Error fetching attendance:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchClasses = async () => {
    try {
      const { data: { session } } = await Promise.resolve({data: {session: null}})
      if (!session) return

      const { data: admin } = await supabase
        .from('administrators')
        .select('school_id')
        .eq('user_id', session.user.id)
        .single()

      if (!admin?.school_id) return

      const { data, error } = await supabase
        .from('classes')
        .select('id, name')
        .eq('school_id', admin.school_id)
        .eq('is_active', true)
        .order('name')

      if (!error && data) {
        setClasses(data)
      }
    } catch (error) {
      console.error('Error fetching classes:', error)
    }
  }

  const calculateStats = (records: AttendanceRecord[]) => {
    const totalStudents = records.length
    const presentToday = records.filter(r => r.status === 'present').length
    const absentToday = records.filter(r => r.status === 'absent').length
    const lateToday = records.filter(r => r.status === 'late').length
    const attendanceRate = totalStudents > 0 ? (presentToday / totalStudents) * 100 : 0

    setStats({
      totalStudents,
      presentToday,
      absentToday,
      lateToday,
      attendanceRate
    })
  }

  const markAttendance = async (studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
    try {
      const { data: { session } } = await Promise.resolve({data: {session: null}})
      if (!session) return

      const existingRecord = attendanceRecords.find(r => r.student_id === studentId)

      if (existingRecord) {
        // Update existing record
        const { error } = await supabase
          .from('attendance_records')
          .update({
            status,
            time_in: status === 'present' || status === 'late' ? new Date().toISOString() : null,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingRecord.id)

        if (error) {
          console.error('Error updating attendance:', error)
          return
        }
      } else {
        // Create new record
        const { error } = await supabase
          .from('attendance_records')
          .insert({
            student_id: studentId,
            date: selectedDate,
            status,
            time_in: status === 'present' || status === 'late' ? new Date().toISOString() : null,
            marked_by: session.user.id
          })

        if (error) {
          console.error('Error creating attendance:', error)
          return
        }
      }

      // Refresh data
      fetchAttendanceData()
    } catch (error) {
      console.error('Error marking attendance:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'absent':
        return <XCircle className="w-4 h-4 text-red-600" />
      case 'late':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'excused':
        return <AlertTriangle className="w-4 h-4 text-blue-600" />
      default:
        return <XCircle className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800'
      case 'absent':
        return 'bg-red-100 text-red-800'
      case 'late':
        return 'bg-yellow-100 text-yellow-800'
      case 'excused':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleExportCSV = () => {
    const exportData = attendanceRecords.map(record => ({
      'Student ID': record.students.student_id,
      'Student Name': `${record.students.first_name} ${record.students.last_name}`,
      'Class': record.students.classes?.name || 'N/A',
      'Date': formatDate(record.date),
      'Status': record.status,
      'Time In': record.time_in || 'N/A',
      'Time Out': record.time_out || 'N/A',
      'Notes': record.notes || 'N/A'
    }))
    
    exportToCSV(exportData, `attendance-${selectedDate}`)
  }

  const filteredRecords = attendanceRecords.filter(record =>
    record.students.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.students.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.students.student_id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-6">
      <Header
        title="Attendance Management"
        subtitle="Track and manage student attendance"
        actions={
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Reports
            </Button>
          </div>
        }
      />

      <div className="mt-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold">{stats.totalStudents}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Present Today</p>
                  <p className="text-2xl font-bold text-green-600">{stats.presentToday}</p>
                </div>
                <UserCheck className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Absent Today</p>
                  <p className="text-2xl font-bold text-red-600">{stats.absentToday}</p>
                </div>
                <UserX className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Attendance Rate</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.attendanceRate.toFixed(1)}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'daily', label: 'Daily Attendance', icon: Calendar },
                { id: 'reports', label: 'Reports', icon: BarChart3 },
                { id: 'analytics', label: 'Analytics', icon: TrendingUp }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {activeTab === 'daily' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Daily Attendance - {formatDate(selectedDate)}</span>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-40"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class
                  </label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All Classes</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Students
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search by name or ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex space-x-2 mb-6">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Mark All Present
                </Button>
                <Button size="sm" variant="outline">
                  Mark All Absent
                </Button>
                <Button size="sm" variant="outline">
                  Import from Previous Day
                </Button>
              </div>

              {/* Attendance Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Time In</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          Loading attendance records...
                        </TableCell>
                      </TableRow>
                    ) : filteredRecords.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                          No attendance records found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-blue-600">
                                  {record.students.first_name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium">
                                  {record.students.first_name} {record.students.last_name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  ID: {record.students.student_id}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{record.students.classes?.name || 'N/A'}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(record.status)}
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                                {record.status}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">
                              {record.time_in ? new Date(record.time_in).toLocaleTimeString() : 'N/A'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => markAttendance(record.student_id, 'present')}
                                className="text-green-600 border-green-200 hover:bg-green-50"
                              >
                                Present
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => markAttendance(record.student_id, 'absent')}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                              >
                                Absent
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => markAttendance(record.student_id, 'late')}
                                className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                              >
                                Late
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'reports' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Attendance Reports</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Daily Report</h3>
                        <p className="text-sm text-gray-600">Today's attendance summary</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Weekly Report</h3>
                        <p className="text-sm text-gray-600">Week attendance trends</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Monthly Report</h3>
                        <p className="text-sm text-gray-600">Monthly attendance analysis</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'analytics' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Attendance Analytics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Analytics Dashboard</h3>
                <p className="text-gray-500">
                  Advanced attendance analytics and insights will be displayed here
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
