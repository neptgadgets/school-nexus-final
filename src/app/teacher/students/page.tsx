'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Users,
  Search,
  Filter,
  Eye,
  MessageSquare,
  FileText,
  Download,
  UserCheck,
  UserX,
  Clock
} from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabase-client'

interface Student {
  id: string
  student_id: string
  first_name: string
  last_name: string
  email: string
  class: string
  grade: string
  attendance_rate: number
  current_grade: string
  status: 'active' | 'inactive' | 'suspended'
  last_activity: string
  parent_contact: string
  avatar_url?: string
}

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [classFilter, setClassFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createSupabaseClient()

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    setIsLoading(true)
    try {
      // Mock data for demo - replace with real Supabase query
      const mockStudents: Student[] = [
        {
          id: '1',
          student_id: 'STU001',
          first_name: 'Alice',
          last_name: 'Johnson',
          email: 'alice.johnson@school.edu',
          class: 'Mathematics 10A',
          grade: '10th',
          attendance_rate: 95,
          current_grade: 'A',
          status: 'active',
          last_activity: '2024-01-20',
          parent_contact: 'parent1@email.com'
        },
        {
          id: '2',
          student_id: 'STU002',
          first_name: 'Bob',
          last_name: 'Smith',
          email: 'bob.smith@school.edu',
          class: 'Mathematics 10A',
          grade: '10th',
          attendance_rate: 88,
          current_grade: 'B+',
          status: 'active',
          last_activity: '2024-01-19',
          parent_contact: 'parent2@email.com'
        },
        {
          id: '3',
          student_id: 'STU003',
          first_name: 'Carol',
          last_name: 'Davis',
          email: 'carol.davis@school.edu',
          class: 'Mathematics 10B',
          grade: '10th',
          attendance_rate: 92,
          current_grade: 'A-',
          status: 'active',
          last_activity: '2024-01-20',
          parent_contact: 'parent3@email.com'
        },
        {
          id: '4',
          student_id: 'STU004',
          first_name: 'David',
          last_name: 'Wilson',
          email: 'david.wilson@school.edu',
          class: 'Advanced Mathematics 11',
          grade: '11th',
          attendance_rate: 78,
          current_grade: 'C+',
          status: 'active',
          last_activity: '2024-01-18',
          parent_contact: 'parent4@email.com'
        }
      ]
      setStudents(mockStudents)
    } catch (error) {
      console.error('Error fetching students:', error)
    }
    setIsLoading(false)
  }

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.student_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesClass = classFilter === 'all' || student.class === classFilter
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter
    
    return matchesSearch && matchesClass && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600'
    if (grade.startsWith('B')) return 'text-blue-600'
    if (grade.startsWith('C')) return 'text-yellow-600'
    if (grade.startsWith('D')) return 'text-orange-600'
    return 'text-red-600'
  }

  const getAttendanceColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600'
    if (rate >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  const uniqueClasses = [...new Set(students.map(s => s.class))]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Header
        title="My Students"
        subtitle="View and manage students across all your classes"
        actions={
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export List
            </Button>
            <Button>
              <MessageSquare className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{students.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active Students</p>
                <p className="text-2xl font-bold text-gray-900">
                  {students.filter(s => s.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Attendance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(students.reduce((sum, s) => sum + s.attendance_rate, 0) / students.length)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">A Grades</p>
                <p className="text-2xl font-bold text-gray-900">
                  {students.filter(s => s.current_grade.startsWith('A')).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search students by name, ID, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Classes</option>
                {uniqueClasses.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredStudents.map((student) => (
            <Card key={student.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium">
                        {student.first_name[0]}{student.last_name[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {student.first_name} {student.last_name}
                      </h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <p className="text-sm text-gray-600">ID: {student.student_id}</p>
                        <p className="text-sm text-gray-600">{student.email}</p>
                        <Badge className={getStatusColor(student.status)}>
                          {student.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-600">Class</p>
                      <p className="text-sm text-gray-900">{student.class}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-600">Grade</p>
                      <p className={`text-sm font-medium ${getGradeColor(student.current_grade)}`}>
                        {student.current_grade}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-600">Attendance</p>
                      <p className={`text-sm font-medium ${getAttendanceColor(student.attendance_rate)}`}>
                        {student.attendance_rate}%
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-600">Last Activity</p>
                      <p className="text-sm text-gray-900">{student.last_activity}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredStudents.length === 0 && !isLoading && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
            <p className="text-gray-600">
              {searchQuery || classFilter !== 'all' || statusFilter !== 'all' 
                ? 'Try adjusting your search filters.' 
                : 'You have no students assigned yet.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
