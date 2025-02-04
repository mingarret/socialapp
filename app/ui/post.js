"use client";

import Image from "next/image";
import Link from "next/link";
import { ChatBubbleOvalLeftIcon } from "@heroicons/react/24/outline";
import LikeButton from "./like-button"; // ✅ Importamos LikeButton correctamente

export default function Post({ post_id, user_id, content, url }) {
  if (!post_id || !user_id) {
    console.error("❌ Error en Post: `post_id` o `user_id` están vacíos.", { post_id, user_id });
    return <p className="text-center text-gray-500">❌ Error: Falta información del post.</p>;
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-md bg-white p-5 rounded-lg shadow-lg">
      {/* 🧑‍💻 Usuario */}
      <div className="flex items-center gap-3">
        <Image src="/akira.jpeg" alt="avatar" width={24} height={24} className="rounded-full" />
        <span className="font-bold text-sm">Ximo</span>
        <span className="text-xs text-gray-500">1 día</span>
      </div>

      {/* 📸 Imagen del post */}
      <div>
        <Image src={url} alt="post" width={448} height={448} className="rounded-lg object-cover" />
      </div>

      {/* ❤️ Iconos de Interacción */}
      <div className="flex gap-2 items-center">
        <LikeButton post_id={post_id} user_id={user_id} /> {/* ✅ Se usa LikeButton correctamente */}
        <ChatBubbleOvalLeftIcon className="h-6 w-6 cursor-pointer hover:text-blue-500 transition" />
        <span className="text-sm font-semibold">1234 Me gusta</span>
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
    </div>
  );
}
