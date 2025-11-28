import { describe, it, expect, vi } from 'vitest'
import { handleOAuthCallback, oauthConfig, OAuthProvider } from '../lib/oauth-providers'

// Mock the auth module
vi.mock('../lib/auth', () => ({
  signInWithOAuth: vi.fn(),
  UserProfile: {}
}))

import { signInWithOAuth } from '../lib/auth'

describe('OAuth Providers', () => {
  const mockSignInWithOAuth = vi.mocked(signInWithOAuth)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('OAuth Configuration', () => {
    it('should have default values for development', () => {
      expect(oauthConfig.google.clientId).toBe('dev-google-client-id')
      expect(oauthConfig.facebook.appId).toBe('dev-facebook-app-id')
      expect(oauthConfig.apple.clientId).toBe('dev-apple-client-id')
      expect(oauthConfig.github.clientId).toBe('dev-github-client-id')
    })
  })

  describe('handleOAuthCallback', () => {
    it('should handle Google OAuth callback', async () => {
      const mockProfile = {
        id: 'test-id',
        email: 'google_user@example.com',
        displayName: 'Google User',
        provider: 'google' as const,
        providerId: 'google_123',
        createdAt: '2024-01-01T00:00:00.000Z'
      }

      mockSignInWithOAuth.mockResolvedValue(mockProfile)

      const response = { credential: 'mock-jwt-token' }
      const result = await handleOAuthCallback('google', response)

      expect(mockSignInWithOAuth).toHaveBeenCalledWith('google', expect.objectContaining({
        email: expect.stringContaining('google_'),
        displayName: 'Google User',
        provider: 'google'
      }))
      expect(result).toEqual(mockProfile)
    })

    it('should handle Facebook OAuth callback', async () => {
      const mockProfile = {
        id: 'fb-id',
        email: 'fb@example.com',
        displayName: 'Facebook User',
        provider: 'facebook' as const,
        providerId: 'fb_123',
        createdAt: '2024-01-01T00:00:00.000Z'
      }

      mockSignInWithOAuth.mockResolvedValue(mockProfile)

      const response = {
        email: 'fb@example.com',
        name: 'Facebook User',
        id: 'fb_123'
      }
      const result = await handleOAuthCallback('facebook', response)

      expect(mockSignInWithOAuth).toHaveBeenCalledWith('facebook', expect.objectContaining({
        email: 'fb@example.com',
        displayName: 'Facebook User',
        provider: 'facebook',
        providerId: 'fb_123'
      }))
      expect(result).toEqual(mockProfile)
    })

    it('should handle Apple OAuth callback', async () => {
      const mockProfile = {
        id: 'apple-id',
        email: 'apple_user@example.com',
        displayName: 'Apple User',
        provider: 'apple' as const,
        providerId: 'apple_123',
        createdAt: '2024-01-01T00:00:00.000Z'
      }

      mockSignInWithOAuth.mockResolvedValue(mockProfile)

      const response = {
        authorization: { id_token: 'mock-apple-token' }
      }
      const result = await handleOAuthCallback('apple', response)

      expect(mockSignInWithOAuth).toHaveBeenCalledWith('apple', expect.objectContaining({
        email: expect.stringContaining('apple_'),
        displayName: 'Apple User',
        provider: 'apple'
      }))
      expect(result).toEqual(mockProfile)
    })

    it('should handle GitHub OAuth callback', async () => {
      const mockProfile = {
        id: 'github-id',
        email: 'github_user@example.com',
        displayName: 'GitHub User',
        provider: 'github' as const,
        providerId: 'github_123',
        createdAt: '2024-01-01T00:00:00.000Z'
      }

      mockSignInWithOAuth.mockResolvedValue(mockProfile)

      const response = { code: 'mock-github-code' }
      const result = await handleOAuthCallback('github', response)

      expect(mockSignInWithOAuth).toHaveBeenCalledWith('github', expect.objectContaining({
        email: expect.stringContaining('github_'),
        displayName: 'GitHub User',
        provider: 'github'
      }))
      expect(result).toEqual(mockProfile)
    })

    it('should reject invalid responses', async () => {
      await expect(handleOAuthCallback('google', null)).rejects.toThrow('OAuth response is empty')
      await expect(handleOAuthCallback('google', {})).rejects.toThrow('Invalid Google OAuth response')
      await expect(handleOAuthCallback('facebook', {})).rejects.toThrow('Invalid Facebook OAuth response')
    })

    it('should reject unsupported providers', async () => {
      const invalidProvider = 'invalid' as OAuthProvider
      await expect(handleOAuthCallback(invalidProvider, { credential: 'test' })).rejects.toThrow('Unsupported OAuth provider')
    })
  })
})
