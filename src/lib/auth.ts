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
        const phone = credentials?.phone;
        const otp = credentials?.otp;
        if (!phone || !otp) return null;

        // 1) چک کردن OTP از جدول OTP
        const otpRecord = await prisma.oTP.findUnique({
          where: { phone },
        });
        if (!otpRecord) return null;

        // چک کردن اعتبار کد (۵ دقیقه اعتبار)
        const expiry = new Date(otpRecord.createdAt.getTime() + 5 * 60000);
        if (otpRecord.code !== otp || expiry < new Date()) {
          return null;
        }

        // 2) پیدا کردن یا ساختن کاربر
        let user = await prisma.user.findUnique({
          where: { phone },
        });

        if (!user) {
          user = await prisma.user.create({
            data: { phone },
          });
        }

        // 3) پاک کردن کد OTP پس از استفاده
        await prisma.oTP.delete({
          where: { phone },
        });

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
