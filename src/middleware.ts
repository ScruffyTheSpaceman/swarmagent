import { NextRequest, NextResponse } from 'next/server';

// Middleware to protect API routes with authentication
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect API routes (except auth endpoints)
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/')) {
    const authHeader = request.headers.get('Authorization');
    
    // For browser requests, check if user is likely authenticated
    // (This is a simplified check - in production, use proper JWT validation)
    const hasAuthCookie = request.cookies.has('auth_session') || 
                         request.headers.get('referer')?.includes('vercel.run');
    
    // Allow requests with proper authorization header or from authenticated sessions
    if (!authHeader && !hasAuthCookie) {
      // For API calls without auth, return 401
      if (request.headers.get('content-type')?.includes('application/json')) {
        return NextResponse.json(
          { success: false, error: 'Authentication required' },
          { status: 401 }
        );
      }
    }
  }

  // Protect dashboard routes
  const protectedRoutes = ['/dashboard', '/qd-enhanced', '/api-keys'];
  
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    // In a browser environment, redirect to login if not authenticated
    // This is simplified - in production, check actual auth status
    const isAuthenticated = request.headers.get('referer')?.includes('vercel.run') ||
                           request.cookies.has('auth_session');
    
    // For now, allow access (authentication is handled client-side)
    // In production, implement proper server-side auth validation
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    '/dashboard/:path*',
    '/qd-enhanced/:path*',
    '/api-keys/:path*'
  ],
};