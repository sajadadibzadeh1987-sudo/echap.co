import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  // برای اینکه سایت سریع بالا بیاد:
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // مهم برای تصاویر (به‌خصوص روی سرور)
  images: {
    unoptimized: true,
  },

  // هدرهای امنیتی فقط در حالت production
  async headers() {
    if (!isProd) {
      // در محیط توسعه (localhost) هیچ CSP ست نکن
      return [];
    }

    const csp = [
      "default-src 'self'",
      "style-src 'self' 'unsafe-inline' https://www.openstreetmap.org",
      "font-src 'self' data:",
      "img-src 'self' blob: data: https://*.tile.openstreetmap.org https://www.openstreetmap.org",
      "script-src 'self' 'unsafe-inline' https://www.openstreetmap.org",
      "frame-src 'self' https://www.openstreetmap.org",
      "connect-src 'self'",
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: csp,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
