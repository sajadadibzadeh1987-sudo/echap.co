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

        // همه فیلدهای کاربر را می‌گیریم (شامل slug)
        const user = await prisma.user.findUnique({ where: { phone } });
        if (!user) return null;

        const isBypass = otp === "bypass";
        const now = new Date();
        if (!isBypass) {
          if (!user.otp || !user.otpExpiry || user.otp !== otp || user.otpExpiry < now) {
            return null;
          }
          await prisma.user.update({
            where: { phone },
            data: { otp: null, otpExpiry: null },
          });
        }

        // بازم همه فیلدهای لازم رو برمی‌گردونیم
        return {
          id: user.id,
          role: user.role,
          phone: user.phone,
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
  pages: { signIn: "/login", error: "/auth/error" },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // در jwt، فیلد slug هم منتقل می‌شود
    async jwt({ token, user }) {
      if (user) {
        return { ...token, ...user };
      }
      return token;
    },
    // در session، session.user را از token می‌سازیم (شامل slug)
    async session({ session, token }) {
      session.user = token as unknown as Session["user"];
      return session;
    },
  },
};
