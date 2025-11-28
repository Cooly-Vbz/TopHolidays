import CryptoJS from 'crypto-js'

// Use environment variable in production, fallback for development
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'dev-key-change-in-production-12345'

/**
 * Encrypt any data using AES encryption
 * @param data - Data to encrypt (will be JSON stringified)
 * @returns Encrypted string
 */
export function encrypt(data: any): string {
    const jsonString = JSON.stringify(data)
    return CryptoJS.AES.encrypt(jsonString, ENCRYPTION_KEY).toString()
}

/**
 * Decrypt encrypted string back to original data
 * @param encrypted - Encrypted string
 * @returns Decrypted data
 */
export function decrypt<T = any>(encrypted: string): T {
    const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY)
    const jsonString = bytes.toString(CryptoJS.enc.Utf8)
    return JSON.parse(jsonString)
}

/**
 * Generate a random salt for password hashing
 * @returns Random salt string
 */
export function generateSalt(): string {
    return CryptoJS.lib.WordArray.random(128 / 8).toString()
}

/**
 * Hash a password with PBKDF2
 * @param password - Plain text password
 * @param salt - Salt for hashing
 * @returns Hashed password
 */
export function hashPassword(password: string, salt: string): string {
    return CryptoJS.PBKDF2(password, salt, {
        keySize: 256 / 32,
        iterations: 10000
    }).toString()
}

/**
 * Verify a password against a hash
 * @param password - Plain text password to verify
 * @param salt - Salt used for hashing
 * @param hash - Stored hash to compare against
 * @returns True if password matches
 */
export function verifyPassword(password: string, salt: string, hash: string): boolean {
    const computedHash = hashPassword(password, salt)
    return computedHash === hash
}
