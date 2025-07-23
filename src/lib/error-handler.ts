// Error types for better error handling
export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  PERMISSION_ERROR = 'PERMISSION_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface AppError {
  type: ErrorType
  message: string
  details?: any
  statusCode?: number
  timestamp: Date
}

export class CustomError extends Error {
  public type: ErrorType
  public statusCode: number
  public details?: any
  public timestamp: Date

  constructor(type: ErrorType, message: string, statusCode = 500, details?: any) {
    super(message)
    this.name = 'CustomError'
    this.type = type
    this.statusCode = statusCode
    this.details = details
    this.timestamp = new Date()
  }
}

// Error factory functions
export const createNetworkError = (message = 'Network connection failed') =>
  new CustomError(ErrorType.NETWORK_ERROR, message, 0)

export const createDatabaseError = (message = 'Database operation failed') =>
  new CustomError(ErrorType.DATABASE_ERROR, message, 500)

export const createAuthError = (message = 'Authentication failed') =>
  new CustomError(ErrorType.AUTHENTICATION_ERROR, message, 401)

export const createValidationError = (message = 'Validation failed', details?: any) =>
  new CustomError(ErrorType.VALIDATION_ERROR, message, 400, details)

export const createPermissionError = (message = 'Insufficient permissions') =>
  new CustomError(ErrorType.PERMISSION_ERROR, message, 403)

export const createNotFoundError = (message = 'Resource not found') =>
  new CustomError(ErrorType.NOT_FOUND_ERROR, message, 404)

// Error handler utility
export function handleError(error: unknown): AppError {
  if (error instanceof CustomError) {
    return {
      type: error.type,
      message: error.message,
      details: error.details,
      statusCode: error.statusCode,
      timestamp: error.timestamp
    }
  }

  if (error instanceof Error) {
    // Try to determine error type based on message
    if (error.message.includes('fetch')) {
      return {
        type: ErrorType.NETWORK_ERROR,
        message: 'Network request failed',
        details: error.message,
        statusCode: 0,
        timestamp: new Date()
      }
    }

    if (error.message.includes('database') || error.message.includes('connection')) {
      return {
        type: ErrorType.DATABASE_ERROR,
        message: 'Database operation failed',
        details: error.message,
        statusCode: 500,
        timestamp: new Date()
      }
    }

    if (error.message.includes('unauthorized') || error.message.includes('authentication')) {
      return {
        type: ErrorType.AUTHENTICATION_ERROR,
        message: 'Authentication failed',
        details: error.message,
        statusCode: 401,
        timestamp: new Date()
      }
    }

    return {
      type: ErrorType.UNKNOWN_ERROR,
      message: error.message,
      statusCode: 500,
      timestamp: new Date()
    }
  }

  return {
    type: ErrorType.UNKNOWN_ERROR,
    message: 'An unexpected error occurred',
    details: error,
    statusCode: 500,
    timestamp: new Date()
  }
}

// User-friendly error messages
export function getUserFriendlyMessage(error: AppError): string {
  switch (error.type) {
    case ErrorType.NETWORK_ERROR:
      return 'Please check your internet connection and try again.'
    case ErrorType.DATABASE_ERROR:
      return 'We\'re experiencing technical difficulties. Please try again later.'
    case ErrorType.AUTHENTICATION_ERROR:
      return 'Please log in to continue.'
    case ErrorType.VALIDATION_ERROR:
      return error.message || 'Please check your input and try again.'
    case ErrorType.PERMISSION_ERROR:
      return 'You don\'t have permission to perform this action.'
    case ErrorType.NOT_FOUND_ERROR:
      return 'The requested resource was not found.'
    case ErrorType.SERVER_ERROR:
      return 'Server error occurred. Please try again later.'
    default:
      return 'An unexpected error occurred. Please try again.'
  }
}

// Retry utility for failed operations
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: any

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error
      
      if (attempt === maxRetries) {
        throw error
      }

      // Don't retry on certain error types
      if (error instanceof CustomError) {
        if ([
          ErrorType.AUTHENTICATION_ERROR,
          ErrorType.PERMISSION_ERROR,
          ErrorType.VALIDATION_ERROR,
          ErrorType.NOT_FOUND_ERROR
        ].includes(error.type)) {
          throw error
        }
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt))
    }
  }

  throw lastError
}

// Safe async operation wrapper
export async function safeAsync<T>(
  operation: () => Promise<T>,
  fallback?: T
): Promise<{ data: T | null; error: AppError | null }> {
  try {
    const data = await operation()
    return { data, error: null }
  } catch (error) {
    const appError = handleError(error)
    return { data: fallback || null, error: appError }
  }
}

// Log error for monitoring
export function logError(error: AppError, context?: string) {
  const logData = {
    ...error,
    context,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
    url: typeof window !== 'undefined' ? window.location.href : 'server'
  }

  if (process.env.NODE_ENV === 'development') {
    console.error('Error logged:', logData)
  }

  // In production, you might want to send this to an error tracking service
  // like Sentry, LogRocket, or your own logging endpoint
}