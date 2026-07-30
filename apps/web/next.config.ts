import type { NextConfig } from "next";
import path from "path";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Rewrites vers la realtime-gateway et l'API NestJS en développement.
  // En production ces URLs sont remplacées par les variables d'environnement.
  async rewrites() {
    return [
      {
        source: "/api/gateway/:path*",
        destination:
          process.env.NEXT_PUBLIC_GATEWAY_URL
            ? `${process.env.NEXT_PUBLIC_GATEWAY_URL}/:path*`
            : "http://localhost:3001/:path*",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  turbopack: {
    resolveAlias: {
      '@': path.resolve(__dirname, './src'),
      '@/lib': path.resolve(__dirname, '../lib'),
      '@/components': path.resolve(__dirname, '../components'),
      '@/hooks': path.resolve(__dirname, '../hooks'),
      '@/types': path.resolve(__dirname, '../types'),
      '@/domain': path.resolve(__dirname, '../domain'),
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './src'),
      '@/lib': path.resolve(__dirname, '../lib'),
      '@/components': path.resolve(__dirname, '../components'),
      '@/hooks': path.resolve(__dirname, '../hooks'),
      '@/types': path.resolve(__dirname, '../types'),
      '@/domain': path.resolve(__dirname, '../domain'),
    };
    return config;
  },
};

export default withSentryConfig(
  nextConfig,
  {
    silent: true,
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    widenClientFileUpload: true,
  }
);
