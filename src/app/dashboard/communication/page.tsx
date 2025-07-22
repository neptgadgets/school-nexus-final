'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  MessageSquare,
  Send,
  Plus,
  Search,
  Filter,
  Users,
  User,
  Phone,
  Mail,
  Bell,
  Calendar,
  FileText,
  Paperclip,
  Star,
  Archive,
  Trash2,
  Eye
} from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'

interface Message {
  id: string
  sender_name: string
  sender_type: 'teacher' | 'parent' | 'student' | 'admin'
  recipient_name: string
  recipient_type: 'teacher' | 'parent' | 'student' | 'admin'
  subject: string
  message: string
  sent_date: string
  is_read: boolean
  is_starred: boolean
  has_attachment: boolean
  priority: 'low' | 'normal' | 'high'
}

interface Announcement {
  id: string
  title: string
  content: string
  target_audience: 'all' | 'teachers' | 'parents' | 'students'
  created_date: string
  is_urgent: boolean
  created_by: string
}

export default function CommunicationPage() {
  const [activeTab, setActiveTab] = useState('inbox')
  const [messages, setMessages] = useState<Message[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [showComposeModal, setShowComposeModal] = useState(false)
  const supabase = createSupabaseClient()

  useEffect(() => {
    fetchCommunicationData()
  }, [])

  const fetchCommunicationData = async () => {
    try {
      // Mock data for communication system
      setMessages([
        {
          id: '1',
          sender_name: 'John Smith (Parent)',
          sender_type: 'parent',
          recipient_name: 'School Admin',
          recipient_type: 'admin',
          subject: 'Request for Leave',
          message: 'I would like to request a leave for my child Sarah from Jan 25-27 due to family emergency.',
          sent_date: '2024-01-20T10:30:00Z',
          is_read: false,
          is_starred: false,
          has_attachment: false,
          priority: 'normal'
        },
        {
          id: '2',
          sender_name: 'Ms. Johnson (Teacher)',
          sender_type: 'teacher',
          recipient_name: 'School Admin',
          recipient_type: 'admin',
          subject: 'Parent-Teacher Meeting Schedule',
          message: 'Please approve the parent-teacher meeting schedule for next week.',
          sent_date: '2024-01-19T14:15:00Z',
          is_read: true,
          is_starred: true,
          has_attachment: true,
          priority: 'high'
        },
        {
          id: '3',
          sender_name: 'Michael Brown (Student)',
          sender_type: 'student',
          recipient_name: 'School Admin',
          recipient_type: 'admin',
          subject: 'Library Book Extension',
          message: 'I would like to extend the borrowing period for "Advanced Mathematics" book.',
          sent_date: '2024-01-18T09:45:00Z',
          is_read: true,
          is_starred: false,
          has_attachment: false,
          priority: 'low'
        }
      ])

      setAnnouncements([
        {
          id: '1',
          title: 'School Closure Notice',
          content: 'The school will be closed on January 26th due to national holiday.',
          target_audience: 'all',
          created_date: '2024-01-20T08:00:00Z',
          is_urgent: true,
          created_by: 'School Admin'
        },
        {
          id: '2',
          title: 'Parent-Teacher Meeting',
          content: 'Parent-teacher meetings will be held from February 1-5. Please schedule your appointments.',
          target_audience: 'parents',
          created_date: '2024-01-19T16:30:00Z',
          is_urgent: false,
          created_by: 'School Admin'
        },
        {
          id: '3',
          title: 'Sports Day Registration',
          content: 'Registration for annual sports day is now open. Please register by January 30th.',
          target_audience: 'students',
          created_date: '2024-01-18T12:00:00Z',
          is_urgent: false,
          created_by: 'Sports Coordinator'
        }
      ])

    } catch (error) {
      console.error('Error fetching communication data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getCommunicationStats = () => {
    const totalMessages = messages.length
    const unreadMessages = messages.filter(msg => !msg.is_read).length
    const starredMessages = messages.filter(msg => msg.is_starred).length
    const highPriorityMessages = messages.filter(msg => msg.priority === 'high').length
    const totalAnnouncements = announcements.length
    const urgentAnnouncements = announcements.filter(ann => ann.is_urgent).length

    return { totalMessages, unreadMessages, starredMessages, highPriorityMessages, totalAnnouncements, urgentAnnouncements }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600'
      case 'normal':
        return 'text-blue-600'
      case 'low':
        return 'text-gray-600'
      default:
        return 'text-gray-600'
    }
  }

  const getSenderTypeIcon = (type: string) => {
    switch (type) {
      case 'teacher':
        return <User className="w-4 h-4 text-blue-600" />
      case 'parent':
        return <Users className="w-4 h-4 text-green-600" />
      case 'student':
        return <User className="w-4 h-4 text-purple-600" />
      case 'admin':
        return <User className="w-4 h-4 text-orange-600" />
      default:
        return <User className="w-4 h-4 text-gray-600" />
    }
  }

  const getAudienceColor = (audience: string) => {
    switch (audience) {
      case 'all':
        return 'bg-blue-100 text-blue-800'
      case 'teachers':
        return 'bg-green-100 text-green-800'
      case 'parents':
        return 'bg-purple-100 text-purple-800'
      case 'students':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.sender_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.message.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'unread' && !message.is_read) ||
                         (filterType === 'starred' && message.is_starred) ||
                         (filterType === 'high_priority' && message.priority === 'high')

    return matchesSearch && matchesFilter
  })

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  const stats = getCommunicationStats()

  return (
    <div className="p-6">
      <Header
        title="Communication Center"
        subtitle="Manage messages, announcements, and notifications"
        actions={
          <div className="flex space-x-2">
            <Button variant="outline">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </Button>
            <Button onClick={() => setShowComposeModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Compose
            </Button>
          </div>
        }
      />

      <div className="mt-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Messages</p>
                  <p className="text-2xl font-bold">{stats.totalMessages}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Unread</p>
                  <p className="text-2xl font-bold text-red-600">{stats.unreadMessages}</p>
                </div>
                <Mail className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Starred</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.starredMessages}</p>
                </div>
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">High Priority</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.highPriorityMessages}</p>
                </div>
                <Bell className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Announcements</p>
                  <p className="text-2xl font-bold text-green-600">{stats.totalAnnouncements}</p>
                </div>
                <FileText className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Urgent</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.urgentAnnouncements}</p>
                </div>
                <Bell className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'inbox', label: 'Inbox', icon: MessageSquare },
                { id: 'sent', label: 'Sent', icon: Send },
                { id: 'announcements', label: 'Announcements', icon: FileText },
                { id: 'contacts', label: 'Contacts', icon: Users }
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

        {(activeTab === 'inbox' || activeTab === 'sent') && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Messages List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <MessageSquare className="w-5 h-5" />
                      <span>{activeTab === 'inbox' ? 'Inbox' : 'Sent'} ({filteredMessages.length})</span>
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Search and Filter */}
                  <div className="space-y-4 mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search messages..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="all">All Messages</option>
                      <option value="unread">Unread</option>
                      <option value="starred">Starred</option>
                      <option value="high_priority">High Priority</option>
                    </select>
                  </div>

                  {/* Messages List */}
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredMessages.map((message) => (
                      <div
                        key={message.id}
                        onClick={() => setSelectedMessage(message)}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedMessage?.id === message.id
                            ? 'border-primary bg-primary/5'
                            : 'hover:border-gray-300 hover:bg-gray-50'
                        } ${!message.is_read ? 'bg-blue-50 border-blue-200' : ''}`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            {getSenderTypeIcon(message.sender_type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className={`text-sm truncate ${!message.is_read ? 'font-semibold' : ''}`}>
                                {message.sender_name}
                              </p>
                              <div className="flex items-center space-x-1">
                                {message.is_starred && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
                                {message.has_attachment && <Paperclip className="w-3 h-3 text-gray-400" />}
                                <span className={`text-xs ${getPriorityColor(message.priority)}`}>●</span>
                              </div>
                            </div>
                            <p className={`text-sm truncate ${!message.is_read ? 'font-medium' : 'text-gray-600'}`}>
                              {message.subject}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{message.message}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(message.sent_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Message Content */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  {selectedMessage ? (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {getSenderTypeIcon(selectedMessage.sender_type)}
                          <div>
                            <h3 className="font-semibold">{selectedMessage.subject}</h3>
                            <p className="text-sm text-gray-600">
                              From: {selectedMessage.sender_name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Star className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Archive className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                          <span>
                            Sent: {new Date(selectedMessage.sent_date).toLocaleString()}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            selectedMessage.priority === 'high' ? 'bg-red-100 text-red-800' :
                            selectedMessage.priority === 'normal' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {selectedMessage.priority} priority
                          </span>
                        </div>
                        
                        <div className="prose max-w-none">
                          <p className="text-gray-800 leading-relaxed">
                            {selectedMessage.message}
                          </p>
                        </div>

                        {selectedMessage.has_attachment && (
                          <div className="mt-4 p-3 border border-gray-200 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <Paperclip className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">attachment.pdf</span>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )}

                        <div className="mt-6 flex space-x-2">
                          <Button>
                            <Send className="w-4 h-4 mr-2" />
                            Reply
                          </Button>
                          <Button variant="outline">
                            Forward
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">Select a message</h3>
                      <p className="text-gray-500">Choose a message from the list to view its content</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'announcements' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Announcements ({filteredAnnouncements.length})</span>
                </CardTitle>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Announcement
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search announcements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Announcements List */}
              <div className="space-y-4">
                {filteredAnnouncements.map((announcement) => (
                  <div key={announcement.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold">{announcement.title}</h3>
                          {announcement.is_urgent && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                              Urgent
                            </span>
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAudienceColor(announcement.target_audience)}`}>
                            {announcement.target_audience}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{announcement.content}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>By: {announcement.created_by}</span>
                          <span>{new Date(announcement.created_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'contacts' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Contacts Directory</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Contacts Directory</h3>
                <p className="text-gray-500">
                  School contacts and directory will be displayed here
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
