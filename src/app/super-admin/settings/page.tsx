'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Settings,
  Globe,
  Database,
  Shield,
  Mail,
  Bell,
  Palette,
  Key,
  Server,
  Save,
  RefreshCw,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Activity
} from 'lucide-react'

export default function SuperAdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('system')
  const [isSaving, setIsSaving] = useState(false)

  const tabs = [
    { id: 'system', label: 'System Settings', icon: Settings },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'email', label: 'Email Config', icon: Mail },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ]

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    alert('Settings saved successfully!')
  }

  return (
    <div className="p-6">
      <Header
        title="System Settings"
        subtitle="Configure system-wide settings and preferences"
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

            {/* System Status */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-sm">System Status</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Database</span>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-green-600">Online</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">API</span>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-green-600">Healthy</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Storage</span>
                    <div className="flex items-center space-x-1">
                      <Activity className="w-3 h-3 text-yellow-500" />
                      <span className="text-xs text-yellow-600">78% Used</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings Content */}
          <div className="flex-1">
            {activeTab === 'system' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="w-5 h-5" />
                    <span>System Configuration</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        System Name
                      </label>
                      <Input defaultValue="SchoolNexus Management System" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        System Version
                      </label>
                      <Input defaultValue="v1.0.0" disabled />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      System Description
                    </label>
                    <textarea 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={3}
                      defaultValue="Complete multi-school management system with PWA capabilities"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default Currency
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                        <option value="UGX">UGX - Ugandan Shilling</option>
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default Timezone
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                        <option value="Africa/Kampala">Africa/Kampala (EAT)</option>
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">America/New_York</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">System Limits</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Max Schools
                        </label>
                        <Input type="number" defaultValue="100" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Max Students per School
                        </label>
                        <Input type="number" defaultValue="1000" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Max Teachers per School
                        </label>
                        <Input type="number" defaultValue="100" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={isSaving}>
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'database' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="w-5 h-5" />
                    <span>Database Management</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-4">Database Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Database Type:</span>
                        <span className="font-medium">PostgreSQL</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Version:</span>
                        <span className="font-medium">14.9</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Size:</span>
                        <span className="font-medium">245 MB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Backup:</span>
                        <span className="font-medium">2 hours ago</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">Database Operations</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button variant="outline" className="justify-start">
                        <Download className="w-4 h-4 mr-2" />
                        Create Backup
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Upload className="w-4 h-4 mr-2" />
                        Restore Backup
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Optimize Database
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Activity className="w-4 h-4 mr-2" />
                        View Statistics
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">Backup Schedule</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Daily Backups</p>
                          <p className="text-sm text-gray-600">Automatic daily backups at 2:00 AM</p>
                        </div>
                        <input type="checkbox" className="toggle" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Weekly Full Backup</p>
                          <p className="text-sm text-gray-600">Full backup every Sunday</p>
                        </div>
                        <input type="checkbox" className="toggle" defaultChecked />
                      </div>
                    </div>
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
                    <h4 className="font-medium mb-4">Authentication Settings</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Require Strong Passwords</p>
                          <p className="text-sm text-gray-600">Enforce minimum 8 characters with special characters</p>
                        </div>
                        <input type="checkbox" className="toggle" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Two-Factor Authentication</p>
                          <p className="text-sm text-gray-600">Require 2FA for admin accounts</p>
                        </div>
                        <input type="checkbox" className="toggle" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Session Timeout</p>
                          <p className="text-sm text-gray-600">Auto logout after inactivity</p>
                        </div>
                        <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                          <option value="30">30 minutes</option>
                          <option value="60">1 hour</option>
                          <option value="120">2 hours</option>
                          <option value="480">8 hours</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">API Security</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          API Rate Limit (requests per minute)
                        </label>
                        <Input type="number" defaultValue="100" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Enable API Logging</p>
                          <p className="text-sm text-gray-600">Log all API requests for security monitoring</p>
                        </div>
                        <input type="checkbox" className="toggle" defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">Security Monitoring</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="font-medium">SSL Certificate</span>
                        </div>
                        <p className="text-sm text-gray-600">Valid until Dec 2024</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="font-medium">Firewall Status</span>
                        </div>
                        <p className="text-sm text-gray-600">Active and configured</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={isSaving}>
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? 'Saving...' : 'Save Security Settings'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'email' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mail className="w-5 h-5" />
                    <span>Email Configuration</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-4">SMTP Settings</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          SMTP Host
                        </label>
                        <Input placeholder="smtp.gmail.com" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          SMTP Port
                        </label>
                        <Input type="number" defaultValue="587" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Username
                        </label>
                        <Input placeholder="your-email@gmail.com" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password
                        </label>
                        <Input type="password" placeholder="App password" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">Email Templates</h4>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Mail className="w-4 h-4 mr-2" />
                        Welcome Email Template
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Mail className="w-4 h-4 mr-2" />
                        Password Reset Template
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Mail className="w-4 h-4 mr-2" />
                        Subscription Expiry Template
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Button variant="outline">
                      <Mail className="w-4 h-4 mr-2" />
                      Test Email
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? 'Saving...' : 'Save Email Settings'}
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
                  <div>
                    <h4 className="font-medium mb-4">System Notifications</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">New School Registration</p>
                          <p className="text-sm text-gray-600">Notify when a new school registers</p>
                        </div>
                        <input type="checkbox" className="toggle" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Subscription Expiry</p>
                          <p className="text-sm text-gray-600">Notify 30 days before expiry</p>
                        </div>
                        <input type="checkbox" className="toggle" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">System Errors</p>
                          <p className="text-sm text-gray-600">Notify on critical system errors</p>
                        </div>
                        <input type="checkbox" className="toggle" defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">Notification Recipients</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Primary Admin Email
                        </label>
                        <Input defaultValue="admin@schoolnexus.com" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Secondary Admin Email
                        </label>
                        <Input placeholder="secondary@schoolnexus.com" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={isSaving}>
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? 'Saving...' : 'Save Notification Settings'}
                    </Button>
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
                    <h4 className="font-medium mb-4">System Theme</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="border-2 border-primary rounded-lg p-3 cursor-pointer">
                        <div className="w-full h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded mb-2"></div>
                        <p className="text-sm text-center">Default Purple</p>
                      </div>
                      <div className="border rounded-lg p-3 cursor-pointer">
                        <div className="w-full h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded mb-2"></div>
                        <p className="text-sm text-center">Ocean Blue</p>
                      </div>
                      <div className="border rounded-lg p-3 cursor-pointer">
                        <div className="w-full h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded mb-2"></div>
                        <p className="text-sm text-center">Forest Green</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">Logo Settings</h4>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
                        <Globe className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <Button variant="outline">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload System Logo
                        </Button>
                        <p className="text-sm text-gray-600 mt-1">Recommended size: 64x64px</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">Display Settings</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Items per page
                        </label>
                        <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                          <option value="10">10</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Show System Branding</p>
                          <p className="text-sm text-gray-600">Display "Powered by SchoolNexus"</p>
                        </div>
                        <input type="checkbox" className="toggle" defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={isSaving}>
                      <Save className="w-4 h-4 mr-2" />
                      {isSaving ? 'Saving...' : 'Save Appearance Settings'}
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
