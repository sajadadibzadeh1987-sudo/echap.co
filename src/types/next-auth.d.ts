// src/types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  /**
   * Extended Session interface with custom user properties
   */
  interface Session {
    user: {
      id: string;
      role: string;
      phone?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      image?: string | null;
      email?: string | null;
      slug?: string | null;
      hasSelectedRole: boolean;
      // ⭐ تعداد سکه‌های کاربر در سشن
      coins?: number;
    } & DefaultSession["user"];
  }

  /**
   * Extended User interface for next-auth
   */
  interface User extends DefaultUser {
    id: string;
    role: string;
    phone?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    slug?: string | null;
    hasSelectedRole: boolean;
    // ⭐ تعداد سکه‌ها روی مدل User
    coins?: number;
  }
}

declare module "next-auth/jwt" {
  /**
   * Extended JWT interface with custom token properties
   */
  interface JWT {
    id: string;
    role: string;
    phone?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    image?: string | null;
    email?: string | null;
    slug?: string | null;
    hasSelectedRole: boolean;
    // ⭐ تعداد سکه‌ها روی توکن
    coins?: number;
  }
}
