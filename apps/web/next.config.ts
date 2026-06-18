import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
};

export default nextConfig;
