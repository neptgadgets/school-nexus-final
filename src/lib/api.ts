// Client-side API utility functions to replace Supabase client calls

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('auth-token')
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  })
  
  if (response.status === 401) {
    // Token expired or invalid, redirect to login
    localStorage.removeItem('auth-token')
    localStorage.removeItem('user')
    window.location.href = '/auth/login'
    return
  }
  
  return response
}

export async function getData(endpoint: string) {
  try {
    const response = await fetchWithAuth(`/api${endpoint}`)
    if (!response) return { data: null, error: 'Authentication failed' }
    
    if (!response.ok) {
      const error = await response.json()
      return { data: null, error: error.message || 'Failed to fetch data' }
    }
    
    const data = await response.json()
    return { data, error: null }
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function postData(endpoint: string, body: any) {
  try {
    const response = await fetchWithAuth(`/api${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
    
    if (!response) return { data: null, error: 'Authentication failed' }
    
    if (!response.ok) {
      const error = await response.json()
      return { data: null, error: error.message || 'Failed to post data' }
    }
    
    const data = await response.json()
    return { data, error: null }
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function putData(endpoint: string, body: any) {
  try {
    const response = await fetchWithAuth(`/api${endpoint}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
    
    if (!response) return { data: null, error: 'Authentication failed' }
    
    if (!response.ok) {
      const error = await response.json()
      return { data: null, error: error.message || 'Failed to update data' }
    }
    
    const data = await response.json()
    return { data, error: null }
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function deleteData(endpoint: string) {
  try {
    const response = await fetchWithAuth(`/api${endpoint}`, {
      method: 'DELETE',
    })
    
    if (!response) return { data: null, error: 'Authentication failed' }
    
    if (!response.ok) {
      const error = await response.json()
      return { data: null, error: error.message || 'Failed to delete data' }
    }
    
    const data = await response.json()
    return { data, error: null }
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Helper function to get current user from localStorage
export function getCurrentUser() {
  if (typeof window === 'undefined') return null
  
  const userStr = localStorage.getItem('user')
  if (!userStr) return null
  
  try {
    return JSON.parse(userStr)
  } catch (error) {
    return null
  }
}

// Helper function to logout
export async function logout() {
  try {
    await fetch('/api/auth/logout', { method: 'POST' })
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    localStorage.removeItem('auth-token')
    localStorage.removeItem('user')
    window.location.href = '/auth/login'
  }
}
