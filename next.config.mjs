import 'dotenv/config';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "8tt3ypdflkc4itj6.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "s.gravatar.com", // ✅ Agregado para permitir imágenes de gravatar
      },
      {
        protocol: "https",
        hostname: "cdn.auth0.com", // ✅ También añadimos auth0 por si las imágenes vienen de ahí
      },
    ],
  },
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Configura el límite de tamaño del body aquí
    },
  },
};

export default nextConfig;
