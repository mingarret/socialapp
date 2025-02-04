"use client";

import { useState } from "react";
import Image from "next/image";
import { HeartIcon, ChatBubbleLeftIcon, PaperAirplaneIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import LikeButton from "./like-button";

export default function Post({ post_id, user_id, content, url }) {
  const [isOpen, setIsOpen] = useState(false); // Estado para el modal de la imagen

  return (
    <div className="flex flex-col gap-4 w-full max-w-lg bg-white p-5 rounded-lg shadow-lg mb-16">  
      {/* 🧑‍💻 Usuario */}
      <div className="flex items-center gap-3">
        <Image src="/avatar.jpg" alt="avatar" width={40} height={40} className="rounded-full" />
        <div className="flex flex-col">
          <span className="font-bold text-sm">Ximillo</span>
          <span className="text-xs text-gray-500">1 día</span>
        </div>
      </div>

      {/* 📸 Imagen del post con efecto lupa */}
      <div 
        className="overflow-hidden rounded-lg cursor-zoom-in hover:scale-105 transition-transform relative"
        onClick={() => setIsOpen(true)}
      >
        <Image 
          src={url} 
          alt="post" 
          width={500} 
          height={500} 
          className="rounded-lg object-cover"
        />
        {/* 🔍 Icono de lupa al pasar el cursor */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <span className="bg-black bg-opacity-50 text-white p-2 rounded-full">🔍</span>
        </div>
      </div>

      {/* ❤️ Iconos de Interacción */}
      <div className="flex justify-between items-center px-2">
        <div className="flex gap-4">
          <LikeButton post_id={post_id} user_id={user_id} />
          <ChatBubbleLeftIcon className="h-7 w-7 cursor-pointer hover:text-blue-500 transition" />
        </div>
        <PaperAirplaneIcon className="h-7 w-7 cursor-pointer hover:text-gray-500 transition" />
      </div>

      {/* 📝 Descripción */}
      <p className="text-sm">
        <span className="font-bold">Ximillo</span> {content}
      </p>

      {/* 💬 Comentarios */}
      <Link href="#" className="text-sm text-gray-500 hover:underline">Ver los 33 comentarios</Link>

      {/* 🖊️ Input para comentar */}
      <div className="border-t pt-2 mt-2">
        <input className="w-full bg-transparent border-none focus:outline-none text-sm" type="text" placeholder="Añadir un comentario..." />
      </div>

      {/* 🖼️ Modal de Imagen Ampliada */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="relative">
            <button className="absolute top-2 right-2 text-white" onClick={() => setIsOpen(false)}>
              <XMarkIcon className="h-8 w-8" />
            </button>
            <Image src={url} alt="post" width={800} height={800} className="rounded-lg max-w-[90vw] max-h-[90vh]" />
          </div>
        </div>
      )}
    </div>
  );
}
