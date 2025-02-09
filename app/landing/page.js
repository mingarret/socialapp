"use client";

import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* 🌟 Logo y título */}
      <div className="flex items-center gap-3 mb-8">
        <Image src="/uploads/instagram-logo.png" alt="Social App" width={50} height={50} />
        <h1 className="text-3xl font-bold">Social App</h1>
      </div>

      {/* ✨ Slogan */}
      {/*<h2 className="text-xl text-gray-300 mb-6 text-center">
        Comparte tus momentos con el mundo 🌍  
      </h2>*/}

      {/* 📸 Imagen de portada */}
      <div className="w-80 h-80 bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        <Image src="/uploads/photo-collage.jpeg" alt="Landing" width={320} height={320} className="object-cover" />
      </div>

      {/* 🔥 Botones de acción */}
      <div className="flex gap-4">
        <Link href="/auth/login" className="bg-indigo-500 px-6 py-2 rounded-lg text-white font-semibold hover:bg-indigo-600 transition">
          Iniciar sesión
        </Link>
        <Link href="/auth/register" className="border border-indigo-400 px-6 py-2 rounded-lg text-indigo-400 hover:bg-indigo-500 hover:text-white transition">
          Registrarse
        </Link>
      </div>

      {/* 👇 Pie de página */}
      <p className="mt-6 text-gray-500 text-sm">
        © {new Date().getFullYear()} Social App. Todos los derechos reservados.
      </p>
    </div>
  );
}
