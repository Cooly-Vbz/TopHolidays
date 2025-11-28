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

export interface UserProfile {
    id: string
    email: string
    displayName: string
    photoURL?: string
    provider: OAuthProvider
}

export async function handleOAuthCallback(
    provider: OAuthProvider,
    response: any
): Promise<UserProfile> {
    // In a real app, you would send the token to your backend
    // For this demo, we'll simulate decoding the token or fetching user info

    console.log(`Handling ${provider} callback:`, response)

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))

    // Mock user data based on provider
    return {
        id: `${provider}_${Date.now()}`,
        email: `user@${provider}.com`,
        displayName: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        photoURL: `https://ui-avatars.com/api/?name=${provider}+User&background=random`,
        provider
    }
}
