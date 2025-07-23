'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Settings,
  School,
  User,
  Bell,
  Shield,
  Database,
  Palette,
  Mail,
  Phone,
  MapPin,
  Save,
  Upload,
  Key,
  Globe,
  Smartphone
} from 'lucide-react'
import { getData } from '@/lib/api'

interface SchoolSettings {
  id: string
  name: string
  address: string
  phone: string
  email: string
  logo_url?: string
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('school')
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  

  useEffect(() => {
    fetchSchoolSettings()
  }, [])

  const fetchSchoolSettings = async () => {
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
        .from('schools')
        .select('*')
        .eq('id', admin.school_id)
        .single()

      if (error) {
        console.error('Error fetching school settings:', error)
        return
      }

      setSchoolSettings(data)
    } catch (error) {
      console.error('Error fetching school settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSchoolSettings = async () => {
    if (!schoolSettings) return
    
    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('schools')
        .update({
          name: schoolSettings.name,
          address: schoolSettings.address,
          phone: schoolSettings.phone,
          email: schoolSettings.email,
          updated_at: new Date().toISOString()
        })
        .eq('id', schoolSettings.id)

      if (error) {
        console.error('Error updating school settings:', error)
        return
      }

      // Show success message
      alert('School settings updated successfully!')
    } catch (error) {
      console.error('Error saving school settings:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const tabs = [
    { id: 'school', label: 'School Info', icon: School },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'system', label: 'System', icon: Database },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ]

  return (
    <div className="p-6">
      <Header
        title="Settings"
        subtitle="Manage your school and system preferences"
      />

      <div className="mt-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Settings Navigation */}
          <div className="lg:w-64">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeTab === tab.id
                            ? 'bg-primary text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{tab.label}</span>
                      </button>
                    )
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Settings Content */}
          <div className="flex-1">
            {activeTab === 'school' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <School className="w-5 h-5" />
                    <span>School Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isLoading ? (
                    <div className="text-center py-8">Loading school settings...</div>
                  ) : (
                    <>
                      {/* School Logo */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          School Logo
                        </label>
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
                            <School className="w-8 h-8 text-white" />
                          </div>
                          <Button variant="outline">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Logo
                          </Button>
                        </div>
                      </div>

                      {/* School Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          School Name
                        </label>
                        <Input
                          value={schoolSettings?.name || ''}
                          onChange={(e) => setSchoolSettings(prev => prev ? {...prev, name: e.target.value} : null)}
                          placeholder="Enter school name"
                        />
                      </div>

                      {/* Address */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            value={schoolSettings?.address || ''}
                            onChange={(e) => setSchoolSettings(prev => prev ? {...prev, address: e.target.value} : null)}
                            placeholder="Enter school address"
                            className="pl-10"
                          />
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              value={schoolSettings?.phone || ''}
                              onChange={(e) => setSchoolSettings(prev => prev ? {...prev, phone: e.target.value} : null)}
                              placeholder="+256 700 000 000"
                              className="pl-10"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              type="email"
                              value={schoolSettings?.email || ''}
                              onChange={(e) => setSchoolSettings(prev => prev ? {...prev, email: e.target.value} : null)}
                              placeholder="admin@school.com"
                              className="pl-10"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Save Button */}
                      <div className="flex justify-end">
                        <Button onClick={handleSaveSchoolSettings} disabled={isSaving}>
                          <Save className="w-4 h-4 mr-2" />
                          {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === 'profile' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Profile Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-xl font-medium">S</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">School Administrator</h3>
                      <p className="text-sm text-gray-600">schooladmin@schoolnexus.com</p>
                    </div>
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Change Photo
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <Input placeholder="John" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <Input placeholder="Doe" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <Input type="email" value="schooladmin@schoolnexus.com" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <Input placeholder="+256 700 000 000" />
                  </div>

                  <div className="flex justify-end">
                    <Button>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'notifications' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="w-5 h-5" />
                    <span>Notification Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-sm text-gray-600">Receive notifications via email</p>
                      </div>
                      <input type="checkbox" className="toggle" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">SMS Notifications</h4>
                        <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                      </div>
                      <input type="checkbox" className="toggle" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Push Notifications</h4>
                        <p className="text-sm text-gray-600">Receive browser push notifications</p>
                      </div>
                      <input type="checkbox" className="toggle" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Fee Payment Alerts</h4>
                        <p className="text-sm text-gray-600">Get notified about fee payments</p>
                      </div>
                      <input type="checkbox" className="toggle" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Exam Reminders</h4>
                        <p className="text-sm text-gray-600">Get reminders about upcoming exams</p>
                      </div>
                      <input type="checkbox" className="toggle" defaultChecked />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button>
                      <Save className="w-4 h-4 mr-2" />
                      Save Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'security' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Security Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-4">Change Password</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input type="password" className="pl-10" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input type="password" className="pl-10" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input type="password" className="pl-10" />
                        </div>
                      </div>
                      <Button>Update Password</Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">Two-Factor Authentication</h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                      </div>
                      <Button variant="outline">Enable 2FA</Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">Active Sessions</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Globe className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-medium">Chrome on Windows</p>
                            <p className="text-sm text-gray-600">Current session • Kampala, Uganda</p>
                          </div>
                        </div>
                        <span className="text-sm text-green-600 font-medium">Active</span>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Smartphone className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-medium">Mobile App</p>
                            <p className="text-sm text-gray-600">2 hours ago • Kampala, Uganda</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Revoke</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'system' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="w-5 h-5" />
                    <span>System Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-4">Data Management</h4>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="w-4 h-4 mr-2" />
                        Export All Data
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Upload className="w-4 h-4 mr-2" />
                        Import Data
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Database className="w-4 h-4 mr-2" />
                        Backup Database
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">System Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Version:</span>
                        <span>SchoolNexus v1.0.0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Database:</span>
                        <span className="text-green-600">Connected</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Backup:</span>
                        <span>2 hours ago</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Storage Used:</span>
                        <span>245 MB</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">Maintenance</h4>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        Clear Cache
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Reset Settings
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'appearance' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Palette className="w-5 h-5" />
                    <span>Appearance Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-4">Theme</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="border-2 border-primary rounded-lg p-3 cursor-pointer">
                        <div className="w-full h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded mb-2"></div>
                        <p className="text-sm text-center">Default</p>
                      </div>
                      <div className="border rounded-lg p-3 cursor-pointer">
                        <div className="w-full h-16 bg-gradient-to-r from-gray-800 to-gray-900 rounded mb-2"></div>
                        <p className="text-sm text-center">Dark</p>
                      </div>
                      <div className="border rounded-lg p-3 cursor-pointer">
                        <div className="w-full h-16 bg-gradient-to-r from-white to-gray-100 rounded mb-2"></div>
                        <p className="text-sm text-center">Light</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">Language</h4>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                      <option>English</option>
                      <option>Luganda</option>
                      <option>Swahili</option>
                    </select>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">Date Format</h4>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                      <option>DD/MM/YYYY</option>
                      <option>MM/DD/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div className="flex justify-end">
                    <Button>
                      <Save className="w-4 h-4 mr-2" />
                      Save Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
