'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users,
  BookOpen,
  Award,
  Clock,
  Calendar,
  MessageSquare,
  FileText,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  TrendingUp,
  AlertCircle
} from 'lucide-react'
import { getData, getCurrentUser } from '@/lib/api'
import { CustomPieChart, CustomBarChart } from '@/components/ui/chart'

interface Child {
  id: string
  student_id: string
  first_name: string
  last_name: string
  grade: string
  class: string
  school: string
  date_of_birth: string
  enrollment_date: string
  status: 'active' | 'inactive' | 'graduated'
  current_gpa: number
  attendance_rate: number
  total_assignments: number
  completed_assignments: number
  upcoming_exams: number
  recent_grades: {
    subject: string
    grade: string
    assignment: string
    date: string
  }[]
  subjects: string[]
  teachers: {
    name: string
    subject: string
    email: string
    phone: string
  }[]
  emergency_contact: {
    name: string
    relationship: string
    phone: string
    email: string
  }
  medical_info?: {
    allergies?: string[]
    medications?: string[]
    conditions?: string[]
  }
}

export default function ParentChildrenPage() {
  const [children, setChildren] = useState<Child[]>([])
  const [selectedChild, setSelectedChild] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  

  useEffect(() => {
    fetchChildren()
  }, [])

  const fetchChildren = async () => {
    setIsLoading(true)
    try {
      // Mock data for demo - replace with real Supabase query
      const mockChildren: Child[] = [
        {
          id: '1',
          student_id: 'STU001',
          first_name: 'Emma',
          last_name: 'Johnson',
          grade: '10th Grade',
          class: '10A',
          school: 'Central High School',
          date_of_birth: '2008-05-15',
          enrollment_date: '2023-08-15',
          status: 'active',
          current_gpa: 3.8,
          attendance_rate: 95,
          total_assignments: 24,
          completed_assignments: 22,
          upcoming_exams: 3,
          recent_grades: [
            { subject: 'Mathematics', grade: 'A-', assignment: 'Algebra Quiz', date: '2024-01-20' },
            { subject: 'Biology', grade: 'A', assignment: 'Lab Report', date: '2024-01-18' },
            { subject: 'History', grade: 'B+', assignment: 'Essay', date: '2024-01-15' }
          ],
          subjects: ['Mathematics', 'Biology', 'History', 'English', 'Chemistry'],
          teachers: [
            { name: 'Mr. Smith', subject: 'Mathematics', email: 'smith@school.edu', phone: '555-0101' },
            { name: 'Ms. Davis', subject: 'Biology', email: 'davis@school.edu', phone: '555-0102' },
            { name: 'Mr. Wilson', subject: 'History', email: 'wilson@school.edu', phone: '555-0103' }
          ],
          emergency_contact: {
            name: 'John Johnson',
            relationship: 'Father',
            phone: '555-0100',
            email: 'john.johnson@email.com'
          },
          medical_info: {
            allergies: ['Peanuts'],
            medications: [],
            conditions: []
          }
        },
        {
          id: '2',
          student_id: 'STU002',
          first_name: 'Alex',
          last_name: 'Johnson',
          grade: '8th Grade',
          class: '8B',
          school: 'Central High School',
          date_of_birth: '2010-09-22',
          enrollment_date: '2023-08-15',
          status: 'active',
          current_gpa: 3.5,
          attendance_rate: 88,
          total_assignments: 20,
          completed_assignments: 18,
          upcoming_exams: 2,
          recent_grades: [
            { subject: 'Mathematics', grade: 'B', assignment: 'Geometry Test', date: '2024-01-19' },
            { subject: 'Science', grade: 'A-', assignment: 'Physics Lab', date: '2024-01-17' },
            { subject: 'English', grade: 'B+', assignment: 'Book Report', date: '2024-01-14' }
          ],
          subjects: ['Mathematics', 'Science', 'English', 'Social Studies', 'Art'],
          teachers: [
            { name: 'Mrs. Brown', subject: 'Mathematics', email: 'brown@school.edu', phone: '555-0201' },
            { name: 'Mr. Garcia', subject: 'Science', email: 'garcia@school.edu', phone: '555-0202' },
            { name: 'Ms. Taylor', subject: 'English', email: 'taylor@school.edu', phone: '555-0203' }
          ],
          emergency_contact: {
            name: 'John Johnson',
            relationship: 'Father',
            phone: '555-0100',
            email: 'john.johnson@email.com'
          }
        }
      ]
      setChildren(mockChildren)
      if (mockChildren.length > 0) {
        setSelectedChild(mockChildren[0].id)
      }
    } catch (error) {
      console.error('Error fetching children:', error)
    }
    setIsLoading(false)
  }

  const selectedChildData = children.find(child => child.id === selectedChild)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'graduated': return 'bg-blue-100 text-blue-800'
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
    if (rate >= 95) return 'text-green-600'
    if (rate >= 90) return 'text-blue-600'
    if (rate >= 85) return 'text-yellow-600'
    return 'text-red-600'
  }

  const gradeDistributionData = selectedChildData?.recent_grades.reduce((acc: any[], grade) => {
    const existing = acc.find(item => item.name === grade.grade[0])
    if (existing) {
      existing.value += 1
    } else {
      acc.push({ name: grade.grade[0], value: 1 })
    }
    return acc
  }, []) || []

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Header
        title="My Children"
        subtitle="Monitor your children's academic progress and school activities"
        actions={
          <div className="flex space-x-2">
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
            <Button>
              <MessageSquare className="w-4 h-4 mr-2" />
              Contact Teachers
            </Button>
          </div>
        }
      />

      {/* Child Selection */}
      {children.length > 1 && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                Select Child:
              </label>
              {children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => setSelectedChild(child.id)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    selectedChild === child.id
                      ? 'bg-blue-100 border-blue-300 text-blue-800'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {child.first_name} {child.last_name}
                  <span className="ml-2 text-sm text-gray-500">({child.grade})</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-6">
          <Card className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : selectedChildData ? (
        <div className="space-y-8">
          {/* Student Profile */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    {selectedChildData.first_name} {selectedChildData.last_name}
                  </CardTitle>
                  <p className="text-gray-600 mt-1">
                    Student ID: {selectedChildData.student_id} | {selectedChildData.grade} - Class {selectedChildData.class}
                  </p>
                </div>
                <Badge className={getStatusColor(selectedChildData.status)}>
                  {selectedChildData.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Personal Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date of Birth:</span>
                      <span className="text-gray-900">{selectedChildData.date_of_birth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">School:</span>
                      <span className="text-gray-900">{selectedChildData.school}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Enrollment Date:</span>
                      <span className="text-gray-900">{selectedChildData.enrollment_date}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Academic Performance</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current GPA:</span>
                      <span className="text-gray-900 font-medium">{selectedChildData.current_gpa}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Attendance Rate:</span>
                      <span className={`font-medium ${getAttendanceColor(selectedChildData.attendance_rate)}`}>
                        {selectedChildData.attendance_rate}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Assignments:</span>
                      <span className="text-gray-900">{selectedChildData.completed_assignments}/{selectedChildData.total_assignments}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Emergency Contact</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="text-gray-900">{selectedChildData.emergency_contact.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Relationship:</span>
                      <span className="text-gray-900">{selectedChildData.emergency_contact.relationship}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{selectedChildData.emergency_contact.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Current GPA</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedChildData.current_gpa}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Attendance</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedChildData.attendance_rate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Assignments</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {selectedChildData.completed_assignments}/{selectedChildData.total_assignments}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Upcoming Exams</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedChildData.upcoming_exams}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Grades and Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Recent Grades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedChildData.recent_grades.map((grade, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{grade.assignment}</h4>
                        <p className="text-sm text-gray-600">{grade.subject}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-semibold ${getGradeColor(grade.grade)}`}>
                          {grade.grade}
                        </div>
                        <p className="text-xs text-gray-500">{grade.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <CustomPieChart data={gradeDistributionData} height={300} />
              </CardContent>
            </Card>
          </div>

          {/* Teachers and Subjects */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Teachers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedChildData.teachers.map((teacher, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <GraduationCap className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{teacher.name}</h4>
                          <p className="text-sm text-gray-600">{teacher.subject}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Phone className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Enrolled Subjects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {selectedChildData.subjects.map((subject, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <BookOpen className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-900">{subject}</span>
                      </div>
                      <Button size="sm" variant="outline">
                        View Progress
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Medical Information */}
          {selectedChildData.medical_info && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  <span>Medical Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Allergies</h4>
                    {selectedChildData.medical_info.allergies && selectedChildData.medical_info.allergies.length > 0 ? (
                      <div className="space-y-1">
                        {selectedChildData.medical_info.allergies.map((allergy, index) => (
                          <Badge key={index} variant="secondary" className="bg-red-100 text-red-800">
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">None reported</p>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Medications</h4>
                    {selectedChildData.medical_info.medications && selectedChildData.medical_info.medications.length > 0 ? (
                      <div className="space-y-1">
                        {selectedChildData.medical_info.medications.map((medication, index) => (
                          <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                            {medication}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">None reported</p>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Conditions</h4>
                    {selectedChildData.medical_info.conditions && selectedChildData.medical_info.conditions.length > 0 ? (
                      <div className="space-y-1">
                        {selectedChildData.medical_info.conditions.map((condition, index) => (
                          <Badge key={index} variant="secondary" className="bg-yellow-100 text-yellow-800">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">None reported</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No children found</h3>
            <p className="text-gray-600">
              Your children's information will appear here once they are enrolled in the system.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
