import { UserRole } from "@/lib/generated/prisma"
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const { token } = req.nextauth

    // Public routes that don't need authentication
    const publicRoutes = ["/", "/auth/signin", "/auth/signup", "/marketplace"]
    
    if (publicRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.next()
    }

    // If no token, redirect to signin
    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", req.url))
    }

    // Check if user is active and verified for protected routes
    if (!token.isActive) {
      return NextResponse.redirect(new URL("/auth/signin?error=account-deactivated", req.url))
    }

    // Role-based route protection
    if (pathname.startsWith("/dashboard")) {
      // All authenticated users can access dashboard
      return NextResponse.next()
    }

    if (pathname.startsWith("/admin")) {
      if (token.role !== UserRole.ADMIN) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Allow public routes
        const publicRoutes = ["/", "/auth/signin", "/auth/signup", "/marketplace"]
        if (publicRoutes.some(route => pathname.startsWith(route))) {
          return true
        }

        // Require authentication for all other routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)",
  ],
}
