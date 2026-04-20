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

    // Attempt to fetch MAL profile to get the avatar
    let malAvatarUrl: string | null = null;
    try {
      const profileRes = await fetch('https://api.myanimelist.net/v2/users/@me?fields=picture', {
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`
        }
      });
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        if (profileData.picture) {
          malAvatarUrl = profileData.picture;
        }
      }
    } catch (err) {
      console.error('Failed to fetch MAL profile:', err);
    }

    // Update user metadata in Supabase if we got an avatar
    if (malAvatarUrl) {
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: malAvatarUrl }
      });
      if (updateError) {
        console.error('Failed to update user avatar in Supabase:', updateError);
      }
    }

    // Fetch user's anime list from MAL to sync
    try {
      const listRes = await fetch('https://api.myanimelist.net/v2/users/@me/animelist?fields=list_status,main_picture&limit=1000', {
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`
        }
      });
      if (listRes.ok) {
        const listData = await listRes.json();
        
        // Map MAL list to our DB format
        if (listData.data && Array.isArray(listData.data)) {
          const listItems = listData.data.map((item: any) => {
             // Map MAL status to our AnimeStatus enum
             let status = 'plan_to_watch';
             if (item.list_status.status === 'watching') status = 'watching';
             else if (item.list_status.status === 'completed') status = 'completed';
             else if (item.list_status.status === 'on_hold') status = 'on_hold';
             else if (item.list_status.status === 'dropped') status = 'dropped';
             
             return {
               user_id: user.id,
               anime_id: item.node.id, // using MAL ID
               anime_title: item.node.title,
               anime_image_url: item.node.main_picture?.large || item.node.main_picture?.medium,
               status: status,
               episodes_watched: item.list_status.num_episodes_watched || 0,
               score: item.list_status.score || null,
               updated_at: new Date().toISOString()
             };
          });

          // Perform a batch upsert into anime_list
          if (listItems.length > 0) {
            const { error: upsertError } = await supabase
              .from('anime_list')
              .upsert(listItems, { onConflict: 'user_id,anime_id' });
              
            if (upsertError) {
              console.error('Failed to bulk sync MAL list:', upsertError);
            }
          }
        }
      }
    } catch (err) {
      console.error('Failed to sync MAL list:', err);
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

    return NextResponse.redirect(new URL('/?mal_connected=true', request.url))
  } catch (error) {
    console.error('MAL OAuth Flow Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
