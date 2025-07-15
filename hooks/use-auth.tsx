"use client"

import { UserRole } from "@/lib/generated/prisma"
import { useSession } from "next-auth/react"
import { getMyBusinesses } from "@/lib/actions/shared/serviceActions"
import { useEffect } from "react"

export function useAuth(fetchBusinesses?: boolean) {
  const { data: session, status } = useSession()
  let businesses: any[] = []

  useEffect(() => {
    if (fetchBusinesses && session?.user) {
      const fetchBusinessesData = async () => {
        const business = await getMyBusinesses(session.user.id)
        businesses = business.data ? [business.data] : []
      }
      fetchBusinessesData()
    }
  }, [fetchBusinesses, session?.user])

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
    businesses: businesses || [],
  }
}
