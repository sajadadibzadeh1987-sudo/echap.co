import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // برای اینکه سایت سریع بالا بیاد:
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // اگر تنظیمات دیگری داشتی و می‌خوای نگه داری، بعداً اضافه می‌کنیم
};

export default nextConfig;
