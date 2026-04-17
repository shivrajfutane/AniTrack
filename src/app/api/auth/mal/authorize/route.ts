import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const malClientId = process.env.MAL_CLIENT_ID
  
  if (!malClientId) {
    return NextResponse.json({ error: 'MAL_CLIENT_ID not configured' }, { status: 500 })
  }

  // Generate a random code verifier (PKCE)
  const codeVerifier = Array.from(crypto.getRandomValues(new Uint8Array(64)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  const cookieStore = await cookies()
  
  // Store the code verifier in a cookie to retrieve it on callback
  cookieStore.set('mal_code_verifier', codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600, // 10 minutes
  })

  const authorizeUrl = new URL('https://myanimelist.net/v1/oauth2/authorize')
  authorizeUrl.searchParams.append('response_type', 'code')
  authorizeUrl.searchParams.append('client_id', malClientId)
  authorizeUrl.searchParams.append('code_challenge', codeVerifier)
  authorizeUrl.searchParams.append('code_challenge_method', 'plain')
  
  // Optional: Add state for CSRF protection
  const state = Math.random().toString(36).substring(7)
  cookieStore.set('mal_auth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600,
  })
  authorizeUrl.searchParams.append('state', state)

  return NextResponse.redirect(authorizeUrl.toString())
}
