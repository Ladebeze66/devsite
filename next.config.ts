/** @type {import('next').NextConfig} */

require("dotenv").config();

console.log("🔍 Vérification NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.fernandgrascalvet.com";

const nextConfig = {
  reactStrictMode: true,
  compress: false,
  trailingSlash: false,

  webpackDevMiddleware: (config: any) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*", 
        destination: `${API_URL}/api/:path*`,
      },
    ];
  },

  images: {
    domains: ["localhost", "api.fernandgrascalvet.com"],
  },
};

module.exports = nextConfig;
