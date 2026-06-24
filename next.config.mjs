/** @type {import("next").NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: { ignoreBuildErrors: false },
  productionBrowserSourceMaps: false,
  images: { formats: ["image/avif", "image/webp"] },
};

export default nextConfig;
