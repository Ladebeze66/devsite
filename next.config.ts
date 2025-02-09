/** @type {import('next').NextConfig} */

require("dotenv").config();

console.log("🔍 Vérification NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);


const nextConfig = {
  reactStrictMode: true,
  compress: false,  // ❌ Désactive la compression Gzip pour éviter les erreurs IIS
  trailingSlash: true,

  // Utilisation de l'API URL dynamique pour Strapi
  async rewrites() {
    return [
      {
        source: "/api/:path*", 
        destination: process.env.NEXT_PUBLIC_API_URL + "/api/:path*", 
      },
    ];
  },

  images: {
    domains: ["localhost", "api.fernandgrascalvet.com"], // ✅ Autorise aussi l'API en HTTPS
  },
};

module.exports = nextConfig;
