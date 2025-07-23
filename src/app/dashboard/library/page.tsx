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
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Clock,
  User,
  Calendar,
  AlertCircle,
  CheckCircle,
  BarChart3
} from 'lucide-react'
import { getData } from '@/lib/api'
// Utility function for date formatting
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

interface Book {
  id: string
  title: string
  author: string
  isbn: string
  category: string
  total_copies: number
  available_copies: number
  publication_year: number
  location: string
  status: 'available' | 'maintenance' | 'lost'
}

interface BorrowRecord {
  id: string
  book_title: string
  student_name: string
  borrowed_date: string
  due_date: string
  return_date?: string
  status: 'borrowed' | 'returned' | 'overdue'
  fine_amount: number
}

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState('books')
  const [books, setBooks] = useState<Book[]>([])
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  

  useEffect(() => {
    fetchLibraryData()
  }, [])

  const fetchLibraryData = async () => {
    try {
      // Mock data for library system
      setBooks([
        {
          id: '1',
          title: 'Advanced Mathematics',
          author: 'John Smith',
          isbn: '978-0123456789',
          category: 'Mathematics',
          total_copies: 10,
          available_copies: 7,
          publication_year: 2023,
          location: 'Section A-1',
          status: 'available'
        },
        {
          id: '2',
          title: 'English Literature',
          author: 'Jane Doe',
          isbn: '978-0987654321',
          category: 'Literature',
          total_copies: 8,
          available_copies: 3,
          publication_year: 2022,
          location: 'Section B-2',
          status: 'available'
        },
        {
          id: '3',
          title: 'Physics Fundamentals',
          author: 'Dr. Wilson',
          isbn: '978-0456789123',
          category: 'Science',
          total_copies: 12,
          available_copies: 0,
          publication_year: 2023,
          location: 'Section C-1',
          status: 'available'
        }
      ])

      setBorrowRecords([
        {
          id: '1',
          book_title: 'Advanced Mathematics',
          student_name: 'Sarah Johnson',
          borrowed_date: '2024-01-15',
          due_date: '2024-01-29',
          status: 'borrowed',
          fine_amount: 0
        },
        {
          id: '2',
          book_title: 'English Literature',
          student_name: 'Michael Brown',
          borrowed_date: '2024-01-10',
          due_date: '2024-01-24',
          return_date: '2024-01-20',
          status: 'returned',
          fine_amount: 0
        },
        {
          id: '3',
          book_title: 'Physics Fundamentals',
          student_name: 'Emily Davis',
          borrowed_date: '2024-01-05',
          due_date: '2024-01-19',
          status: 'overdue',
          fine_amount: 5000
        }
      ])

    } catch (error) {
      console.error('Error fetching library data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getLibraryStats = () => {
    const totalBooks = books.reduce((sum, book) => sum + book.total_copies, 0)
    const availableBooks = books.reduce((sum, book) => sum + book.available_copies, 0)
    const borrowedBooks = totalBooks - availableBooks
    const overdueBooks = borrowRecords.filter(record => record.status === 'overdue').length
    const totalFines = borrowRecords.reduce((sum, record) => sum + record.fine_amount, 0)

    return { totalBooks, availableBooks, borrowedBooks, overdueBooks, totalFines }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800'
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800'
      case 'lost':
        return 'bg-red-100 text-red-800'
      case 'borrowed':
        return 'bg-blue-100 text-blue-800'
      case 'returned':
        return 'bg-green-100 text-green-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
      case 'returned':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'borrowed':
        return <Clock className="w-4 h-4 text-blue-600" />
      case 'overdue':
      case 'lost':
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const handleExportCSV = () => {
    if (activeTab === 'books') {
      const exportData = books.map(book => ({
        'Title': book.title,
        'Author': book.author,
        'ISBN': book.isbn,
        'Category': book.category,
        'Total Copies': book.total_copies,
        'Available Copies': book.available_copies,
        'Publication Year': book.publication_year,
        'Location': book.location,
        'Status': book.status
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
    } else {
      const exportData = borrowRecords.map(record => ({
        'Book Title': record.book_title,
        'Student Name': record.student_name,
        'Borrowed Date': formatDate(record.borrowed_date),
        'Due Date': formatDate(record.due_date),
        'Return Date': record.return_date ? formatDate(record.return_date) : 'Not Returned',
        'Status': record.status,
        'Fine Amount': record.fine_amount
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
  }

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.isbn.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = categoryFilter === 'all' || book.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || book.status === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  const filteredBorrowRecords = borrowRecords.filter(record => {
    const matchesSearch = record.book_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.student_name.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const stats = getLibraryStats()

  return (
    <div className="p-6">
      <Header
        title="Library Management"
        subtitle="Manage books, borrowing, and library resources"
        actions={
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Book
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
                  <p className="text-sm text-gray-600">Total Books</p>
                  <p className="text-2xl font-bold">{stats.totalBooks}</p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-green-600">{stats.availableBooks}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Borrowed</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.borrowedBooks}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Overdue</p>
                  <p className="text-2xl font-bold text-red-600">{stats.overdueBooks}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Fines</p>
                  <p className="text-2xl font-bold text-orange-600">UGX {stats.totalFines.toLocaleString()}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'books', label: 'Books Catalog', icon: BookOpen },
                { id: 'borrowing', label: 'Borrowing Records', icon: User },
                { id: 'analytics', label: 'Analytics', icon: BarChart3 }
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

        {activeTab === 'books' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>Books Catalog ({filteredBooks.length} books)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search books..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Categories</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Literature">Literature</option>
                  <option value="Science">Science</option>
                  <option value="History">History</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Status</option>
                  <option value="available">Available</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="lost">Lost</option>
                </select>

                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </div>

              {/* Books Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Book Details</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Availability</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          Loading books...
                        </TableCell>
                      </TableRow>
                    ) : filteredBooks.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          No books found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBooks.map((book) => (
                        <TableRow key={book.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium">{book.title}</p>
                                <p className="text-sm text-gray-500">by {book.author}</p>
                                <p className="text-xs text-gray-400">ISBN: {book.isbn}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                              {book.category}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <p className="font-medium">{book.available_copies}/{book.total_copies}</p>
                              <p className="text-gray-500">Available/Total</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{book.location}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(book.status)}
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(book.status)}`}>
                                {book.status}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm" title="View Details">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" title="Edit Book">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" title="Delete" className="text-red-600">
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
        )}

        {activeTab === 'borrowing' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Borrowing Records ({filteredBorrowRecords.length} records)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search by book or student..."
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
                  <option value="borrowed">Borrowed</option>
                  <option value="returned">Returned</option>
                  <option value="overdue">Overdue</option>
                </select>

                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </div>

              {/* Borrowing Records Table */}
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Book & Student</TableHead>
                      <TableHead>Borrowed Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Return Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Fine</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          Loading borrowing records...
                        </TableCell>
                      </TableRow>
                    ) : filteredBorrowRecords.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          No borrowing records found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBorrowRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{record.book_title}</p>
                              <p className="text-sm text-gray-500">{record.student_name}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{formatDate(record.borrowed_date)}</span>
                          </TableCell>
                          <TableCell>
                            <span className={`text-sm ${record.status === 'overdue' ? 'text-red-600 font-medium' : ''}`}>
                              {formatDate(record.due_date)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">
                              {record.return_date ? formatDate(record.return_date) : 'Not returned'}
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
                            <span className={`text-sm font-medium ${record.fine_amount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                              UGX {record.fine_amount.toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              {record.status === 'borrowed' && (
                                <Button variant="outline" size="sm" className="text-green-600">
                                  Return
                                </Button>
                              )}
                              <Button variant="ghost" size="sm" title="View Details">
                                <Eye className="w-4 h-4" />
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

        {activeTab === 'analytics' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Library Analytics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Library Analytics</h3>
                <p className="text-gray-500">
                  Detailed library usage analytics and reports will be displayed here
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
