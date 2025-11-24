// src/lib/auth.ts

import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { AuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      name: "OTP Login",
      credentials: {
        phone: { label: "Phone", type: "text" },
        otp: { label: "OTP", type: "text" },
      },

      async authorize(credentials) {
        const phone = credentials?.phone?.trim();
        const otp = credentials?.otp?.trim();

        if (!phone || !otp) {
          console.log("❌ Phone or OTP missing");
          return null;
        }

        // 🟢 1) گرفتن رکورد OTP از جدول OTP
        const otpRecord = await prisma.oTP.findUnique({
          where: { phone },
        });

        if (!otpRecord) {
          console.log("❌ No OTP record found for phone:", phone);
          return null;
        }

        // 🟢 2) چک اعتبار OTP
        const expiry = new Date(otpRecord.createdAt.getTime() + 5 * 60000);
        const now = new Date();

        if (otpRecord.code !== otp) {
          console.log("❌ OTP mismatch:", otpRecord.code, otp);
          return null;
        }

        if (expiry < now) {
          console.log("❌ OTP expired");
          return null;
        }

        // 🟢 3) پیدا کردن یا ساخت کاربر
        let user = await prisma.user.findUnique({ where: { phone } });

        if (!user) {
          user = await prisma.user.create({
            data: {
              phone,
              role: "user",
              hasSelectedRole: false,
            },
          });
        }

        // 🟢 4) پاک کردن OTP بعد از استفاده
        await prisma.oTP.delete({
          where: { phone },
        });

        // 🟢 5) مقدار برگشتی برای JWT و سشن
        return {
          id: user.id,
          phone: user.phone,
          role: user.role,
          email: user.email ?? null,
          image: user.image ?? null,
          firstName: user.firstName ?? null,
          lastName: user.lastName ?? null,
          slug: user.slug ?? null,
          hasSelectedRole: user.hasSelectedRole,
        };
      },
    }),
  ],

  session: { strategy: "jwt" },
  jwt: { secret: process.env.NEXTAUTH_SECRET },

  pages: {
    signIn: "/login",
    error: "/auth/error",
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      if (user) return { ...token, ...user };
      return token;
    },
    async session({ session, token }) {
      session.user = token as unknown as Session["user"];
      return session;
    },
  },
};
