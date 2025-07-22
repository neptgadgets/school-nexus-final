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
  Users,
  UserPlus,
  Download,
  FileText,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Shield,
  School,
  Mail,
  Phone,
  Crown,
  User
} from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabase'
import { getStatusColor, formatDate, exportToCSV } from '@/lib/utils'

interface Administrator {
  id: string
  user_id: string
  school_id?: string
  role: 'super_admin' | 'school_admin'
  first_name: string
  last_name: string
  email: string
  phone?: string
  avatar_url?: string
  is_active: boolean
  created_at: string
  schools?: {
    name: string
  }
}

export default function AdministratorsPage() {
  const [administrators, setAdministrators] = useState<Administrator[]>([])
  const [filteredAdministrators, setFilteredAdministrators] = useState<Administrator[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const supabase = createSupabaseClient()

  useEffect(() => {
    fetchAdministrators()
  }, [])

  useEffect(() => {
    filterAdministrators()
  }, [administrators, searchQuery, roleFilter, statusFilter])

  const fetchAdministrators = async () => {
    try {
      const { data, error } = await supabase
        .from('administrators')
        .select(`
          *,
          schools (
            name
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching administrators:', error)
        return
      }

      setAdministrators(data || [])
    } catch (error) {
      console.error('Error fetching administrators:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterAdministrators = () => {
    let filtered = administrators

    if (searchQuery) {
      filtered = filtered.filter(admin =>
        admin.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.schools?.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(admin => admin.role === roleFilter)
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'active') {
        filtered = filtered.filter(admin => admin.is_active)
      } else if (statusFilter === 'inactive') {
        filtered = filtered.filter(admin => !admin.is_active)
      }
    }

    setFilteredAdministrators(filtered)
  }

  const handleExportCSV = () => {
    const exportData = filteredAdministrators.map(admin => ({
      'Full Name': `${admin.first_name} ${admin.last_name}`,
      'Email': admin.email,
      'Phone': admin.phone || '',
      'Role': admin.role,
      'School': admin.schools?.name || 'N/A',
      'Status': admin.is_active ? 'Active' : 'Inactive',
      'Created': formatDate(admin.created_at),
    }))
    
    exportToCSV(exportData, 'administrators-list')
  }

  const getAdminStats = () => {
    const totalAdmins = administrators.length
    const superAdmins = administrators.filter(a => a.role === 'super_admin').length
    const schoolAdmins = administrators.filter(a => a.role === 'school_admin').length
    const activeAdmins = administrators.filter(a => a.is_active).length

    return { totalAdmins, superAdmins, schoolAdmins, activeAdmins }
  }

  const getRoleIcon = (role: string) => {
    return role === 'super_admin' ? Crown : User
  }

  const getRoleColor = (role: string) => {
    return role === 'super_admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
  }

  const stats = getAdminStats()

  return (
    <div className="p-6">
      <Header
        title="Administrators Management"
        subtitle="Manage system administrators and their permissions"
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
              Add Administrator
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
                  <p className="text-sm text-gray-600">Total Administrators</p>
                  <p className="text-2xl font-bold">{stats.totalAdmins}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Super Admins</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.superAdmins}</p>
                </div>
                <Crown className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">School Admins</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.schoolAdmins}</p>
                </div>
                <User className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-green-600">{stats.activeAdmins}</p>
                </div>
                <Shield className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Administrators List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <CardTitle>Administrators Directory</CardTitle>
                <span className="text-sm text-gray-500">{filteredAdministrators.length} administrators</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search administrators..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Roles</option>
                <option value="super_admin">Super Admin</option>
                <option value="school_admin">School Admin</option>
              </select>

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

            {/* Administrators Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Administrator</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>School</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Loading administrators...
                      </TableCell>
                    </TableRow>
                  ) : filteredAdministrators.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No administrators found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAdministrators.map((admin) => {
                      const RoleIcon = getRoleIcon(admin.role)
                      return (
                        <TableRow key={admin.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                  {admin.first_name.charAt(0)}{admin.last_name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium">
                                  {admin.first_name} {admin.last_name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  ID: {admin.id.substring(0, 8)}...
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-1">
                                <Mail className="w-3 h-3 text-gray-400" />
                                <span className="text-sm">{admin.email}</span>
                              </div>
                              {admin.phone && (
                                <div className="flex items-center space-x-1">
                                  <Phone className="w-3 h-3 text-gray-400" />
                                  <span className="text-sm">{admin.phone}</span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <RoleIcon className="w-4 h-4" />
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(admin.role)}`}>
                                {admin.role === 'super_admin' ? 'Super Admin' : 'School Admin'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {admin.schools ? (
                              <div className="flex items-center space-x-1">
                                <School className="w-3 h-3 text-gray-400" />
                                <span className="text-sm">{admin.schools.name}</span>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">All Schools</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(admin.is_active ? 'active' : 'inactive')}`}>
                              {admin.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm" title="View Details">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" title="Edit Administrator">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" title="Permissions">
                                <Shield className="w-4 h-4" />
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
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Crown className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Add Super Admin</h3>
                  <p className="text-sm text-gray-600">Create new super administrator</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Add School Admin</h3>
                  <p className="text-sm text-gray-600">Create school administrator</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Manage Permissions</h3>
                  <p className="text-sm text-gray-600">Configure user permissions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
