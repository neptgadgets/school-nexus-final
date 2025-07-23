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
  DollarSign,
  CreditCard,
  TrendingUp,
  Calendar,
  Download,
  Search,
  Filter,
  Eye,
  Receipt,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'
import { getData, getCurrentUser } from '@/lib/api'
// Utility function for date formatting
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}
import { CustomLineChart, CustomBarChart } from '@/components/ui/chart'

interface BillingRecord {
  id: string
  school_name: string
  invoice_number: string
  amount: number
  billing_period: string
  due_date: string
  payment_date?: string
  status: 'paid' | 'pending' | 'overdue' | 'cancelled'
  payment_method?: string
  subscription_type: string
}

interface BillingStats {
  totalRevenue: number
  monthlyRevenue: number
  pendingPayments: number
  overduePayments: number
  totalInvoices: number
  paidInvoices: number
}

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [billingRecords, setBillingRecords] = useState<BillingRecord[]>([])
  const [stats, setStats] = useState<BillingStats>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    pendingPayments: 0,
    overduePayments: 0,
    totalInvoices: 0,
    paidInvoices: 0
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  

  useEffect(() => {
    fetchBillingData()
  }, [])

  const fetchBillingData = async () => {
    try {
      // Mock data for billing system
      const mockBillingRecords = [
        {
          id: '1',
          school_name: 'Greenwood High School',
          invoice_number: 'INV-2024-001',
          amount: 500000,
          billing_period: '2024-01',
          due_date: '2024-01-31',
          payment_date: '2024-01-25',
          status: 'paid' as const,
          payment_method: 'Bank Transfer',
          subscription_type: 'Premium'
        },
        {
          id: '2',
          school_name: 'Sunrise Academy',
          invoice_number: 'INV-2024-002',
          amount: 300000,
          billing_period: '2024-01',
          due_date: '2024-01-31',
          status: 'pending' as const,
          subscription_type: 'Standard'
        },
        {
          id: '3',
          school_name: 'Valley Primary School',
          invoice_number: 'INV-2024-003',
          amount: 200000,
          billing_period: '2024-01',
          due_date: '2024-01-15',
          status: 'overdue' as const,
          subscription_type: 'Basic'
        }
      ]

      setBillingRecords(mockBillingRecords)

      // Calculate stats
      const totalRevenue = mockBillingRecords
        .filter(record => record.status === 'paid')
        .reduce((sum, record) => sum + record.amount, 0)

      const pendingPayments = mockBillingRecords
        .filter(record => record.status === 'pending')
        .reduce((sum, record) => sum + record.amount, 0)

      const overduePayments = mockBillingRecords
        .filter(record => record.status === 'overdue')
        .reduce((sum, record) => sum + record.amount, 0)

      setStats({
        totalRevenue,
        monthlyRevenue: totalRevenue,
        pendingPayments,
        overduePayments,
        totalInvoices: mockBillingRecords.length,
        paidInvoices: mockBillingRecords.filter(record => record.status === 'paid').length
      })

    } catch (error) {
      console.error('Error fetching billing data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'overdue':
        return <AlertCircle className="w-4 h-4 text-red-600" />
      case 'cancelled':
        return <AlertCircle className="w-4 h-4 text-gray-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleExportCSV = () => {
    const exportData = billingRecords.map(record => ({
      'Invoice Number': record.invoice_number,
      'School Name': record.school_name,
      'Amount': record.amount,
      'Billing Period': record.billing_period,
      'Due Date': formatDate(record.due_date),
      'Payment Date': record.payment_date ? formatDate(record.payment_date) : 'Not Paid',
      'Status': record.status,
      'Payment Method': record.payment_method || 'N/A',
      'Subscription Type': record.subscription_type
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

  const filteredRecords = billingRecords.filter(record => {
    const matchesSearch = record.school_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.invoice_number.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Mock data for charts
  const revenueData = [
    { name: 'Jan', value: 2500000 },
    { name: 'Feb', value: 2800000 },
    { name: 'Mar', value: 3200000 },
    { name: 'Apr', value: 2900000 },
    { name: 'May', value: 3500000 },
    { name: 'Jun', value: 3800000 }
  ]

  const subscriptionData = [
    { name: 'Basic', value: 15 },
    { name: 'Standard', value: 25 },
    { name: 'Premium', value: 10 }
  ]

  return (
    <div className="p-6">
      <Header
        title="Billing Management"
        subtitle="Manage invoices, payments, and financial records"
        actions={
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button>
              <Receipt className="w-4 h-4 mr-2" />
              Generate Invoice
            </Button>
          </div>
        }
      />

      <div className="mt-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">UGX {stats.totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Payments</p>
                  <p className="text-2xl font-bold text-yellow-600">UGX {stats.pendingPayments.toLocaleString()}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Overdue Payments</p>
                  <p className="text-2xl font-bold text-red-600">UGX {stats.overduePayments.toLocaleString()}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Invoices</p>
                  <p className="text-2xl font-bold">{stats.totalInvoices}</p>
                </div>
                <Receipt className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: TrendingUp },
                { id: 'invoices', label: 'Invoices', icon: Receipt },
                { id: 'analytics', label: 'Analytics', icon: TrendingUp }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <CustomLineChart data={revenueData} height={300} color="#10b981" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subscription Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <CustomBarChart data={subscriptionData} height={300} color="#3b82f6" />
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'invoices' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Receipt className="w-5 h-5" />
                <span>Invoices ({filteredRecords.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search invoices..."
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
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="overdue">Overdue</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </div>

              {/* Invoices Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice Details</TableHead>
                      <TableHead>School</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          Loading billing records...
                        </TableCell>
                      </TableRow>
                    ) : filteredRecords.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          No billing records found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{record.invoice_number}</p>
                              <p className="text-sm text-gray-500">Period: {record.billing_period}</p>
                              <p className="text-xs text-gray-400">{record.subscription_type}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">{record.school_name}</span>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">UGX {record.amount.toLocaleString()}</span>
                          </TableCell>
                          <TableCell>
                            <span className={`text-sm ${record.status === 'overdue' ? 'text-red-600 font-medium' : ''}`}>
                              {formatDate(record.due_date)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(record.status)}
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                                {record.status}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm" title="View Invoice">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" title="Download PDF">
                                <Download className="w-4 h-4" />
                              </Button>
                              {record.status === 'pending' && (
                                <Button variant="outline" size="sm" className="text-green-600">
                                  Mark Paid
                                </Button>
                              )}
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
        )}

        {activeTab === 'analytics' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Billing Analytics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Advanced Billing Analytics</h3>
                <p className="text-gray-500">
                  Detailed billing analytics and financial insights will be displayed here
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
