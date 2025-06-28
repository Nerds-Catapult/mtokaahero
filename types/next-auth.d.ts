import { UserRole } from "@/lib/generated/prisma"
import { DefaultSession, DefaultUser } from "next-auth"
import { DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: UserRole
      isVerified: boolean
      isActive: boolean
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    role: UserRole
    isVerified: boolean
    isActive: boolean
    firstName: string
    lastName: string
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: UserRole;
    isVerified: boolean;
    isActive: boolean;
    firstName: string;
    lastName: string;
  }
}
