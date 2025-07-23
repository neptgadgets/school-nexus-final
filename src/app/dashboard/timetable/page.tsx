'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Calendar,
  Clock,
  Plus,
  Edit,
  Trash2,
  Download,
  BookOpen,
  User,
  MapPin,
  Copy,
  Shuffle
} from 'lucide-react'
import { getData } from '@/lib/api'
import { formatDate } from '@/lib/utils'

interface TimetableSlot {
  id: string
  day_of_week: number
  start_time: string
  end_time: string
  subject_id: string
  teacher_id: string
  class_id: string
  room?: string
  subjects: {
    name: string
    code: string
  }
  teachers: {
    first_name: string
    last_name: string
  }
  classes: {
    name: string
  }
}

export default function TimetablePage() {
  const [activeTab, setActiveTab] = useState('view')
  const [selectedClass, setSelectedClass] = useState('all')
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek())
  const [timetableData, setTimetableData] = useState<TimetableSlot[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [subjects, setSubjects] = useState<any[]>([])
  const [teachers, setTeachers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  

  const timeSlots = [
    { start: '08:00', end: '08:45', label: 'Period 1' },
    { start: '08:45', end: '09:30', label: 'Period 2' },
    { start: '09:30', end: '09:45', label: 'Break', isBreak: true },
    { start: '09:45', end: '10:30', label: 'Period 3' },
    { start: '10:30', end: '11:15', label: 'Period 4' },
    { start: '11:15', end: '12:00', label: 'Period 5' },
    { start: '12:00', end: '13:00', label: 'Lunch', isBreak: true },
    { start: '13:00', end: '13:45', label: 'Period 6' },
    { start: '13:45', end: '14:30', label: 'Period 7' },
    { start: '14:30', end: '15:15', label: 'Period 8' }
  ]

  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'
  ]

  function getCurrentWeek() {
    const today = new Date()
    const monday = new Date(today.setDate(today.getDate() - today.getDay() + 1))
    return monday.toISOString().split('T')[0]
  }

  useEffect(() => {
    fetchTimetableData()
    fetchClasses()
    fetchSubjects()
    fetchTeachers()
  }, [selectedClass, selectedWeek])

  const fetchTimetableData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data: admin } = await supabase
        .from('administrators')
        .select('school_id')
        .eq('user_id', session.user.id)
        .single()

      if (!admin?.school_id) return

      let query = supabase
        .from('timetable_slots')
        .select(`
          *,
          subjects (name, code),
          teachers (first_name, last_name),
          classes (name)
        `)
        .eq('subjects.school_id', admin.school_id)

      if (selectedClass !== 'all') {
        query = query.eq('class_id', selectedClass)
      }

      const { data, error } = await query.order('day_of_week').order('start_time')

      if (error) {
        console.error('Error fetching timetable:', error)
        return
      }

      setTimetableData(data || [])
    } catch (error) {
      console.error('Error fetching timetable:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchClasses = async () => {
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
        .from('classes')
        .select('id, name')
        .eq('school_id', admin.school_id)
        .eq('is_active', true)
        .order('name')

      if (!error && data) {
        setClasses(data)
      }
    } catch (error) {
      console.error('Error fetching classes:', error)
    }
  }

  const fetchSubjects = async () => {
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
        .from('subjects')
        .select('id, name, code')
        .eq('school_id', admin.school_id)
        .eq('is_active', true)
        .order('name')

      if (!error && data) {
        setSubjects(data)
      }
    } catch (error) {
      console.error('Error fetching subjects:', error)
    }
  }

  const fetchTeachers = async () => {
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
        .from('teachers')
        .select('id, first_name, last_name')
        .eq('school_id', admin.school_id)
        .eq('status', 'active')
        .order('first_name')

      if (!error && data) {
        setTeachers(data)
      }
    } catch (error) {
      console.error('Error fetching teachers:', error)
    }
  }

  const getTimetableSlot = (dayIndex: number, timeSlot: any) => {
    return timetableData.find(slot => 
      slot.day_of_week === dayIndex && 
      slot.start_time === timeSlot.start
    )
  }

  const getSubjectColor = (subjectId: string) => {
    const colors = [
      'bg-blue-100 text-blue-800 border-blue-200',
      'bg-green-100 text-green-800 border-green-200',
      'bg-purple-100 text-purple-800 border-purple-200',
      'bg-orange-100 text-orange-800 border-orange-200',
      'bg-pink-100 text-pink-800 border-pink-200',
      'bg-indigo-100 text-indigo-800 border-indigo-200',
      'bg-teal-100 text-teal-800 border-teal-200',
      'bg-red-100 text-red-800 border-red-200'
    ]
    const index = parseInt(subjectId.slice(-1)) % colors.length
    return colors[index]
  }

  return (
    <div className="p-6">
      <Header
        title="Timetable Management"
        subtitle="Manage class schedules and time slots"
        actions={
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline">
              <Copy className="w-4 h-4 mr-2" />
              Duplicate
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Slot
            </Button>
          </div>
        }
      />

      <div className="mt-6">
        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'view', label: 'View Timetable', icon: Calendar },
                { id: 'manage', label: 'Manage Slots', icon: Edit },
                { id: 'templates', label: 'Templates', icon: Copy }
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

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Classes</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Week Starting
            </label>
            <input
              type="date"
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {activeTab === 'view' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Weekly Timetable</span>
                {selectedClass !== 'all' && (
                  <span className="text-sm font-normal text-gray-500">
                    - {classes.find(c => c.id === selectedClass)?.name}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border border-gray-200 p-3 bg-gray-50 text-left font-medium text-gray-700 min-w-[120px]">
                        Time
                      </th>
                      {daysOfWeek.map((day) => (
                        <th key={day} className="border border-gray-200 p-3 bg-gray-50 text-center font-medium text-gray-700 min-w-[180px]">
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.map((timeSlot, timeIndex) => (
                      <tr key={timeIndex} className={timeSlot.isBreak ? 'bg-gray-50' : ''}>
                        <td className="border border-gray-200 p-3 font-medium text-gray-700">
                          <div className="text-sm">
                            <div className="font-medium">{timeSlot.label}</div>
                            <div className="text-gray-500 text-xs">
                              {timeSlot.start} - {timeSlot.end}
                            </div>
                          </div>
                        </td>
                        {daysOfWeek.map((day, dayIndex) => {
                          if (timeSlot.isBreak) {
                            return (
                              <td key={dayIndex} className="border border-gray-200 p-3 text-center text-gray-500 text-sm">
                                {timeSlot.label}
                              </td>
                            )
                          }

                          const slot = getTimetableSlot(dayIndex + 1, timeSlot)
                          
                          return (
                            <td key={dayIndex} className="border border-gray-200 p-2">
                              {slot ? (
                                <div className={`p-3 rounded-lg border-2 ${getSubjectColor(slot.subject_id)} hover:shadow-md transition-shadow cursor-pointer`}>
                                  <div className="font-medium text-sm mb-1">
                                    {slot.subjects.name}
                                  </div>
                                  <div className="text-xs flex items-center space-x-1 mb-1">
                                    <User className="w-3 h-3" />
                                    <span>{slot.teachers.first_name} {slot.teachers.last_name}</span>
                                  </div>
                                  {slot.room && (
                                    <div className="text-xs flex items-center space-x-1">
                                      <MapPin className="w-3 h-3" />
                                      <span>{slot.room}</span>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="p-3 border-2 border-dashed border-gray-200 rounded-lg text-center">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-gray-400 hover:text-gray-600"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </Button>
                                </div>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'manage' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Edit className="w-5 h-5" />
                  <span>Add/Edit Time Slot</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Day
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="">Select Day</option>
                      {daysOfWeek.map((day, index) => (
                        <option key={day} value={index + 1}>{day}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Class
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="">Select Class</option>
                      {classes.map((cls) => (
                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="">Select Subject</option>
                      {subjects.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                          {subject.name} ({subject.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teacher
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="">Select Teacher</option>
                      {teachers.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.first_name} {teacher.last_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Room 101, Lab A"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex space-x-2">
                  <Button className="flex-1">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Slot
                  </Button>
                  <Button variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Update
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shuffle className="w-5 h-5" />
                  <span>Bulk Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy from Another Class
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Shuffle className="w-4 h-4 mr-2" />
                    Generate Auto Schedule
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Export Timetable
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-red-600 border-red-200">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All Slots
                  </Button>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Quick Statistics</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Periods:</span>
                      <span className="font-medium">40/week</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Scheduled:</span>
                      <span className="font-medium text-green-600">32</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Free Slots:</span>
                      <span className="font-medium text-blue-600">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Conflicts:</span>
                      <span className="font-medium text-red-600">0</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'templates' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Copy className="w-5 h-5" />
                <span>Timetable Templates</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Primary Template</h3>
                        <p className="text-sm text-gray-600">Standard primary school schedule</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Secondary Template</h3>
                        <p className="text-sm text-gray-600">Secondary school schedule</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Plus className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Create New</h3>
                        <p className="text-sm text-gray-600">Create custom template</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
