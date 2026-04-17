import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')

  const cookieStore = await cookies()
  const storedState = cookieStore.get('mal_auth_state')?.value
  const codeVerifier = cookieStore.get('mal_code_verifier')?.value

  // Verify state and check for required parameters
  if (!code || !state || state !== storedState || !codeVerifier) {
    return NextResponse.json({ error: 'Invalid state or missing code' }, { status: 400 })
  }

  const malClientId = process.env.MAL_CLIENT_ID
  const malClientSecret = process.env.MAL_CLIENT_SECRET

  if (!malClientId || !malClientSecret) {
    return NextResponse.json({ error: 'MAL configuration missing' }, { status: 500 })
  }

  try {
    // Exchange the code for an access token
    const tokenResponse = await fetch('https://myanimelist.net/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: malClientId,
        client_secret: malClientSecret,
        grant_type: 'authorization_code',
        code: code,
        code_verifier: codeVerifier,
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json()
      console.error('MAL Token Exchange Error:', errorData)
      return NextResponse.json({ error: 'Failed to exchange token' }, { status: 500 })
    }

    const tokens = await tokenResponse.json()

    // Get the Supabase user
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'User not authenticated in Supabase' }, { status: 401 })
    }

    // Save tokens to Supabase
    const { error: dbError } = await supabase
      .from('mal_credentials')
      .upsert({
        user_id: user.id,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
      })

    if (dbError) {
      console.error('DB Error saving MAL tokens:', dbError)
      return NextResponse.json({ error: 'Failed to save tokens' }, { status: 500 })
    }

    // Success! Cleanup cookies and redirect
    cookieStore.delete('mal_auth_state')
    cookieStore.delete('mal_code_verifier')

    return NextResponse.redirect(new URL('/dashboard?mal_connected=true', request.url))
  } catch (error) {
    console.error('MAL OAuth Flow Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
