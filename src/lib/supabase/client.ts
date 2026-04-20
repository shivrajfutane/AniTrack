import { createBrowserClient } from '@supabase/ssr'
import { SupabaseClient } from '@supabase/supabase-js'

// Extend window to hold the client across Turbopack HMR reloads.
// Module-level variables are reset on hot-reload, which creates a new
// Supabase client while the old one still holds the Web Lock — causing
// "lock stolen" AbortErrors. Storing on `window` survives HMR.
declare global {
  interface Window {
    __supabase_singleton?: SupabaseClient
  }
}

export function createClient(): SupabaseClient {
  if (typeof window !== 'undefined') {
    if (!window.__supabase_singleton) {
      window.__supabase_singleton = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
    }
    return window.__supabase_singleton
  }

  // SSR path — server components should use the server client instead,
  // but create a fresh instance here as a safe fallback.
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

