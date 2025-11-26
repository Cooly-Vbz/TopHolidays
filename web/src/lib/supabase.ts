// Placeholder: initialize Supabase client when environment variables are available
// This file avoids exposing any keys in frontend code
export function getSupabase() {
  console.warn('Supabase client not configured in frontend. Use Edge Functions for sensitive ops.')
  return null as any
}