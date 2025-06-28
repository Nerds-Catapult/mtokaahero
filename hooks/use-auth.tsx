"use client"

import { UserRole } from "@/lib/generated/prisma"
import { useSession } from "next-auth/react"

export function useAuth() {
  const { data: session, status } = useSession()

  return {
    user: session?.user || null,
    isLoading: status === "loading",
    isAuthenticated: !!session?.user,
    isVerified: session?.user?.isVerified || false,
    isActive: session?.user?.isActive || false,
    role: session?.user?.role || null,
    isCustomer: session?.user?.role === UserRole.CUSTOMER,
    isMechanic: session?.user?.role === UserRole.FREELANCE_MECHANIC,
    isGarageOwner: session?.user?.role === UserRole.GARAGE_OWNER,
    isShopOwner: session?.user?.role === UserRole.SPAREPARTS_SHOP,
    isAdmin: session?.user?.role === UserRole.ADMIN,
  }
}
