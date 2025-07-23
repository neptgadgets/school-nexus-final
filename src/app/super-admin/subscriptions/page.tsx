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
  CreditCard,
  Plus,
  Download,
  FileText,
  Eye,
  Edit,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  DollarSign,
  Calendar,
  School,
  Zap
} from 'lucide-react'
import { getData, getCurrentUser } from '@/lib/api'

// Utility functions
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

interface SchoolSubscription {
  id: string
  name: string
  email: string
  subscription_status: 'active' | 'expired' | 'trial'
  subscription_end_date?: string
  created_at: string
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<SchoolSubscription[]>([])
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<SchoolSubscription[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  useEffect(() => {
    filterSubscriptions()
  }, [subscriptions, searchQuery, statusFilter])

  const fetchSubscriptions = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await getData('/super-admin/schools?limit=100')

      if (error) {
        console.error('Error fetching subscriptions:', error)
        return
      }

      // Transform schools data to subscription format
      const subscriptionsData = data?.schools?.map((school: any) => ({
        id: school.id,
        name: school.name,
        email: school.email,
        subscription_status: school.subscription_plan ? 'active' : 'trial',
        subscription_end_date: null, // This would need to be added to the schema
        created_at: school.created_at
      })) || []

      setSubscriptions(subscriptionsData)
    } catch (error) {
      console.error('Error fetching subscriptions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterSubscriptions = () => {
    let filtered = subscriptions

    if (searchQuery) {
      filtered = filtered.filter(sub =>
        sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(sub => sub.subscription_status === statusFilter)
    }

    setFilteredSubscriptions(filtered)
  }

  const handleExportCSV = () => {
    const exportData = filteredSubscriptions.map(sub => ({
      'School Name': sub.name,
      'Email': sub.email,
      'Status': sub.subscription_status,
      'End Date': sub.subscription_end_date ? formatDate(sub.subscription_end_date) : 'N/A',
      'Created': formatDate(sub.created_at),
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

  const getSubscriptionStats = () => {
    const totalSubscriptions = subscriptions.length
    const activeSubscriptions = subscriptions.filter(s => s.subscription_status === 'active').length
    const trialSubscriptions = subscriptions.filter(s => s.subscription_status === 'trial').length
    const expiredSubscriptions = subscriptions.filter(s => s.subscription_status === 'expired').length

    // Calculate expiring soon (within 30 days)
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    
    const expiringSoon = subscriptions.filter(sub => {
      if (!sub.subscription_end_date) return false
      return new Date(sub.subscription_end_date) <= thirtyDaysFromNow && sub.subscription_status === 'active'
    }).length

    return { totalSubscriptions, activeSubscriptions, trialSubscriptions, expiredSubscriptions, expiringSoon }
  }

  const getSubscriptionStatusInfo = (subscription: SchoolSubscription) => {
    switch (subscription.subscription_status) {
      case 'active':
        return { 
          color: 'bg-green-100 text-green-800', 
          icon: CheckCircle, 
          label: 'Active',
          bgColor: 'bg-green-50 border-green-200'
        }
      case 'trial':
        return { 
          color: 'bg-blue-100 text-blue-800', 
          icon: Clock, 
          label: 'Trial',
          bgColor: 'bg-blue-50 border-blue-200'
        }
      case 'expired':
        return { 
          color: 'bg-red-100 text-red-800', 
          icon: AlertTriangle, 
          label: 'Expired',
          bgColor: 'bg-red-50 border-red-200'
        }
      default:
        return { 
          color: 'bg-gray-100 text-gray-800', 
          icon: AlertTriangle, 
          label: 'Unknown',
          bgColor: 'bg-gray-50 border-gray-200'
        }
    }
  }

  const isExpiringSoon = (endDate?: string) => {
    if (!endDate) return false
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    return new Date(endDate) <= thirtyDaysFromNow
  }

  const stats = getSubscriptionStats()

  return (
    <div className="p-6">
      <Header
        title="Subscriptions Management"
        subtitle="Manage school subscriptions and billing"
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
              New Subscription
            </Button>
          </div>
        }
      />

      <div className="mt-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold">{stats.totalSubscriptions}</p>
                </div>
                <CreditCard className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-green-600">{stats.activeSubscriptions}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Trial</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.trialSubscriptions}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Expired</p>
                  <p className="text-2xl font-bold text-red-600">{stats.expiredSubscriptions}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Expiring Soon</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.expiringSoon}</p>
                </div>
                <Zap className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Monthly Revenue</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.activeSubscriptions * 500000)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Annual Revenue</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.activeSubscriptions * 6000000)}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Avg. Per School</p>
                  <p className="text-2xl font-bold">{formatCurrency(500000)}</p>
                </div>
                <School className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subscriptions List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <CardTitle>Subscriptions</CardTitle>
                <span className="text-sm text-gray-500">{filteredSubscriptions.length} subscriptions</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search subscriptions..."
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
                <option value="trial">Trial</option>
                <option value="expired">Expired</option>
              </select>

              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>

            {/* Subscriptions Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>School</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Monthly Fee</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        Loading subscriptions...
                      </TableCell>
                    </TableRow>
                  ) : filteredSubscriptions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        No subscriptions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSubscriptions.map((subscription) => {
                      const statusInfo = getSubscriptionStatusInfo(subscription)
                      const StatusIcon = statusInfo.icon
                      const expiringSoon = isExpiringSoon(subscription.subscription_end_date)
                      
                      return (
                        <TableRow key={subscription.id} className={expiringSoon ? statusInfo.bgColor : ''}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <School className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium">{subscription.name}</p>
                                <p className="text-sm text-gray-500">{subscription.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <StatusIcon className="w-4 h-4" />
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                {statusInfo.label}
                              </span>
                              {expiringSoon && subscription.subscription_status === 'active' && (
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                  Expiring Soon
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {subscription.subscription_end_date ? (
                              <span className={expiringSoon ? 'text-orange-600 font-medium' : ''}>
                                {formatDate(subscription.subscription_end_date)}
                              </span>
                            ) : (
                              <span className="text-gray-500">No end date</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">{formatCurrency(500000)}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm" title="View Details">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" title="Edit Subscription">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" title="Billing">
                                <CreditCard className="w-4 h-4" />
                              </Button>
                              {subscription.subscription_status === 'expired' && (
                                <Button variant="ghost" size="sm" title="Renew" className="text-green-600">
                                  <Zap className="w-4 h-4" />
                                </Button>
                              )}
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
