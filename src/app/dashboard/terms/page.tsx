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
  Plus,
  Download,
  FileText,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  PlayCircle
} from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabase'
import { formatDate, exportToCSV } from '@/lib/utils'

interface AcademicTerm {
  id: string
  name: string
  academic_session: string
  start_date: string
  end_date: string
  is_current: boolean
  is_active: boolean
  created_at: string
}

export default function TermsPage() {
  const [terms, setTerms] = useState<AcademicTerm[]>([])
  const [filteredTerms, setFilteredTerms] = useState<AcademicTerm[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const supabase = createSupabaseClient()

  useEffect(() => {
    fetchTerms()
  }, [])

  useEffect(() => {
    filterTerms()
  }, [terms, searchQuery, statusFilter])

  const fetchTerms = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data: admin } = await supabase
        .from('administrators')
        .select('school_id')
        .eq('user_id', session.user.id)
        .single()

      if (!admin?.school_id) return

      const { data, error } = await supabase
        .from('academic_terms')
        .select('*')
        .eq('school_id', admin.school_id)
        .order('start_date', { ascending: false })

      if (error) {
        console.error('Error fetching terms:', error)
        return
      }

      setTerms(data || [])
    } catch (error) {
      console.error('Error fetching terms:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterTerms = () => {
    let filtered = terms

    if (searchQuery) {
      filtered = filtered.filter(term =>
        term.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.academic_session.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'active') {
        filtered = filtered.filter(term => term.is_active)
      } else if (statusFilter === 'current') {
        filtered = filtered.filter(term => term.is_current)
      } else if (statusFilter === 'inactive') {
        filtered = filtered.filter(term => !term.is_active)
      }
    }

    setFilteredTerms(filtered)
  }

  const handleExportCSV = () => {
    const exportData = filteredTerms.map(term => ({
      'Term Name': term.name,
      'Academic Session': term.academic_session,
      'Start Date': formatDate(term.start_date),
      'End Date': formatDate(term.end_date),
      'Is Current': term.is_current ? 'Yes' : 'No',
      'Status': term.is_active ? 'Active' : 'Inactive',
      'Created': formatDate(term.created_at),
    }))
    
    exportToCSV(exportData, 'academic-terms')
  }

  const getTermStats = () => {
    const totalTerms = terms.length
    const activeTerms = terms.filter(t => t.is_active).length
    const currentTerm = terms.find(t => t.is_current)
    const upcomingTerms = terms.filter(t => new Date(t.start_date) > new Date()).length

    return { totalTerms, activeTerms, currentTerm, upcomingTerms }
  }

  const getTermStatus = (term: AcademicTerm) => {
    const now = new Date()
    const startDate = new Date(term.start_date)
    const endDate = new Date(term.end_date)

    if (!term.is_active) {
      return { status: 'inactive', color: 'bg-gray-100 text-gray-800', icon: AlertCircle }
    }

    if (term.is_current && now >= startDate && now <= endDate) {
      return { status: 'current', color: 'bg-green-100 text-green-800', icon: PlayCircle }
    }

    if (now < startDate) {
      return { status: 'upcoming', color: 'bg-blue-100 text-blue-800', icon: Clock }
    }

    if (now > endDate) {
      return { status: 'completed', color: 'bg-purple-100 text-purple-800', icon: CheckCircle }
    }

    return { status: 'active', color: 'bg-orange-100 text-orange-800', icon: Calendar }
  }

  const stats = getTermStats()

  return (
    <div className="p-6">
      <Header
        title="Terms Management"
        subtitle="Manage academic terms and sessions"
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
              Add New Term
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
                  <p className="text-sm text-gray-600">Total Terms</p>
                  <p className="text-2xl font-bold">{stats.totalTerms}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Terms</p>
                  <p className="text-2xl font-bold text-green-600">{stats.activeTerms}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Current Term</p>
                  <p className="text-lg font-bold text-purple-600">
                    {stats.currentTerm?.name || 'None'}
                  </p>
                </div>
                <PlayCircle className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.upcomingTerms}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Term Info */}
        {stats.currentTerm && (
          <Card className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-purple-800">
                <PlayCircle className="w-5 h-5" />
                <span>Current Academic Term</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Term Name</p>
                  <p className="font-semibold text-purple-800">{stats.currentTerm.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Academic Session</p>
                  <p className="font-semibold text-purple-800">{stats.currentTerm.academic_session}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-semibold text-purple-800">
                    {formatDate(stats.currentTerm.start_date)} - {formatDate(stats.currentTerm.end_date)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Terms List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <CardTitle>Terms ({filteredTerms.length})</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search terms..."
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
                <option value="all">All Terms</option>
                <option value="current">Current</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>

            {/* Terms Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Academic Session</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Loading terms...
                      </TableCell>
                    </TableRow>
                  ) : filteredTerms.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No terms found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTerms.map((term) => {
                      const termStatus = getTermStatus(term)
                      const StatusIcon = termStatus.icon
                      return (
                        <TableRow key={term.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium">{term.name}</p>
                                {term.is_current && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 mt-1">
                                    <PlayCircle className="w-3 h-3 mr-1" />
                                    Current
                                  </span>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">{term.academic_session}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{formatDate(term.start_date)}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{formatDate(term.end_date)}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <StatusIcon className="w-4 h-4" />
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${termStatus.color}`}>
                                {termStatus.status}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm" title="View Details">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" title="Edit Term">
                                <Edit className="w-4 h-4" />
                              </Button>
                              {!term.is_current && (
                                <Button variant="ghost" size="sm" title="Set as Current" className="text-green-600">
                                  <PlayCircle className="w-4 h-4" />
                                </Button>
                              )}
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
