'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Calendar,
  Clock,
  Plus,
  Download,
  Filter,
  Search
} from 'lucide-react'
import { getData } from '@/lib/api'

export default function TimetablePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [timetableData, setTimetableData] = useState([])

  useEffect(() => {
    fetchTimetableData()
  }, [])

  const fetchTimetableData = async () => {
    try {
      setIsLoading(true)
      console.log('Fetching timetable data...')
      // TODO: Implement timetable API endpoint
      setTimetableData([])
    } catch (error) {
      console.error('Error fetching timetable:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6">
      <Header
        title="Timetable Management"
        subtitle="Manage class schedules and timetables"
        actions={
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Schedule
            </Button>
          </div>
        }
      />

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Class Timetable</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading timetable...</div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No timetable data available. This feature is under development.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
