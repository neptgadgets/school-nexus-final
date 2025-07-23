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
  School,
  Plus,
  Download,
  FileText,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Users,
  Calendar,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react'
import { getData, getCurrentUser } from '@/lib/api'

// Utility function for date formatting
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

interface SchoolData {
  id: string
  name: string
  address: string
  phone: string
  email: string
  website?: string
  principal_name?: string
  principal_email?: string
  principal_phone?: string
  subscription_plan?: string
  max_students?: number
  max_teachers?: number
  total_students?: number
  total_teachers?: number
  total_classes?: number
  total_admins?: number
  status: 'active' | 'inactive' | 'suspended'
  created_at: string
}

export default function SchoolsPage() {
  const [schools, setSchools] = useState<SchoolData[]>([])
  const [filteredSchools, setFilteredSchools] = useState<SchoolData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [subscriptionFilter, setSubscriptionFilter] = useState('all')
  

  useEffect(() => {
    fetchSchools()
  }, [])

  useEffect(() => {
    filterSchools()
  }, [schools, searchQuery, statusFilter, subscriptionFilter])

  const fetchSchools = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await getData('/super-admin/schools?limit=100')
      
      if (error) {
        console.error('Error fetching schools:', error)
        return
      }

      setSchools(data?.schools || [])
    } catch (error) {
      console.error('Error fetching schools:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterSchools = () => {
    let filtered = schools

    if (searchQuery) {
      filtered = filtered.filter(school =>
        school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(school => school.status === statusFilter)
    }

    if (subscriptionFilter !== 'all') {
      filtered = filtered.filter(school => (school.subscription_plan || 'basic') === subscriptionFilter)
    }

    setFilteredSchools(filtered)
  }

  const handleExportCSV = () => {
    const exportData = filteredSchools.map(school => ({
      'School Name': school.name,
      'Email': school.email,
      'Phone': school.phone,
      'Address': school.address,
      'Status': school.status || 'Active',
      'Subscription': school.subscription_plan || 'Basic',
      'Created': formatDate(school.created_at),
    }))
    
    // Simple CSV export
    const csvContent = [
      Object.keys(exportData[0] || {}).join(","),
      ...exportData.map(row => Object.values(row).join(","))
    ].join("\n")
    
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "export.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getSchoolStats = () => {
    const totalSchools = schools.length
    const activeSchools = schools.filter(s => s.status === 'active').length
    const trialSchools = schools.filter(s => s.subscription_plan === 'basic').length
    const premiumSchools = schools.filter(s => s.subscription_plan === 'premium').length

    return { totalSchools, activeSchools, trialSchools, premiumSchools }
  }

  const getSubscriptionStatus = (school: SchoolData) => {
    if (school.status !== 'active') {
      return { color: 'bg-gray-100 text-gray-800', icon: AlertTriangle, label: 'Inactive' }
    }

    switch (school.subscription_plan) {
      case 'premium':
        return { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Premium' }
      case 'basic':
        return { color: 'bg-blue-100 text-blue-800', icon: Clock, label: 'Basic' }
      case 'enterprise':
        return { color: 'bg-purple-100 text-purple-800', icon: CheckCircle, label: 'Enterprise' }
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: AlertTriangle, label: 'Basic' }
    }
  }

  const stats = getSchoolStats()

  return (
    <div className="p-6">
      <Header
        title="Schools Management"
        subtitle="Manage all schools in the system"
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
              New School
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
                  <p className="text-sm text-gray-600">Total Schools</p>
                  <p className="text-2xl font-bold">{stats.totalSchools}</p>
                </div>
                <School className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Schools</p>
                  <p className="text-2xl font-bold text-green-600">{stats.activeSchools}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Trial Schools</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.trialSchools}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                                      <p className="text-sm text-gray-600">Premium</p>
                  <p className="text-2xl font-bold text-red-600">{stats.premiumSchools}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Schools List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <School className="w-5 h-5" />
                <CardTitle>Schools Directory</CardTitle>
                <span className="text-sm text-gray-500">{filteredSchools.length} schools</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search schools..."
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

              <select
                value={subscriptionFilter}
                onChange={(e) => setSubscriptionFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Subscriptions</option>
                <option value="active">Active</option>
                <option value="trial">Trial</option>
                <option value="expired">Expired</option>
              </select>

              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>

            {/* Schools Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>School</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Subscription</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Loading schools...
                      </TableCell>
                    </TableRow>
                  ) : filteredSchools.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No schools found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSchools.map((school) => {
                      const subscriptionStatus = getSubscriptionStatus(school)
                      const StatusIcon = subscriptionStatus.icon
                      return (
                        <TableRow key={school.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <School className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium">{school.name}</p>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                                  school.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {school.status === 'active' ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-1">
                                <Mail className="w-3 h-3 text-gray-400" />
                                <span className="text-sm">{school.email}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Phone className="w-3 h-3 text-gray-400" />
                                <span className="text-sm">{school.phone}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3 text-gray-400" />
                              <span className="text-sm max-w-xs truncate">{school.address}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <StatusIcon className="w-4 h-4" />
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${subscriptionStatus.color}`}>
                                {subscriptionStatus.label}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Plan: {school.subscription_plan || 'Basic'}
                            </p>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{formatDate(school.created_at)}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm" title="View Details">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" title="Edit School">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" title="Manage Users">
                                <Users className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" title="Subscription">
                                <DollarSign className="w-4 h-4" />
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Plus className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Add New School</h3>
                  <p className="text-sm text-gray-600">Register a new school</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Manage Subscriptions</h3>
                  <p className="text-sm text-gray-600">Handle billing and subscriptions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Generate Reports</h3>
                  <p className="text-sm text-gray-600">System-wide reports</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
