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
  Plus,
  Download,
  FileText,
  Eye,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter
} from 'lucide-react'
import { getData } from '@/lib/api'
import { formatCurrency, formatDate, getStatusColor, exportToCSV } from '@/lib/utils'

interface FeeRecord {
  id: string
  total_amount: number
  paid_amount: number
  balance_amount: number
  due_date: string
  payment_status: 'pending' | 'partial' | 'paid' | 'overdue'
  created_at: string
  students?: {
    first_name: string
    last_name: string
    student_id: string
    class_id: string
  }
  fee_types?: {
    name: string
  }
  classes?: {
    name: string
  }
}

interface FeeStats {
  totalFees: number
  collectedFees: number
  pendingFees: number
  overdueAmount: number
}

export default function FeesPage() {
  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<FeeRecord[]>([])
  const [feeStats, setFeeStats] = useState<FeeStats>({
    totalFees: 0,
    collectedFees: 0,
    pendingFees: 0,
    overdueAmount: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('collect')
  

  useEffect(() => {
    fetchFeeRecords()
  }, [])

  useEffect(() => {
    filterRecords()
  }, [feeRecords, searchQuery, statusFilter])

  const fetchFeeRecords = async () => {
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
        .from('fee_records')
        .select(`
          *,
          students (
            first_name,
            last_name,
            student_id,
            class_id,
            classes (
              name
            )
          ),
          fee_types (
            name
          )
        `)
        .eq('school_id', admin.school_id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching fee records:', error)
        return
      }

      const records = data || []
      setFeeRecords(records)

      // Calculate stats
      const totalFees = records.reduce((sum, record) => sum + record.total_amount, 0)
      const collectedFees = records.reduce((sum, record) => sum + record.paid_amount, 0)
      const pendingFees = totalFees - collectedFees
      const overdueAmount = records
        .filter(record => record.payment_status === 'overdue')
        .reduce((sum, record) => sum + record.balance_amount, 0)

      setFeeStats({
        totalFees,
        collectedFees,
        pendingFees,
        overdueAmount
      })
    } catch (error) {
      console.error('Error fetching fee records:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterRecords = () => {
    let filtered = feeRecords

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(record =>
        record.students?.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.students?.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.students?.student_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.fee_types?.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(record => record.payment_status === statusFilter)
    }

    setFilteredRecords(filtered)
  }

  const handleExportCSV = () => {
    const exportData = filteredRecords.map(record => ({
      'Student': `${record.students?.first_name} ${record.students?.last_name}`,
      'Student ID': record.students?.student_id || '',
      'Class': record.students?.classes?.name || '',
      'Fee Type': record.fee_types?.name || '',
      'Total Amount': record.total_amount,
      'Paid Amount': record.paid_amount,
      'Balance': record.balance_amount,
      'Status': record.payment_status,
      'Due Date': formatDate(record.due_date),
    }))
    
    exportToCSV(exportData, 'fee-records')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'partial':
        return <Clock className="w-4 h-4 text-orange-600" />
      case 'overdue':
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const tabs = [
    { id: 'collect', label: 'Collect Fees', icon: DollarSign },
    { id: 'due', label: 'Due Fees', icon: AlertTriangle },
    { id: 'history', label: 'Payment History', icon: FileText },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'receipts', label: 'Receipts', icon: CreditCard },
    { id: 'types', label: 'Fee Types', icon: Plus },
  ]

  return (
    <div className="p-6">
      <Header
        title="Fees Management"
        subtitle="Manage school fees and payment collections"
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
              Add Fee Record
            </Button>
          </div>
        }
      />

      <div className="mt-6">
        {/* Fee Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-gradient-to-r from-gray-600 to-gray-700 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-200 text-sm">Total Fees</p>
                  <p className="text-2xl font-bold">{formatCurrency(feeStats.totalFees)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-gray-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Collected</p>
                  <p className="text-2xl font-bold">{formatCurrency(feeStats.collectedFees)}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Pending</p>
                  <p className="text-2xl font-bold">{formatCurrency(feeStats.pendingFees)}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Collect Fees Tab */}
        {activeTab === 'collect' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Collect Fees
                </CardTitle>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search fees..."
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
                    <option value="pending">Pending</option>
                    <option value="partial">Partial</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Fee Type</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Paid Amount</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8">
                          Loading fee records...
                        </TableCell>
                      </TableRow>
                    ) : filteredRecords.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                          No fee records found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {record.students?.first_name} {record.students?.last_name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {record.students?.student_id}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                              {record.students?.classes?.name || 'N/A'}
                            </span>
                          </TableCell>
                          <TableCell>{record.fee_types?.name}</TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(record.total_amount)}
                          </TableCell>
                          <TableCell className="text-green-600 font-medium">
                            {formatCurrency(record.paid_amount)}
                          </TableCell>
                          <TableCell className="text-orange-600 font-medium">
                            {formatCurrency(record.balance_amount)}
                          </TableCell>
                          <TableCell>{formatDate(record.due_date)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(record.payment_status)}
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.payment_status)}`}>
                                {record.payment_status}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <CreditCard className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <FileText className="w-4 h-4" />
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
        )}
      </div>
    </div>
  )
}
