"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/config";
import { getServerSession } from "next-auth";

/**
 * Get the current session
 */
export async function getSession() {
  const session = await getServerSession(authOptions);
  return session;
}

/**
 * Get the user from the current session
 */
export async function getUserFromSession() {
  const session = await getSession();
  if (!session?.user) {
    return null;
  }
  return session.user;
}

/**
 * Get the user ID from the current session
 */
export async function getUserIdFromSession() {
    const user = await getUserFromSession();
    return user?.id || null;
}

/**
 * Check if the current user is authenticated
 */
export async function isAuthenticated() {
    const user = await getUserFromSession();
    return user !== null;
}

/**
 * Check if the current user has the specified role
 */
export async function hasRole(role: string) {
    const user = await getUserFromSession();
    return user?.role === role;
}

/**
 * Check if the current user has any of the specified roles
 */
export async function hasAnyRole(roles: string[]) {
    const user = await getUserFromSession();
    if (!user?.role) return false;
    return roles.includes(user.role);
}

/**
 * Get the current user's role
 */
export async function getUserRole() {
    const user = await getUserFromSession();
    return user?.role || null;
}

/**
 * Requires authentication or redirects
 * This is a utility function that can be used in server components/actions
 */
export async function requireAuth() {
    const isAuthed = await isAuthenticated();
    if (!isAuthed) {
        throw new Error('Authentication required');
    }
    return true;
}
