"use client"

import type React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import {
  Bell,
  Calendar,
  Car,
  ChevronDown,
  LogOut,
  Menu,
  Settings,
  Star,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, isLoading } = useAuth();

  // Helper function to get user role display name
  const getRoleDisplayName = (role: string | undefined) => {
    switch (role) {
      case "FREELANCE_MECHANIC":
        return "Freelance Mechanic";
      case "GARAGE_OWNER":
        return "Garage Owner";
      case "SPAREPARTS_SHOP":
        return "Spare Parts Shop";
      case "CUSTOMER":
        return "Customer";
      case "ADMIN":
        return "Admin";
      default:
        return "User";
    }
  };

  // Helper function to get user initials
  const getUserInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSignOut = async () => {
    try {
      await signOut({
        callbackUrl: "/auth/signin",
        redirect: true,
      });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: TrendingUp,
      current: pathname === "/dashboard",
    },
    // Show different navigation items based on user role
    ...(user?.role === "CUSTOMER"
      ? [
          {
            name: "My Bookings",
            href: "/bookings",
            icon: Calendar,
            current: pathname === "/bookings",
          },
        ]
      : [
          {
            name: "Bookings",
            href: "/dashboard/bookings",
            icon: Calendar,
            current: pathname === "/dashboard/bookings",
          },
        ]),
    ...(user?.role === "SPAREPARTS_SHOP"
      ? [
          {
            name: "Inventory",
            href: "/dashboard/inventory",
            icon: Car,
            current: pathname === "/dashboard/inventory",
          },
          {
            name: "Orders",
            href: "/dashboard/orders",
            icon: Users,
            current: pathname === "/dashboard/orders",
          },
        ]
      : user?.role === "CUSTOMER"
      ? []
      : [
          {
            name: "Services",
            href: "/dashboard/services",
            icon: Car,
            current: pathname === "/dashboard/services",
          },
          {
            name: "Customers",
            href: "/dashboard/customers",
            icon: Users,
            current: pathname === "/dashboard/customers",
          },
        ]),
    {
      name: "Reviews",
      href: user?.role === "CUSTOMER" ? "/reviews" : "/dashboard/reviews",
      icon: Star,
      current:
        pathname ===
        (user?.role === "CUSTOMER" ? "/reviews" : "/dashboard/reviews"),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo.png"
                alt="MtokaaHero Logo"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
                onError={(e) => {
                  // Fallback to placeholder if logo doesn't exist
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder-logo.png";
                }}
              />
              <span className="text-xl font-bold">MtokaaHero</span>
            </Link>
            {!isLoading && user && (
              <Badge variant="secondary">{getRoleDisplayName(user.role)}</Badge>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>

            {/* Profile Dropdown */}
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                <div className="hidden md:flex flex-col space-y-1">
                  <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                  <div className="h-2 w-20 bg-muted rounded animate-pulse" />
                </div>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 px-3"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user?.image || undefined}
                        alt={user?.name || "User"}
                      />
                      <AvatarFallback>
                        {getUserInitials(user?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start">
                      <span className="text-sm font-medium">
                        {user?.name || "User"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {user?.email}
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-red-600 focus:text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "w-64 bg-background border-r min-h-screen transition-transform duration-200 ease-in-out",
            "md:translate-x-0",
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0",
            "fixed md:relative z-40"
          )}
        >
          <nav className="p-6">
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                      item.current
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
