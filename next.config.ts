// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        port: "",
        pathname: "/t/p/**",
      },
    ],
  },
  // Configure SSR behavior
  compiler: {
    // Disable some optimizations that might cause SSR issues
    removeConsole: false,
  },
};

export default nextConfig;
