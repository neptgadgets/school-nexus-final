'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { 
  FileText,
  Plus,
  Search,
  Calendar,
  Clock,
  Users,
  Edit,
  Eye,
  Trash2,
  Upload,
  Download
} from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabase-client'

interface Assignment {
  id: string
  title: string
  description: string
  class: string
  subject: string
  due_date: string
  created_date: string
  status: 'draft' | 'published' | 'closed'
  total_points: number
  submissions_count: number
  total_students: number
  type: 'homework' | 'project' | 'quiz' | 'exam'
  attachments?: string[]
}

export default function TeacherAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    class: '',
    due_date: '',
    total_points: 100,
    type: 'homework' as const
  })
  const supabase = createSupabaseClient()

  useEffect(() => {
    fetchAssignments()
  }, [])

  const fetchAssignments = async () => {
    setIsLoading(true)
    try {
      // Mock data for demo - replace with real Supabase query
      const mockAssignments: Assignment[] = [
        {
          id: '1',
          title: 'Algebraic Equations Practice',
          description: 'Solve the quadratic equations from Chapter 5, problems 1-20. Show all work and steps.',
          class: 'Mathematics 10A',
          subject: 'Mathematics',
          due_date: '2024-01-25',
          created_date: '2024-01-18',
          status: 'published',
          total_points: 100,
          submissions_count: 23,
          total_students: 28,
          type: 'homework',
          attachments: ['equations_worksheet.pdf']
        },
        {
          id: '2',
          title: 'Geometry Project: Real World Applications',
          description: 'Create a presentation showing how geometric principles are used in architecture or engineering.',
          class: 'Mathematics 10A',
          subject: 'Mathematics',
          due_date: '2024-02-01',
          created_date: '2024-01-20',
          status: 'published',
          total_points: 150,
          submissions_count: 15,
          total_students: 28,
          type: 'project'
        },
        {
          id: '3',
          title: 'Trigonometry Quiz',
          description: 'Quick assessment on sine, cosine, and tangent functions.',
          class: 'Advanced Mathematics 11',
          subject: 'Mathematics',
          due_date: '2024-01-23',
          created_date: '2024-01-21',
          status: 'published',
          total_points: 50,
          submissions_count: 18,
          total_students: 22,
          type: 'quiz'
        },
        {
          id: '4',
          title: 'Calculus Problem Set',
          description: 'Advanced calculus problems focusing on derivatives and integrals.',
          class: 'Advanced Mathematics 11',
          subject: 'Mathematics',
          due_date: '2024-01-30',
          created_date: '2024-01-22',
          status: 'draft',
          total_points: 120,
          submissions_count: 0,
          total_students: 22,
          type: 'homework'
        }
      ]
      setAssignments(mockAssignments)
    } catch (error) {
      console.error('Error fetching assignments:', error)
    }
    setIsLoading(false)
  }

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = 
      assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.class.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'homework': return 'bg-blue-100 text-blue-800'
      case 'project': return 'bg-purple-100 text-purple-800'
      case 'quiz': return 'bg-orange-100 text-orange-800'
      case 'exam': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSubmissionProgress = (submitted: number, total: number) => {
    return Math.round((submitted / total) * 100)
  }

  const handleCreateAssignment = async () => {
    // Mock creation - replace with real Supabase insert
    const assignment: Assignment = {
      id: Date.now().toString(),
      ...newAssignment,
      created_date: new Date().toISOString().split('T')[0],
      status: 'draft',
      submissions_count: 0,
      total_students: 28,
      subject: 'Mathematics'
    }
    setAssignments([assignment, ...assignments])
    setShowCreateDialog(false)
    setNewAssignment({
      title: '',
      description: '',
      class: '',
      due_date: '',
      total_points: 100,
      type: 'homework'
    })
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Header
        title="Assignments"
        subtitle="Create, manage, and track student assignments"
        actions={
          <Button onClick={() => setShowCreateDialog(true)} className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Create Assignment</span>
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Assignments</p>
                <p className="text-2xl font-bold text-gray-900">{assignments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Upload className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold text-gray-900">
                  {assignments.filter(a => a.status === 'published').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Drafts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {assignments.filter(a => a.status === 'draft').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Submissions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(assignments.reduce((sum, a) => sum + getSubmissionProgress(a.submissions_count, a.total_students), 0) / assignments.length) || 0}%
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
                  placeholder="Search assignments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="closed">Closed</option>
              </select>
              <Button variant="outline">This Week</Button>
              <Button variant="outline">Overdue</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assignments List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
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
          {filteredAssignments.map((assignment) => (
            <Card key={assignment.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <CardTitle className="text-lg">{assignment.title}</CardTitle>
                      <Badge className={getStatusColor(assignment.status)}>
                        {assignment.status}
                      </Badge>
                      <Badge className={getTypeColor(assignment.type)}>
                        {assignment.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{assignment.description}</p>
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Due: {assignment.due_date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{assignment.class}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FileText className="w-4 h-4" />
                        <span>{assignment.total_points} points</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Submissions</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {assignment.submissions_count} / {assignment.total_students}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Progress</p>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${getSubmissionProgress(assignment.submissions_count, assignment.total_students)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">
                          {getSubmissionProgress(assignment.submissions_count, assignment.total_students)}%
                        </span>
                      </div>
                    </div>
                    {assignment.attachments && assignment.attachments.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-600">Attachments</p>
                        <div className="flex space-x-1">
                          {assignment.attachments.map((file, index) => (
                            <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {file}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                    <Button size="sm">
                      View Submissions
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredAssignments.length === 0 && !isLoading && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery ? 'Try adjusting your search terms.' : 'Create your first assignment to get started.'}
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Assignment
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Assignment Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Assignment</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <Input
                value={newAssignment.title}
                onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                placeholder="Assignment title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <Textarea
                value={newAssignment.description}
                onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                placeholder="Assignment description and instructions"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                <select
                  value={newAssignment.class}
                  onChange={(e) => setNewAssignment({...newAssignment, class: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Class</option>
                  <option value="Mathematics 10A">Mathematics 10A</option>
                  <option value="Mathematics 10B">Mathematics 10B</option>
                  <option value="Advanced Mathematics 11">Advanced Mathematics 11</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={newAssignment.type}
                  onChange={(e) => setNewAssignment({...newAssignment, type: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="homework">Homework</option>
                  <option value="project">Project</option>
                  <option value="quiz">Quiz</option>
                  <option value="exam">Exam</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <Input
                  type="date"
                  value={newAssignment.due_date}
                  onChange={(e) => setNewAssignment({...newAssignment, due_date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Points</label>
                <Input
                  type="number"
                  value={newAssignment.total_points}
                  onChange={(e) => setNewAssignment({...newAssignment, total_points: parseInt(e.target.value)})}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateAssignment}>
                Create Assignment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
