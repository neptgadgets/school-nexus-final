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
  Bell,
  Plus,
  Search,
  Filter,
  Send,
  Users,
  Calendar,
  AlertCircle,
  CheckCircle,
  Info,
  MessageSquare,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabase-client'

interface Notification {
  id: string
  title: string
  message: string
  type: 'announcement' | 'alert' | 'reminder' | 'event'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  target_audience: 'all' | 'students' | 'teachers' | 'parents'
  scheduled_date: string
  created_date: string
  status: 'draft' | 'scheduled' | 'sent'
  read_count: number
  total_recipients: number
  author: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'announcement' as const,
    priority: 'medium' as const,
    target_audience: 'all' as const,
    scheduled_date: ''
  })
  const supabase = createSupabaseClient()

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    setIsLoading(true)
    try {
      // Mock data for demo - replace with real Supabase query
      const mockNotifications: Notification[] = [
        {
          id: '1',
          title: 'Parent-Teacher Conference Reminder',
          message: 'Dear parents, this is a reminder that parent-teacher conferences are scheduled for next week. Please check your assigned time slots.',
          type: 'reminder',
          priority: 'high',
          target_audience: 'parents',
          scheduled_date: '2024-01-25T09:00:00',
          created_date: '2024-01-20T14:30:00',
          status: 'sent',
          read_count: 145,
          total_recipients: 180,
          author: 'Admin User'
        },
        {
          id: '2',
          title: 'New Academic Term Starting',
          message: 'The new academic term will begin on February 1st, 2024. All students are expected to be present on the first day.',
          type: 'announcement',
          priority: 'medium',
          target_audience: 'all',
          scheduled_date: '2024-01-22T08:00:00',
          created_date: '2024-01-19T10:15:00',
          status: 'sent',
          read_count: 320,
          total_recipients: 450,
          author: 'Admin User'
        },
        {
          id: '3',
          title: 'System Maintenance Alert',
          message: 'The school management system will undergo maintenance on Saturday from 2 AM to 6 AM. Services may be temporarily unavailable.',
          type: 'alert',
          priority: 'urgent',
          target_audience: 'all',
          scheduled_date: '2024-01-23T18:00:00',
          created_date: '2024-01-22T16:45:00',
          status: 'scheduled',
          read_count: 0,
          total_recipients: 450,
          author: 'Admin User'
        },
        {
          id: '4',
          title: 'Sports Day Event',
          message: 'Annual sports day will be held on March 15th. Students are encouraged to participate in various sports activities.',
          type: 'event',
          priority: 'low',
          target_audience: 'students',
          scheduled_date: '2024-02-01T12:00:00',
          created_date: '2024-01-21T11:20:00',
          status: 'draft',
          read_count: 0,
          total_recipients: 280,
          author: 'Admin User'
        }
      ]
      setNotifications(mockNotifications)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
    setIsLoading(false)
  }

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesType = typeFilter === 'all' || notification.type === typeFilter
    const matchesStatus = statusFilter === 'all' || notification.status === statusFilter
    
    return matchesSearch && matchesType && matchesStatus
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'announcement': return 'bg-blue-100 text-blue-800'
      case 'alert': return 'bg-red-100 text-red-800'
      case 'reminder': return 'bg-yellow-100 text-yellow-800'
      case 'event': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800'
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'announcement': return <MessageSquare className="w-4 h-4" />
      case 'alert': return <AlertCircle className="w-4 h-4" />
      case 'reminder': return <Bell className="w-4 h-4" />
      case 'event': return <Calendar className="w-4 h-4" />
      default: return <Info className="w-4 h-4" />
    }
  }

  const getReadPercentage = (readCount: number, totalRecipients: number) => {
    return totalRecipients > 0 ? Math.round((readCount / totalRecipients) * 100) : 0
  }

  const handleCreateNotification = async () => {
    // Mock creation - replace with real Supabase insert
    const notification: Notification = {
      id: Date.now().toString(),
      ...newNotification,
      created_date: new Date().toISOString(),
      status: 'draft',
      read_count: 0,
      total_recipients: newNotification.target_audience === 'all' ? 450 : 
                       newNotification.target_audience === 'students' ? 280 :
                       newNotification.target_audience === 'teachers' ? 45 : 180,
      author: 'Admin User'
    }
    setNotifications([notification, ...notifications])
    setShowCreateDialog(false)
    setNewNotification({
      title: '',
      message: '',
      type: 'announcement',
      priority: 'medium',
      target_audience: 'all',
      scheduled_date: ''
    })
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Header
        title="Notifications"
        subtitle="Create and manage school-wide notifications and announcements"
        actions={
          <Button onClick={() => setShowCreateDialog(true)} className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Create Notification</span>
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Notifications</p>
                <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Send className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Sent</p>
                <p className="text-2xl font-bold text-gray-900">
                  {notifications.filter(n => n.status === 'sent').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-gray-900">
                  {notifications.filter(n => n.status === 'scheduled').length}
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
                <p className="text-sm font-medium text-gray-600">Avg Read Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(notifications.reduce((sum, n) => sum + getReadPercentage(n.read_count, n.total_recipients), 0) / notifications.length) || 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Types</option>
                <option value="announcement">Announcement</option>
                <option value="alert">Alert</option>
                <option value="reminder">Reminder</option>
                <option value="event">Event</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="sent">Sent</option>
                <option value="scheduled">Scheduled</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
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
          {filteredNotifications.map((notification) => (
            <Card key={notification.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex items-center space-x-1">
                        {getTypeIcon(notification.type)}
                        <CardTitle className="text-lg">{notification.title}</CardTitle>
                      </div>
                      <Badge className={getTypeColor(notification.type)}>
                        {notification.type}
                      </Badge>
                      <Badge className={getPriorityColor(notification.priority)}>
                        {notification.priority}
                      </Badge>
                      <Badge className={getStatusColor(notification.status)}>
                        {notification.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{notification.message}</p>
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>Target: {notification.target_audience}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Scheduled: {new Date(notification.scheduled_date).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="w-4 h-4" />
                        <span>Author: {notification.author}</span>
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
                      <p className="text-sm font-medium text-gray-600">Recipients</p>
                      <p className="text-lg font-semibold text-gray-900">{notification.total_recipients}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Read</p>
                      <p className="text-lg font-semibold text-gray-900">{notification.read_count}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Read Rate</p>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${getReadPercentage(notification.read_count, notification.total_recipients)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">
                          {getReadPercentage(notification.read_count, notification.total_recipients)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {notification.status === 'draft' && (
                      <Button size="sm">
                        <Send className="w-4 h-4 mr-1" />
                        Send Now
                      </Button>
                    )}
                    {notification.status === 'scheduled' && (
                      <Button size="sm" variant="outline">
                        <Calendar className="w-4 h-4 mr-1" />
                        Reschedule
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredNotifications.length === 0 && !isLoading && (
        <Card>
          <CardContent className="p-12 text-center">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery ? 'Try adjusting your search terms.' : 'Create your first notification to get started.'}
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Notification
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Notification Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Notification</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <Input
                value={newNotification.title}
                onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                placeholder="Notification title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <Textarea
                value={newNotification.message}
                onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                placeholder="Notification message"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={newNotification.type}
                  onChange={(e) => setNewNotification({...newNotification, type: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="announcement">Announcement</option>
                  <option value="alert">Alert</option>
                  <option value="reminder">Reminder</option>
                  <option value="event">Event</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={newNotification.priority}
                  onChange={(e) => setNewNotification({...newNotification, priority: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                <select
                  value={newNotification.target_audience}
                  onChange={(e) => setNewNotification({...newNotification, target_audience: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Users</option>
                  <option value="students">Students Only</option>
                  <option value="teachers">Teachers Only</option>
                  <option value="parents">Parents Only</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Schedule Date</label>
                <Input
                  type="datetime-local"
                  value={newNotification.scheduled_date}
                  onChange={(e) => setNewNotification({...newNotification, scheduled_date: e.target.value})}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateNotification}>
                Create Notification
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
