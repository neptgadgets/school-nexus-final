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
  FileText,
  Plus,
  Download,
  Calendar,
  Clock,
  Users,
  BookOpen,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter
} from 'lucide-react'
import { getData } from '@/lib/api'
import { formatDate, getStatusColor, exportToCSV } from '@/lib/utils'

interface Exam {
  id: string
  name: string
  exam_date: string
  start_time: string
  end_time: string
  total_marks: number
  duration_minutes: number
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
  created_at: string
  subjects?: {
    name: string
    code: string
  }
  classes?: {
    name: string
  }
  academic_terms?: {
    name: string
  }
}

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([])
  const [filteredExams, setFilteredExams] = useState<Exam[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('all')
  

  useEffect(() => {
    fetchExams()
  }, [])

  useEffect(() => {
    filterExams()
  }, [exams, searchQuery, statusFilter, activeTab])

  const fetchExams = async () => {
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
        .from('exams')
        .select(`
          *,
          subjects (
            name,
            code
          ),
          classes (
            name
          ),
          academic_terms (
            name
          )
        `)
        .eq('school_id', admin.school_id)
        .order('exam_date', { ascending: true })

      if (error) {
        console.error('Error fetching exams:', error)
        return
      }

      setExams(data || [])
    } catch (error) {
      console.error('Error fetching exams:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterExams = () => {
    let filtered = exams

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(exam =>
        exam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.subjects?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.classes?.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(exam => exam.status === statusFilter)
    }

    // Tab filter
    if (activeTab !== 'all') {
      filtered = filtered.filter(exam => exam.status === activeTab)
    }

    setFilteredExams(filtered)
  }

  const handleExportCSV = () => {
    const exportData = filteredExams.map(exam => ({
      'Exam Name': exam.name,
      'Subject': exam.subjects?.name || '',
      'Class': exam.classes?.name || '',
      'Date': formatDate(exam.exam_date),
      'Start Time': exam.start_time,
      'End Time': exam.end_time,
      'Duration (mins)': exam.duration_minutes,
      'Total Marks': exam.total_marks,
      'Status': exam.status,
    }))
    
    exportToCSV(exportData, 'exams-list')
  }

  const getExamStats = () => {
    const totalExams = exams.length
    const scheduledExams = exams.filter(e => e.status === 'scheduled').length
    const ongoingExams = exams.filter(e => e.status === 'ongoing').length
    const completedExams = exams.filter(e => e.status === 'completed').length

    return { totalExams, scheduledExams, ongoingExams, completedExams }
  }

  const stats = getExamStats()

  const tabs = [
    { id: 'all', label: 'All Exams', count: stats.totalExams },
    { id: 'scheduled', label: 'Scheduled', count: stats.scheduledExams },
    { id: 'ongoing', label: 'Ongoing', count: stats.ongoingExams },
    { id: 'completed', label: 'Completed', count: stats.completedExams },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Calendar className="w-4 h-4 text-blue-600" />
      case 'ongoing':
        return <Clock className="w-4 h-4 text-orange-600" />
      case 'completed':
        return <FileText className="w-4 h-4 text-green-600" />
      case 'cancelled':
        return <Trash2 className="w-4 h-4 text-red-600" />
      default:
        return <Calendar className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="p-6">
      <Header
        title="Exams Management"
        subtitle="Manage exams, schedules, and student assessments"
        actions={
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add New Exam
            </Button>
          </div>
        }
      />

      <div className="mt-6">
        {/* Exam Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Exams</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalExams}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Scheduled</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.scheduledExams}</p>
                </div>
                <Calendar className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ongoing</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.ongoingExams}</p>
                </div>
                <Clock className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completedExams}</p>
                </div>
                <Users className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Exams List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Exams ({filteredExams.length})
              </CardTitle>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search exams..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Status</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Total Marks</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        Loading exams...
                      </TableCell>
                    </TableRow>
                  ) : filteredExams.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        No exams found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredExams.map((exam) => (
                      <TableRow key={exam.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{exam.name}</p>
                            <p className="text-sm text-gray-500">
                              {exam.academic_terms?.name}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {exam.classes?.name}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{exam.subjects?.name}</p>
                            <p className="text-sm text-gray-500">{exam.subjects?.code}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{exam.total_marks}</TableCell>
                        <TableCell>{exam.duration_minutes} mins</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{formatDate(exam.exam_date)}</p>
                            <p className="text-sm text-gray-500">
                              {exam.start_time} - {exam.end_time}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(exam.status)}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(exam.status)}`}>
                              {exam.status}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
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
      </div>
    </div>
  )
}
