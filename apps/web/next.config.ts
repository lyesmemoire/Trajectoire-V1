import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Désactive le mode standalone sous Windows pour éviter l'erreur EPERM sur les liens symboliques
  output: process.platform === "win32" ? undefined : "standalone",
  // PDF extraction runs only in the Node.js runtime.
  // Keep PDF libraries outside the Next server bundle so their
  // internal module resolution remains Node-native.
  serverExternalPackages: [
    "pdf-parse",
    "pdfjs-dist",
    "pino",
    "pino-pretty",
    "thread-stream",
  ],
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
  // Production optimizations
  compress: true,
  productionBrowserSourceMaps: false,
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
