// Temporarily disabled middleware for debugging
// import { UserRole } from "@/lib/generated/prisma"
// import { withAuth } from "next-auth/middleware"
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Temporarily allow all requests
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Disabled matcher for debugging
    // "/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
