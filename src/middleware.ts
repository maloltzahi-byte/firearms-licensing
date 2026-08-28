import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

function publicKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    ''
  )
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })
  const path = request.nextUrl.pathname
  const protectedPath = path.startsWith('/app') || path.startsWith('/cockpit')
  const authEntry = path === '/login' || path === '/cockpit/login'
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = publicKey()

  // Fail closed for authenticated surfaces. A deployment with missing auth
  // configuration must never silently expose a protected route.
  if ((!url || !key) && protectedPath && path !== '/cockpit/login') {
    return new NextResponse('השירות אינו זמין כרגע. נסו שוב מאוחר יותר.', {
      status: 503,
      headers: {
        'Cache-Control': 'private, no-store',
        'Content-Type': 'text/plain; charset=utf-8',
      },
    })
  }

  if (!url || !key) return response

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
