// Input validation and sanitization utilities
import DOMPurify from 'dompurify'

export const validateInput = {
  // Email validation
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email) && email.length <= 254
  },

  // Password validation - minimum 12 characters with mixed case, numbers, special chars
  password: (password: string): boolean => {
    return (
      password.length >= 12 &&
      /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)
    )
  },

  // Username validation
  username: (username: string): boolean => {
    return /^[a-zA-Z0-9_-]{3,20}$/.test(username)
  },

  // Display name validation
  displayName: (name: string): boolean => {
    return name.length >= 1 && name.length <= 50 && !/<[^>]*>/.test(name)
  },

  // Sanitize HTML input
  sanitize: (input: string): string => {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: []
    })
  },

  // Sanitize HTML with allowed tags for rich text
  sanitizeRichText: (input: string): string => {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3'],
      ALLOWED_ATTR: []
    })
  },

  // Validate file upload
  fileUpload: (file: File, options: {
    maxSize?: number, // in bytes
    allowedTypes?: string[]
  } = {}): { valid: boolean; error?: string } => {
    const { maxSize = 5 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'image/webp'] } = options

    if (file.size > maxSize) {
      return { valid: false, error: `File size must be less than ${maxSize / 1024 / 1024}MB` }
    }

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: `File type must be one of: ${allowedTypes.join(', ')}` }
    }

    // Check for malicious file extensions
    const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.com']
    const fileName = file.name.toLowerCase()
    if (dangerousExtensions.some(ext => fileName.endsWith(ext))) {
      return { valid: false, error: 'File type not allowed' }
    }

    return { valid: true }
  }
}

// Rate limiting for authentication attempts
const authAttempts = new Map<string, { count: number; resetTime: number; }>()

export const checkRateLimit = (identifier: string, maxAttempts = 5, windowMs = 15 * 60 * 1000): boolean => {
  const now = Date.now()
  const attempts = authAttempts.get(identifier)

  if (!attempts || now > attempts.resetTime) {
    authAttempts.set(identifier, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (attempts.count >= maxAttempts) {
    return false // Rate limited
  }

  attempts.count++
  return true
}

// Session timeout management
const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes
let sessionTimer: number | null = null

export const resetSessionTimer = (onTimeout?: () => void) => {
  if (sessionTimer) {
    clearTimeout(sessionTimer)
  }

  sessionTimer = setTimeout(() => {
    if (onTimeout) {
      onTimeout()
    } else {
      // Default behavior: sign out user
      console.warn('Session timeout - user should be signed out')
    }
  }, SESSION_TIMEOUT)
}

export const clearSessionTimer = () => {
  if (sessionTimer) {
    clearTimeout(sessionTimer)
    sessionTimer = null
  }
}

// CSRF protection utilities
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

export const validateCSRFToken = (token: string, storedToken: string): boolean => {
  return token === storedToken && token.length === 64 // 32 bytes * 2 hex chars
}

// SQL injection protection (parameterized queries are handled by Supabase)
export const escapeSqlString = (str: string): string => {
  return str.replace(/'/g, "''")
}

// XSS protection (handled by DOMPurify above, but additional utilities)
export const escapeHtml = (str: string): string => {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  }

  return str.replace(/[&<>"'/]/g, (match) => htmlEscapes[match])
}
