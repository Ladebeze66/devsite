/** @type {import('next').NextConfig} */

require("dotenv").config();

console.log("🔍 Vérification NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.fernandgrascalvet.com";

const nextConfig = {
  reactStrictMode: true,
  compress: false,
  trailingSlash: false,


  async rewrites() {
    return [
      {
        source: "/api/:path*", 
        destination: `${API_URL}/api/:path*`,
      },
    ];
  },

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.fernandgrascalvet.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "1337",
        pathname: "/uploads/**",
      },
    ],
  },
};

module.exports = nextConfig;
