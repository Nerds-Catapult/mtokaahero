"use client"

import { LogoutButton } from "@/components/logout-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"

export function AuthStatus() {
  const { user, isLoading, isAuthenticated } = useAuth()

  if (isLoading) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="animate-pulse">Loading...</div>
        </CardContent>
      </Card>
    )
  }

  if (!isAuthenticated) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Authentication Required</CardTitle>
          <CardDescription>Please sign in to access this page</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Link href="/auth/signin">
              <Button>Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="outline">Sign Up</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Welcome Back!</CardTitle>
        <CardDescription>You are successfully authenticated</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <div className="flex items-center gap-2">
            <strong>Role:</strong>
            <Badge variant="secondary">{user?.role}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <strong>Status:</strong>
            <Badge variant={user?.isActive ? "default" : "destructive"}>
              {user?.isActive ? "Active" : "Inactive"}
            </Badge>
            <Badge variant={user?.isVerified ? "default" : "secondary"}>
              {user?.isVerified ? "Verified" : "Unverified"}
            </Badge>
          </div>
        </div>
        <LogoutButton variant="outline" className="w-full" />
      </CardContent>
    </Card>
  )
}
