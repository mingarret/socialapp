import 'dotenv/config';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images:{
    domains:["8tt3ypdflkc4itj6.public.blob.vercel-storage.com"]
  },
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Configura el límite de tamaño del body aquí
    },
  },
};

export default nextConfig;
