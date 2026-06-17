/** @type {import("next").NextConfig} */
const nextConfig = {
  output: 'standalone',
  swcMinify: false,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  productionBrowserSourceMaps: false,
  images: { formats: ["image/avif", "image/webp"] },
};

export default nextConfig;
