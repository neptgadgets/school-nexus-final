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
  BookOpen,
  Plus,
  Download,
  FileText,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Users,
  User,
  Calendar,
  GraduationCap
} from 'lucide-react'
import { getData } from '@/lib/api'
// Utility function for date formatting
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

interface Class {
  id: string
  name: string
  description?: string
  capacity: number
  current_enrollment: number
  class_teacher_id?: string
  is_active: boolean
  created_at: string
  teachers?: {
    first_name: string
    last_name: string
    email: string
  }
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([])
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  

  useEffect(() => {
    fetchClasses()
  }, [])

  useEffect(() => {
    filterClasses()
  }, [classes, searchQuery, statusFilter])

  const fetchClasses = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await getData('/classes')

      if (error) {
        console.error('Error fetching classes:', error)
        return
      }

      setClasses(data?.classes || [])
    } catch (error) {
      console.error('Error fetching classes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterClasses = () => {
    let filtered = classes

    if (searchQuery) {
      filtered = filtered.filter(cls =>
        cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.teachers?.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.teachers?.last_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'active') {
        filtered = filtered.filter(cls => cls.is_active)
      } else if (statusFilter === 'inactive') {
        filtered = filtered.filter(cls => !cls.is_active)
      }
    }

    setFilteredClasses(filtered)
  }

  const handleExportCSV = () => {
    const exportData = filteredClasses.map(cls => ({
      'Class Name': cls.name,
      'Description': cls.description || '',
      'Capacity': cls.capacity,
      'Current Enrollment': cls.current_enrollment,
      'Available Spots': cls.capacity - cls.current_enrollment,
      'Class Teacher': cls.teachers ? `${cls.teachers.first_name} ${cls.teachers.last_name}` : 'Not Assigned',
      'Status': cls.is_active ? 'Active' : 'Inactive',
      'Created': formatDate(cls.created_at),
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

  const getClassStats = () => {
    const totalClasses = classes.length
    const activeClasses = classes.filter(c => c.is_active).length
    const totalCapacity = classes.reduce((sum, c) => sum + c.capacity, 0)
    const totalEnrollment = classes.reduce((sum, c) => sum + c.current_enrollment, 0)

    return { totalClasses, activeClasses, totalCapacity, totalEnrollment }
  }

  const stats = getClassStats()

  const getEnrollmentStatus = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100
    if (percentage >= 95) return { color: 'text-red-600 bg-red-50', label: 'Full' }
    if (percentage >= 80) return { color: 'text-orange-600 bg-orange-50', label: 'High' }
    if (percentage >= 50) return { color: 'text-blue-600 bg-blue-50', label: 'Medium' }
    return { color: 'text-green-600 bg-green-50', label: 'Low' }
  }

  return (
    <div className="p-6">
      <Header
        title="Classes Management"
        subtitle="Manage class organization and capacity"
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
              <Plus className="w-4 h-4 mr-2" />
              Add Class
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
                  <p className="text-sm text-gray-600">Total Classes</p>
                  <p className="text-2xl font-bold">{stats.totalClasses}</p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Classes</p>
                  <p className="text-2xl font-bold text-green-600">{stats.activeClasses}</p>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Capacity</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalCapacity}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Enrollment</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.totalEnrollment}</p>
                </div>
                <User className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Classes List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <CardTitle>Classes Directory</CardTitle>
                <span className="text-sm text-gray-500">{filteredClasses.length} classes</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search classes..."
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
              </select>

              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>

            {/* Classes Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class Name</TableHead>
                    <TableHead>Class Teacher</TableHead>
                    <TableHead>Enrollment</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Loading classes...
                      </TableCell>
                    </TableRow>
                  ) : filteredClasses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No classes found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredClasses.map((cls) => {
                      const enrollmentStatus = getEnrollmentStatus(cls.current_enrollment, cls.capacity)
                      return (
                        <TableRow key={cls.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{cls.name}</p>
                              {cls.description && (
                                <p className="text-sm text-gray-500">{cls.description}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {cls.teachers ? (
                              <div>
                                <p className="font-medium">
                                  {cls.teachers.first_name} {cls.teachers.last_name}
                                </p>
                                <p className="text-sm text-gray-500">{cls.teachers.email}</p>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">Not Assigned</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{cls.current_enrollment}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${enrollmentStatus.color}`}>
                                {enrollmentStatus.label}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{cls.capacity}</span>
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full" 
                                  style={{ width: `${(cls.current_enrollment / cls.capacity) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              cls.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {cls.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm" title="View Students">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" title="Edit Class">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" title="Assign Teacher">
                                <GraduationCap className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" title="Delete" className="text-red-600">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })
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
