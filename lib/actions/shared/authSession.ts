"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/config";
import { getServerSession } from "next-auth";

export class AuthSessionService {
  static async getSession() {
    const session = await getServerSession(authOptions);
    return session;
  }

  static async getUserFromSession() {
    const session = await this.getSession();
    if (!session?.user) {
      return null;
    }
    return session.user;
  }

  static async getUserIdFromSession() {
    const user = await this.getUserFromSession();
    return user?.id || null;
  }
}
