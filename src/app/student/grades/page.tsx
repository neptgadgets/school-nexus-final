'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Award,
  BookOpen,
  TrendingUp,
  TrendingDown,
  Calendar,
  FileText,
  Download,
  Filter,
  Search
} from 'lucide-react'
import { getData, getCurrentUser } from '@/lib/api'
import { CustomBarChart, CustomLineChart } from '@/components/ui/chart'

interface Grade {
  id: string
  assignment_title: string
  subject: string
  assignment_type: 'homework' | 'quiz' | 'project' | 'exam'
  points_earned: number
  total_points: number
  percentage: number
  letter_grade: string
  submitted_date: string
  graded_date: string
  teacher_feedback?: string
  status: 'graded' | 'pending' | 'late'
}

interface SubjectGPA {
  subject: string
  gpa: number
  credits: number
  letter_grade: string
  assignments_count: number
}

export default function StudentGradesPage() {
  const [grades, setGrades] = useState<Grade[]>([])
  const [subjectGPAs, setSubjectGPAs] = useState<SubjectGPA[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  

  useEffect(() => {
    fetchGrades()
  }, [])

  const fetchGrades = async () => {
    setIsLoading(true)
    try {
      // Mock data for demo - replace with real Supabase query
      const mockGrades: Grade[] = [
        {
          id: '1',
          assignment_title: 'Algebraic Equations Practice',
          subject: 'Mathematics',
          assignment_type: 'homework',
          points_earned: 85,
          total_points: 100,
          percentage: 85,
          letter_grade: 'B',
          submitted_date: '2024-01-20',
          graded_date: '2024-01-22',
          teacher_feedback: 'Good work! Pay attention to showing all steps.',
          status: 'graded'
        },
        {
          id: '2',
          assignment_title: 'Geometry Quiz',
          subject: 'Mathematics',
          assignment_type: 'quiz',
          points_earned: 92,
          total_points: 100,
          percentage: 92,
          letter_grade: 'A-',
          submitted_date: '2024-01-18',
          graded_date: '2024-01-19',
          teacher_feedback: 'Excellent understanding of geometric principles!',
          status: 'graded'
        },
        {
          id: '3',
          assignment_title: 'Scientific Method Lab Report',
          subject: 'Biology',
          assignment_type: 'project',
          points_earned: 88,
          total_points: 100,
          percentage: 88,
          letter_grade: 'B+',
          submitted_date: '2024-01-15',
          graded_date: '2024-01-17',
          teacher_feedback: 'Well-structured report. Include more detailed observations.',
          status: 'graded'
        },
        {
          id: '4',
          assignment_title: 'Cell Structure Quiz',
          subject: 'Biology',
          assignment_type: 'quiz',
          points_earned: 95,
          total_points: 100,
          percentage: 95,
          letter_grade: 'A',
          submitted_date: '2024-01-12',
          graded_date: '2024-01-14',
          teacher_feedback: 'Perfect score! Great understanding.',
          status: 'graded'
        },
        {
          id: '5',
          assignment_title: 'Essay: World War II Impact',
          subject: 'History',
          assignment_type: 'project',
          points_earned: 78,
          total_points: 100,
          percentage: 78,
          letter_grade: 'C+',
          submitted_date: '2024-01-10',
          graded_date: '2024-01-12',
          teacher_feedback: 'Good research but needs stronger thesis statement.',
          status: 'graded'
        },
        {
          id: '6',
          assignment_title: 'Trigonometry Test',
          subject: 'Mathematics',
          assignment_type: 'exam',
          points_earned: 0,
          total_points: 150,
          percentage: 0,
          letter_grade: 'Pending',
          submitted_date: '2024-01-23',
          graded_date: '',
          status: 'pending'
        }
      ]

      const mockSubjectGPAs: SubjectGPA[] = [
        {
          subject: 'Mathematics',
          gpa: 3.7,
          credits: 4,
          letter_grade: 'A-',
          assignments_count: 8
        },
        {
          subject: 'Biology',
          gpa: 3.9,
          credits: 4,
          letter_grade: 'A-',
          assignments_count: 6
        },
        {
          subject: 'History',
          gpa: 3.2,
          credits: 3,
          letter_grade: 'B',
          assignments_count: 5
        },
        {
          subject: 'English',
          gpa: 3.5,
          credits: 4,
          letter_grade: 'B+',
          assignments_count: 7
        }
      ]

      setGrades(mockGrades)
      setSubjectGPAs(mockSubjectGPAs)
    } catch (error) {
      console.error('Error fetching grades:', error)
    }
    setIsLoading(false)
  }

  const filteredGrades = grades.filter(grade => {
    const matchesSearch = 
      grade.assignment_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grade.subject.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesSubject = subjectFilter === 'all' || grade.subject === subjectFilter
    const matchesType = typeFilter === 'all' || grade.assignment_type === typeFilter
    
    return matchesSearch && matchesSubject && matchesType
  })

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-50'
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-50'
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-50'
    if (grade.startsWith('D')) return 'text-orange-600 bg-orange-50'
    if (grade === 'Pending') return 'text-gray-600 bg-gray-50'
    return 'text-red-600 bg-red-50'
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'homework': return 'bg-blue-100 text-blue-800'
      case 'quiz': return 'bg-purple-100 text-purple-800'
      case 'project': return 'bg-green-100 text-green-800'
      case 'exam': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const calculateOverallGPA = () => {
    const totalPoints = subjectGPAs.reduce((sum, subject) => sum + (subject.gpa * subject.credits), 0)
    const totalCredits = subjectGPAs.reduce((sum, subject) => sum + subject.credits, 0)
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00'
  }

  const gradeDistributionData = [
    { name: 'A', value: grades.filter(g => g.letter_grade.startsWith('A')).length },
    { name: 'B', value: grades.filter(g => g.letter_grade.startsWith('B')).length },
    { name: 'C', value: grades.filter(g => g.letter_grade.startsWith('C')).length },
    { name: 'D', value: grades.filter(g => g.letter_grade.startsWith('D')).length },
    { name: 'F', value: grades.filter(g => g.letter_grade.startsWith('F')).length }
  ]

  const performanceTrendData = [
    { name: 'Week 1', value: 85 },
    { name: 'Week 2', value: 88 },
    { name: 'Week 3', value: 92 },
    { name: 'Week 4', value: 87 },
    { name: 'Week 5', value: 90 },
    { name: 'Week 6', value: 93 }
  ]

  const uniqueSubjects = Array.from(new Set(grades.map(g => g.subject)))

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Header
        title="My Grades"
        subtitle="Track your academic performance and view detailed grade reports"
        actions={
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button>
              <FileText className="w-4 h-4 mr-2" />
              Transcript
            </Button>
          </div>
        }
      />

      {/* GPA Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Overall GPA</p>
                <p className="text-2xl font-bold text-gray-900">{calculateOverallGPA()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Credits</p>
                <p className="text-2xl font-bold text-gray-900">
                  {subjectGPAs.reduce((sum, s) => sum + s.credits, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Assignments</p>
                <p className="text-2xl font-bold text-gray-900">{grades.length}</p>
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
                <p className="text-sm font-medium text-gray-600">This Semester</p>
                <p className="text-2xl font-bold text-gray-900">4</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject GPAs */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Subject Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {subjectGPAs.map((subject) => (
              <div key={subject.subject} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{subject.subject}</h3>
                  <Badge className={getGradeColor(subject.letter_grade)}>
                    {subject.letter_grade}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>GPA:</span>
                    <span className="font-medium">{subject.gpa.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Credits:</span>
                    <span className="font-medium">{subject.credits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Assignments:</span>
                    <span className="font-medium">{subject.assignments_count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Grade Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomBarChart data={gradeDistributionData} height={300} color="#3b82f6" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomLineChart data={performanceTrendData} height={300} color="#10b981" />
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search assignments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Subjects</option>
                {uniqueSubjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Types</option>
                <option value="homework">Homework</option>
                <option value="quiz">Quiz</option>
                <option value="project">Project</option>
                <option value="exam">Exam</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grades List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredGrades.map((grade) => (
            <Card key={grade.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{grade.assignment_title}</h3>
                      <Badge className={getTypeColor(grade.assignment_type)}>
                        {grade.assignment_type}
                      </Badge>
                      <Badge variant="secondary">{grade.subject}</Badge>
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Submitted: {grade.submitted_date}</span>
                      </div>
                      {grade.graded_date && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Graded: {grade.graded_date}</span>
                        </div>
                      )}
                    </div>
                    {grade.teacher_feedback && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Teacher Feedback:</strong> {grade.teacher_feedback}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-600">Score</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {grade.status === 'pending' ? 'Pending' : `${grade.points_earned}/${grade.total_points}`}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-600">Percentage</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {grade.status === 'pending' ? '-' : `${grade.percentage}%`}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-600">Grade</p>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(grade.letter_grade)}`}>
                        {grade.letter_grade}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredGrades.length === 0 && !isLoading && (
        <Card>
          <CardContent className="p-12 text-center">
            <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No grades found</h3>
            <p className="text-gray-600">
              {searchQuery || subjectFilter !== 'all' || typeFilter !== 'all' 
                ? 'Try adjusting your search filters.' 
                : 'Your grades will appear here once assignments are graded.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
