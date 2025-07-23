'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Download } from 'lucide-react'
import { getData } from '@/lib/api'

export default function PagePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      console.log('Fetching page data...')
      // TODO: Implement page API endpoint
      setData([])
    } catch (error) {
      console.error('Error fetching page:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6">
      <Header
        title="Page Management"
        subtitle="Manage page data"
        actions={
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Page
            </Button>
          </div>
        }
      />

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Page List</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading page...</div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No page data available. This feature is under development.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
