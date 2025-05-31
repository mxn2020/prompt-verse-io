// middleware.ts
import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const response = await updateSession(request)

  // Check if user is authenticated for protected routes
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/signup')
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard')

  // Check if user is authenticated by creating a supabase client and getting user
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // We don't need to set cookies in this context
        },
      },
    }
  )

  const { data: { user }, error } = await supabase.auth.getUser()
  
  // Debug logging (remove in production)
  console.log('Middleware - Path:', request.nextUrl.pathname)
  console.log('Middleware - User:', user ? 'authenticated' : 'not authenticated')
  console.log('Middleware - Auth error:', error)
  console.log('Middleware - Is auth route:', isAuthRoute)
  console.log('Middleware - Is protected route:', isProtectedRoute)

  if (isProtectedRoute && !user) {
    // Redirect to login if accessing protected route without session
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname)
    console.log('Middleware - Redirecting to login:', redirectUrl.toString())
    return NextResponse.redirect(redirectUrl)
  }

  if (isAuthRoute && user) {
    // Redirect to dashboard if accessing auth routes while logged in
    console.log('Middleware - Redirecting to dashboard')
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}