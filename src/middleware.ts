import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getSupabasePublishableKey, getSupabaseUrl } from '@/lib/supabase/env'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })
  const path = request.nextUrl.pathname
  const protectedPath = path.startsWith('/app') || path.startsWith('/cockpit')
  const authEntry = path === '/login' || path === '/cockpit/login'
  const url = getSupabaseUrl()
  const key = getSupabasePublishableKey()

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  const { data } = await supabase.auth.getClaims()
  const claims = data?.claims

  if (protectedPath && path !== '/cockpit/login' && !claims) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set('next', path)
    return NextResponse.redirect(redirectUrl)
  }

  if (authEntry && claims) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = path === '/cockpit/login' ? '/cockpit' : '/app'
    redirectUrl.search = ''
    return NextResponse.redirect(redirectUrl)
  }

  if (protectedPath || authEntry || path.startsWith('/auth')) {
    response.headers.set('Cache-Control', 'private, no-store')
  }

  return response
}

export const config = {
  matcher: ['/app/:path*', '/cockpit/:path*', '/login', '/auth/:path*'],
}
