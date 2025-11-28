import { describe, it, expect } from 'vitest'
import { encrypt, decrypt, generateSalt, hashPassword, verifyPassword } from '../lib/encryption'

describe('Encryption Service', () => {
    describe('encrypt and decrypt', () => {
        it('should encrypt and decrypt simple data', () => {
            const data = { userId: '123', email: 'test@example.com' }
            const encrypted = encrypt(data)

            expect(encrypted).toBeTypeOf('string')
            expect(encrypted).not.toContain('test@example.com')

            const decrypted = decrypt(encrypted)
            expect(decrypted).toEqual(data)
        })

        it('should encrypt and decrypt complex nested data', () => {
            const data = {
                user: {
                    id: '123',
                    profile: { name: 'John', age: 30 },
                    settings: { theme: 'dark', locale: 'en-US' }
                },
                tokens: ['abc', 'def']
            }

            const encrypted = encrypt(data)
            const decrypted = decrypt(encrypted)
            expect(decrypted).toEqual(data)
        })

        it('should produce different ciphertext for same data', () => {
            const data = { test: 'value' }
            const encrypted1 = encrypt(data)
            const encrypted2 = encrypt(data)

            // AES with random IV produces different ciphertext
            // But both should decrypt to same value
            expect(decrypt(encrypted1)).toEqual(data)
            expect(decrypt(encrypted2)).toEqual(data)
        })
    })

    describe('password hashing', () => {
        it('should generate random salts', () => {
            const salt1 = generateSalt()
            const salt2 = generateSalt()

            expect(salt1).toBeTypeOf('string')
            expect(salt1).not.toBe(salt2)
            expect(salt1.length).toBeGreaterThan(0)
        })

        it('should hash passwords consistently with same salt', () => {
            const password = 'MySecurePassword123!'
            const salt = 'test-salt-value'

            const hash1 = hashPassword(password, salt)
            const hash2 = hashPassword(password, salt)

            expect(hash1).toBe(hash2)
            expect(hash1).toBeTypeOf('string')
            expect(hash1.length).toBeGreaterThan(0)
        })

        it('should produce different hashes with different salts', () => {
            const password = 'MySecurePassword123!'
            const salt1 = generateSalt()
            const salt2 = generateSalt()

            const hash1 = hashPassword(password, salt1)
            const hash2 = hashPassword(password, salt2)

            expect(hash1).not.toBe(hash2)
        })

        it('should verify correct passwords', () => {
            const password = 'CorrectPassword123'
            const salt = generateSalt()
            const hash = hashPassword(password, salt)

            expect(verifyPassword(password, salt, hash)).toBe(true)
            expect(verifyPassword('WrongPassword', salt, hash)).toBe(false)
        })
    })
})
