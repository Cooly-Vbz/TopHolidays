import { describe, it, expect } from 'vitest'
import { encrypt, decrypt, generateSalt, hashPassword, encryptionService } from '../lib/crypto'

describe('Encryption Service', () => {
  it('should encrypt and decrypt data', () => {
    const data = { userId: '123', email: 'test@example.com' }
    const encrypted = encrypt(data)
    const decrypted = decrypt(encrypted)
    expect(decrypted).toEqual(data)
  })

  it('should hash passwords consistently', () => {
    const salt = 'test-salt'
    const hash1 = hashPassword('password123', salt)
    const hash2 = hashPassword('password123', salt)
    expect(hash1).toBe(hash2)
  })

  it('should generate different salts', () => {
    const salt1 = generateSalt()
    const salt2 = generateSalt()
    expect(salt1).not.toBe(salt2)
    expect(salt1.length).toBeGreaterThan(0)
    expect(salt2.length).toBeGreaterThan(0)
  })

  describe('Encryption Service Methods', () => {
    it('should encrypt and decrypt data with service', () => {
      const data = { message: 'Hello, World!', timestamp: Date.now() }

      const encrypted = encryptionService.encryptData(data)
      const decrypted = encryptionService.decryptData(encrypted)

      expect(decrypted).toEqual(data)
    })

    it('should hash and verify passwords', () => {
      const password = 'mySecurePassword123!'
      const salt = encryptionService.generateSalt()

      const hash = encryptionService.hashPassword(password, salt)
      expect(hash).toBeDefined()
      expect(typeof hash).toBe('string')
      expect(hash.length).toBeGreaterThan(0)

      const isValid = encryptionService.verifyPassword(password, hash, salt)
      expect(isValid).toBe(true)

      const isInvalid = encryptionService.verifyPassword('wrong-password', hash, salt)
      expect(isInvalid).toBe(false)
    })
  })
})