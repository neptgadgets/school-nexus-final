import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { query } from './database'

export interface User {
  id: string
  email: string
  role: 'super_admin' | 'school_admin' | 'teacher' | 'student' | 'parent'
  first_name: string
  last_name: string
  school_id?: string
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export interface AuthResult {
  success: boolean
  user?: User
  token?: string
  error?: string
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-replace-in-production'

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

export function generateToken(user: User): string {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
      schoolId: user.school_id
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  )
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export async function authenticateUser(email: string, password: string): Promise<AuthResult> {
  try {
    // Check in users table first (for general authentication)
    let userQuery = `
      SELECT id, email, password_hash, role, first_name, last_name, school_id, is_active, created_at, updated_at
      FROM users 
      WHERE email = $1 AND is_active = true
    `
    
    let result = await query(userQuery, [email])
    
    if (result.rows.length === 0) {
      // Check in specific role tables for backwards compatibility
      const roleQueries = [
        'SELECT id, email, \'super_admin\' as role, first_name, last_name, NULL as school_id, is_active FROM administrators WHERE email = $1 AND role = \'super_admin\' AND is_active = true',
        'SELECT id, email, \'school_admin\' as role, first_name, last_name, school_id, is_active FROM administrators WHERE email = $1 AND role = \'school_admin\' AND is_active = true',
        'SELECT id, email, \'teacher\' as role, first_name, last_name, school_id, true as is_active FROM teachers WHERE email = $1 AND status = \'active\'',
        'SELECT id, email, \'student\' as role, first_name, last_name, school_id, true as is_active FROM students WHERE email = $1 AND status = \'active\'',
        'SELECT id, email, \'parent\' as role, first_name, last_name, NULL as school_id, true as is_active FROM parents WHERE email = $1'
      ]
      
      for (const query_text of roleQueries) {
        const roleResult = await query(query_text, [email])
        if (roleResult.rows.length > 0) {
          const user = roleResult.rows[0]
          
          // For demo purposes, check if password is 'demo123'
          if (password === 'demo123') {
            const token = generateToken(user)
            return {
              success: true,
              user: {
                ...user,
                created_at: new Date(),
                updated_at: new Date()
              },
              token
            }
          }
        }
      }
      
      return {
        success: false,
        error: 'Invalid email or password'
      }
    }
    
    const user = result.rows[0]
    
    // Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash)
    
    if (!isValidPassword) {
      return {
        success: false,
        error: 'Invalid email or password'
      }
    }
    
    const token = generateToken(user)
    
    // Remove password_hash from user object
    delete user.password_hash
    
    return {
      success: true,
      user,
      token
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return {
      success: false,
      error: 'Authentication failed'
    }
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const result = await query(
      'SELECT id, email, role, first_name, last_name, school_id, is_active, created_at, updated_at FROM users WHERE id = $1',
      [id]
    )
    
    if (result.rows.length === 0) {
      return null
    }
    
    return result.rows[0]
  } catch (error) {
    console.error('Get user error:', error)
    return null
  }
}

export async function createUser(userData: {
  email: string
  password: string
  role: string
  first_name: string
  last_name: string
  school_id?: string
}): Promise<AuthResult> {
  try {
    // Check if user already exists
    const existingUser = await query('SELECT id FROM users WHERE email = $1', [userData.email])
    
    if (existingUser.rows.length > 0) {
      return {
        success: false,
        error: 'User already exists'
      }
    }
    
    // Hash password
    const password_hash = await hashPassword(userData.password)
    
    // Create user
    const result = await query(
      `INSERT INTO users (email, password_hash, role, first_name, last_name, school_id, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, true)
       RETURNING id, email, role, first_name, last_name, school_id, is_active, created_at, updated_at`,
      [userData.email, password_hash, userData.role, userData.first_name, userData.last_name, userData.school_id]
    )
    
    const user = result.rows[0]
    const token = generateToken(user)
    
    return {
      success: true,
      user,
      token
    }
  } catch (error) {
    console.error('Create user error:', error)
    return {
      success: false,
      error: 'Failed to create user'
    }
  }
}

export async function updatePassword(userId: string, newPassword: string): Promise<boolean> {
  try {
    const password_hash = await hashPassword(newPassword)
    await query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [password_hash, userId]
    )
    return true
  } catch (error) {
    console.error('Update password error:', error)
    return false
  }
}

export async function deactivateUser(userId: string): Promise<boolean> {
  try {
    await query(
      'UPDATE users SET is_active = false, updated_at = NOW() WHERE id = $1',
      [userId]
    )
    return true
  } catch (error) {
    console.error('Deactivate user error:', error)
    return false
  }
}
