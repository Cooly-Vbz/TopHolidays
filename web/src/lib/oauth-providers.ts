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

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))

    // Use the auth service to sign in/up and persist the session
    // We cast the provider string to the specific union type expected by auth.ts
    return signInWithOAuth(provider as 'google' | 'facebook' | 'apple' | 'github')
}
