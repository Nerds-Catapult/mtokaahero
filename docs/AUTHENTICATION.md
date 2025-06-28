# Authentication Setup for MtokaaHero

## Overview
This automotive service platform now includes a complete authentication system using NextAuth.js with support for:
- Email/password authentication
- Google OAuth
- Role-based access control
- User registration with different account types
- Session management

## Features Implemented

### 🔐 Authentication Methods
- **Credentials Provider**: Email and password authentication
- **Google OAuth**: One-click sign-in with Google
- **Automatic Account Creation**: Users can register as different account types

### 👥 User Roles
- **Customer**: Find automotive services and parts
- **Freelance Mechanic**: Offer independent automotive services  
- **Garage Owner**: Run professional automotive repair shops
- **Spare Parts Shop**: Sell automotive parts and accessories
- **Admin**: Platform administration access

### 🛡️ Security Features
- Password hashing with bcrypt
- JWT-based sessions
- Route protection middleware
- Role-based access control
- Account verification system

## File Structure

### Core Authentication Files
```
app/
├── api/auth/
│   ├── [...nextauth]/route.ts     # NextAuth configuration
│   └── signup/route.ts            # User registration API
├── auth/
│   ├── signin/page.tsx            # Sign-in page
│   └── signup/page.tsx            # Sign-up page
├── layout.tsx                     # Updated with SessionProvider
└── middleware.ts                  # Route protection

components/
├── auth-status.tsx                # Authentication status component
├── logout-button.tsx              # Logout functionality
└── session-provider.tsx           # Session context provider

hooks/
└── use-auth.tsx                   # Custom authentication hook

types/
└── next-auth.d.ts                 # NextAuth TypeScript definitions
```

### Database Schema Updates
The Prisma schema has been updated to include NextAuth.js required models:
- `Account` - OAuth account linking
- `Session` - User sessions
- `VerificationToken` - Email verification tokens

## Environment Variables Required

Create a `.env.local` file with:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/mtokaahero"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here-min-32-chars"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## Usage Examples

### Using the Auth Hook
```tsx
import { useAuth } from "@/hooks/use-auth"

export function MyComponent() {
  const { 
    user, 
    isLoading, 
    isAuthenticated, 
    isCustomer, 
    isMechanic,
    isGarageOwner,
    isShopOwner 
  } = useAuth()

  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return <div>Please sign in</div>

  return (
    <div>
      <h1>Welcome {user?.name}</h1>
      {isCustomer && <CustomerDashboard />}
      {isMechanic && <MechanicDashboard />}
      {isGarageOwner && <GarageDashboard />}
      {isShopOwner && <ShopDashboard />}
    </div>
  )
}
```

### Protected API Routes
```tsx
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return new Response("Unauthorized", { status: 401 })
  }
  
  // Handle authenticated request
}
```

## Next Steps

1. **Set up Environment Variables**: Copy `.env.example` to `.env.local` and fill in the values
2. **Database Migration**: Run the database migration to create auth tables
3. **Google OAuth Setup** (Optional): 
   - Go to Google Cloud Console
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
4. **Customize UI**: Modify the auth pages to match your brand
5. **Add Email Verification**: Implement email verification for new accounts
6. **Password Reset**: Add forgot/reset password functionality

## Testing Authentication

1. Start the development server: `pnpm dev`
2. Visit `/auth/signup` to create a new account
3. Try signing in at `/auth/signin`
4. Access `/dashboard` to see the protected dashboard
5. Test role-based features based on your selected account type

The authentication system is now fully integrated and ready for use!
