/** @type {import('next').NextConfig} */
const nextConfig = {
  // Active le mode strict de React pour signaler des erreurs potentielles
  reactStrictMode: true,
  experimental: {
    appDir: true, // ✅ Assurez-vous que cette ligne est bien présente
  },

  // Gestion des réécritures d'URL pour proxy local vers le backend
  async rewrites() {
    return [
      {
        source: "/api/:path*", // Toute URL commençant par /api
        destination: "http://localhost:1337/api/:path*", // Redirige vers votre backend Strapi
      },
    ];
  },

  // Optimisation des fichiers statiques
  images: {
    domains: ["localhost"], // Permet de charger les images provenant de "localhost" si nécessaire
  },
};

export default nextConfig;

