/** @type {import('next').NextConfig} */

require("dotenv").config();

console.log("🔍 Vérification NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.fernandgrascalvet.com"; // ✅ Valeur par défaut sécurisée

const nextConfig = {
  reactStrictMode: true,
  compress: false, // ❌ Désactive Gzip pour éviter les erreurs IIS
  trailingSlash: false, // ❌ Peut causer des erreurs avec Next.js App Router, on le désactive

  // ✅ Empêche WebSocket HMR en HTTPS et force le polling pour éviter les erreurs
  webpackDevMiddleware: (config: any) => {
    config.watchOptions = {
      poll: 1000, // Vérifie les changements toutes les 1 seconde
      aggregateTimeout: 300,
    };
    return config;
  },

  // ✅ Rewrites pour Strapi (évite d'écrire l'URL complète dans chaque requête)
  async rewrites() {
    return [
      {
        source: "/api/:path*", 
        destination: `${API_URL}/api/:path*`, // ✅ Utilisation sécurisée de la variable d'API
      },
    ];
  },

  images: {
    domains: ["localhost", "api.fernandgrascalvet.com"], // ✅ Autorise les images locales et distantes
  },
};

module.exports = nextConfig;
