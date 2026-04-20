import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // Skip session refresh on static assets, prefetches, and internal requests
  // to reduce concurrent lock contention on auth tokens.
  // Prefetches (Next.js Link hover) are the primary cause of "lock stolen"
  // errors because they fire getUser() in parallel with the real navigation.
  const { pathname } = request.nextUrl
  const isPrefetch = request.headers.get('purpose') === 'prefetch' ||
                     request.headers.get('x-middleware-prefetch') === '1' ||
                     request.headers.get('next-router-prefetch') === '1'
  if (
    isPrefetch ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/api/') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|webp|css|js|woff2?)$/)
  ) {
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh auth token (runs only on real page/api requests now)
  await supabase.auth.getUser()

  return supabaseResponse
}
