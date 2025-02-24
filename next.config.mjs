import 'dotenv/config';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s.gravatar.com",
      },
      {
        protocol: "https",
        hostname: "cdn.auth0.com",
      },
      {
        protocol: "https",
        hostname: "8tt3ypdflkc4itj6.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // ✅ Agregamos el dominio de Google User Content
      }
    ],
    domains: ["randomuser.me", "via.placeholder.com", "lh3.googleusercontent.com"], // ✅ También lo agregamos aquí por seguridad
  },
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Configura el límite de tamaño del body aquí
    },
  },
};

export default nextConfig;
