'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen,
  Users,
  Calendar,
  Clock,
  Search,
  Plus,
  Eye,
  Edit,
  FileText,
  CheckSquare
} from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabase-client'

interface ClassData {
  id: string
  name: string
  subject: string
  grade: string
  students_count: number
  schedule: {
    day: string
    time: string
  }[]
  room: string
  description: string
  status: 'active' | 'inactive'
  created_at: string
}

export default function TeacherClassesPage() {
  const [classes, setClasses] = useState<ClassData[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createSupabaseClient()

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    setIsLoading(true)
    try {
      // Mock data for demo - replace with real Supabase query
      const mockClasses: ClassData[] = [
        {
          id: '1',
          name: 'Mathematics 10A',
          subject: 'Mathematics',
          grade: '10th Grade',
          students_count: 28,
          schedule: [
            { day: 'Monday', time: '09:00 - 10:00' },
            { day: 'Wednesday', time: '09:00 - 10:00' },
            { day: 'Friday', time: '09:00 - 10:00' }
          ],
          room: 'Room 201',
          description: 'Advanced Mathematics for Grade 10 students covering algebra and geometry',
          status: 'active',
          created_at: '2024-01-15'
        },
        {
          id: '2',
          name: 'Mathematics 10B',
          subject: 'Mathematics',
          grade: '10th Grade',
          students_count: 25,
          schedule: [
            { day: 'Tuesday', time: '10:00 - 11:00' },
            { day: 'Thursday', time: '10:00 - 11:00' }
          ],
          room: 'Room 201',
          description: 'Mathematics fundamentals for Grade 10 students',
          status: 'active',
          created_at: '2024-01-15'
        },
        {
          id: '3',
          name: 'Advanced Mathematics 11',
          subject: 'Mathematics',
          grade: '11th Grade',
          students_count: 22,
          schedule: [
            { day: 'Monday', time: '11:00 - 12:00' },
            { day: 'Wednesday', time: '11:00 - 12:00' },
            { day: 'Friday', time: '11:00 - 12:00' }
          ],
          room: 'Room 203',
          description: 'Advanced calculus and trigonometry for Grade 11',
          status: 'active',
          created_at: '2024-01-15'
        }
      ]
      setClasses(mockClasses)
    } catch (error) {
      console.error('Error fetching classes:', error)
    }
    setIsLoading(false)
  }

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cls.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cls.grade.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Header
        title="My Classes"
        subtitle="Manage your assigned classes and view student information"
        actions={
          <Button className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>New Assignment</span>
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Classes</p>
                <p className="text-2xl font-bold text-gray-900">{classes.length}</p>
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
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">
                  {classes.reduce((sum, cls) => sum + cls.students_count, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Weekly Hours</p>
                <p className="text-2xl font-bold text-gray-900">18</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active Classes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {classes.filter(cls => cls.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search classes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">All Classes</Button>
              <Button variant="outline">Active</Button>
              <Button variant="outline">This Week</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Classes Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((classData) => (
            <Card key={classData.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg mb-2">{classData.name}</CardTitle>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="secondary">{classData.subject}</Badge>
                      <Badge className={getStatusColor(classData.status)}>
                        {classData.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{classData.description}</p>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {/* Class Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Grade</p>
                      <p className="text-sm text-gray-900">{classData.grade}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Students</p>
                      <p className="text-sm text-gray-900">{classData.students_count}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Room</p>
                      <p className="text-sm text-gray-900">{classData.room}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Schedule</p>
                      <p className="text-sm text-gray-900">{classData.schedule.length} sessions/week</p>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Weekly Schedule</p>
                    <div className="space-y-1">
                      {classData.schedule.map((session, index) => (
                        <div key={index} className="flex items-center text-xs text-gray-600 bg-gray-50 rounded px-2 py-1">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>{session.day} - {session.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-4 border-t">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <CheckSquare className="w-4 h-4 mr-1" />
                      Attendance
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <FileText className="w-4 h-4 mr-1" />
                      Grades
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredClasses.length === 0 && !isLoading && (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No classes found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery ? 'Try adjusting your search terms.' : 'You have no classes assigned yet.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
