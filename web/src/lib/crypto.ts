import CryptoJS from 'crypto-js'

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'dev-key-please-change-in-prod'

export function encrypt(data: any): string {
  const jsonString = JSON.stringify(data)
  return CryptoJS.AES.encrypt(jsonString, ENCRYPTION_KEY).toString()
}

export function decrypt<T>(encrypted: string): T {
  const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY)
  const jsonString = bytes.toString(CryptoJS.enc.Utf8)
  return JSON.parse(jsonString)
}

export function generateSalt(): string {
  return CryptoJS.lib.WordArray.random(128/8).toString()
}

export function hashPassword(password: string, salt: string): string {
  return CryptoJS.PBKDF2(password, salt, {
    keySize: 256/32,
    iterations: 10000
  }).toString()
}

// Production-grade encryption service
export const encryptionService = {
  // Encrypt sensitive data for local storage
  encryptData(data: any): string {
    const jsonString = JSON.stringify(data)
    return CryptoJS.AES.encrypt(jsonString, ENCRYPTION_KEY).toString()
  },

  // Decrypt sensitive data from local storage
  decryptData<T>(encrypted: string): T {
    const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY)
    const jsonString = bytes.toString(CryptoJS.enc.Utf8)
    return JSON.parse(jsonString)
  },

  // Encrypt user data (alias for encryptData)
  encryptUserData(data: any): string {
    return this.encryptData(data)
  },

  // Decrypt user data (alias for decryptData)
  decryptUserData<T>(encrypted: string): T {
    return this.decryptData<T>(encrypted)
  },

  // Generate salt for password hashing
  generateSalt(): string {
    return CryptoJS.lib.WordArray.random(128/8).toString()
  },

  // Hash password with salt using PBKDF2
  hashPassword(password: string, salt: string): string {
    return CryptoJS.PBKDF2(password, salt, {
      keySize: 256/32,
      iterations: 10000
    }).toString()
  },

  // Verify password against hash
  verifyPassword(password: string, hash: string, salt: string): boolean {
    const computedHash = this.hashPassword(password, salt)
    return computedHash === hash
  }
}

// Legacy functions for backward compatibility with password-based encryption
export function encryptData(data: unknown): string {
  return encryptionService.encryptData(data)
}

export function decryptData<T>(encrypted: string): T {
  return encryptionService.decryptData<T>(encrypted)
}
