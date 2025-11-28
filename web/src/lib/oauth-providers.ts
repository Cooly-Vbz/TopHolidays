import { signInWithOAuth } from './auth'
import type { UserProfile } from './auth'

export type OAuthProvider = 'google' | 'facebook' | 'apple' | 'github'

export interface OAuthConfig {
    google: {
        clientId: string
    }
    facebook: {
        appId: string
    }
    apple: {
        clientId: string
    }
    github: {
        clientId: string
    }
}

export const oauthConfig: OAuthConfig = {
    google: {
        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dev-google-client-id'
    },
    facebook: {
        appId: import.meta.env.VITE_FACEBOOK_APP_ID || 'dev-facebook-app-id'
    },
    apple: {
        clientId: import.meta.env.VITE_APPLE_CLIENT_ID || 'dev-apple-client-id'
    },
    github: {
        clientId: import.meta.env.VITE_GITHUB_CLIENT_ID || 'dev-github-client-id'
    }
}

export async function handleOAuthCallback(
    provider: OAuthProvider,
    response: any
): Promise<UserProfile> {
    console.log(`Handling ${provider} callback:`, response)

    // Validate OAuth response
    if (!response) {
        throw new Error('OAuth response is empty')
    }

    let userData: Partial<UserProfile> = {}

    // Extract user data based on provider
    switch (provider) {
        case 'google':
            if (response.credential) {
                // Google JWT token - in a real app, you'd decode this
                // For demo, we'll create mock data from the credential presence
                userData = {
                    email: `google_${Date.now()}@example.com`,
                    displayName: 'Google User',
                    provider: 'google',
                    providerId: `google_${Date.now()}`
                }
            } else {
                throw new Error('Invalid Google OAuth response')
            }
            break

        case 'facebook':
            if (response.email) {
                userData = {
                    email: response.email,
                    displayName: response.name || 'Facebook User',
                    provider: 'facebook',
                    providerId: response.id
                }
            } else {
                throw new Error('Invalid Facebook OAuth response')
            }
            break

        case 'apple':
            // Apple provides user data in a different format
            if (response.authorization?.id_token) {
                userData = {
                    email: `apple_${Date.now()}@example.com`,
                    displayName: 'Apple User',
                    provider: 'apple',
                    providerId: `apple_${Date.now()}`
                }
            } else {
                throw new Error('Invalid Apple OAuth response')
            }
            break

        case 'github':
            if (response.code) {
                // GitHub OAuth requires exchanging code for token
                // For demo purposes, simulate this
                userData = {
                    email: `github_${Date.now()}@example.com`,
                    displayName: 'GitHub User',
                    provider: 'github',
                    providerId: `github_${Date.now()}`
                }
            } else {
                throw new Error('Invalid GitHub OAuth response')
            }
            break

        default:
            throw new Error(`Unsupported OAuth provider: ${provider}`)
    }

    // Validate required fields
    if (!userData.email) {
        throw new Error('Email is required from OAuth provider')
    }

    // Create complete user profile
    const profile: UserProfile = {
        id: crypto.randomUUID(),
        email: userData.email,
        displayName: userData.displayName || userData.email.split('@')[0],
        provider: provider,
        providerId: userData.providerId,
        createdAt: new Date().toISOString()
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))

    // Use the auth service to sign in/up and persist the session
    return signInWithOAuth(provider as 'google' | 'facebook' | 'apple' | 'github', profile)
}
