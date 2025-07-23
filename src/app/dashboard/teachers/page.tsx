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
  GraduationCap,
  UserPlus,
  Download,
  FileText,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Phone,
  Mail,
  Calendar,
  BookOpen,
  Award,
  Users
} from 'lucide-react'
import { getData } from '@/lib/api'

// Utility function for date formatting
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

interface Teacher {
  id: string
  employee_id?: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  qualification?: string
  experience_years?: number
  joining_date?: string
  subject_name?: string
  school_name?: string
  classes_count?: number
  students_count?: number
  status?: 'active' | 'inactive' | 'suspended'
  gender?: 'male' | 'female' | 'other'
  created_at: string
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchTeachers()
  }, [])

  useEffect(() => {
    filterTeachers()
  }, [teachers, searchQuery, statusFilter])

  const fetchTeachers = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await getData('/teachers?limit=100')
      
      if (error) {
        console.error('Error fetching teachers:', error)
        return
      }

      setTeachers(data?.teachers || [])
    } catch (error) {
      console.error('Error fetching teachers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterTeachers = () => {
    let filtered = teachers

    if (searchQuery) {
      filtered = filtered.filter(teacher =>
        teacher.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (teacher.employee_id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(teacher => teacher.status === statusFilter)
    }

    setFilteredTeachers(filtered)
  }

  const handleExportCSV = () => {
    const exportData = filteredTeachers.map(teacher => ({
      'Employee ID': teacher.employee_id,
      'Full Name': `${teacher.first_name} ${teacher.last_name}`,
      'Email': teacher.email,
      'Phone': teacher.phone,
      'Qualification': teacher.qualification || '',
      'Experience': teacher.experience_years || 0,
      'Status': teacher.status,
    }))
    
    // Simple CSV export
    const csvContent = [
      Object.keys(exportData[0] || {}).join(','),
      ...exportData.map(row => Object.values(row).join(','))
    ].join('
')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'export.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getTeacherStats = () => {
    const totalTeachers = teachers.length
    const activeTeachers = teachers.filter(t => t.status === 'active').length
    const maleTeachers = teachers.filter(t => t.gender === 'male').length
    const femaleTeachers = teachers.filter(t => t.gender === 'female').length

    return { totalTeachers, activeTeachers, maleTeachers, femaleTeachers }
  }

  const stats = getTeacherStats()

  return (
    <div className="p-6">
      <Header
        title="Teachers Management"
        subtitle="Manage teacher registrations and assignments"
        actions={
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              PDF
            </Button>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Teacher
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
                  <p className="text-sm text-gray-600">Total Teachers</p>
                  <p className="text-2xl font-bold">{stats.totalTeachers}</p>
                </div>
                <GraduationCap className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-green-600">{stats.activeTeachers}</p>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Male</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.maleTeachers}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Female</p>
                  <p className="text-2xl font-bold text-pink-600">{stats.femaleTeachers}</p>
                </div>
                <Users className="w-8 h-8 text-pink-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Teachers Directory */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-5 h-5" />
                <CardTitle>Teachers Directory</CardTitle>
                <span className="text-sm text-gray-500">{filteredTeachers.length} teachers</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search teachers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>

              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>

            {/* Teachers Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Photo</TableHead>
                    <TableHead>Teacher Details</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Loading teachers...
                      </TableCell>
                    </TableRow>
                  ) : filteredTeachers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No teachers found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTeachers.map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell>
                          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-medium">
                            {teacher.first_name.charAt(0)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {teacher.first_name} {teacher.last_name}
                            </p>
                            <p className="text-sm text-gray-500">
                              ID: {teacher.employee_id}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-1">
                              <Mail className="w-3 h-3 text-gray-400" />
                              <span className="text-sm">{teacher.email}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Phone className="w-3 h-3 text-gray-400" />
                              <span className="text-sm">{teacher.phone}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-500">Not Assigned</span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(teacher.status)}`}>
                            {teacher.status}
                          </span>
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
