"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import LikeButton from "./like-button";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { addComment, handleGetComments } from "../lib/action";
import Skeleton from "../ui/Skeleton"; // 🔹 Importamos Skeleton

export default function Post({ 
  post_id, 
  user_id, 
  username, 
  picture, 
  content, 
  url, 
  likeCount, 
  commentCount,
  isLikedInitial, 
  comments = [],
  created_at 
}) {
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Formatear fecha legible
  const formattedDate = created_at 
    ? formatDistanceToNow(new Date(created_at), { addSuffix: true, locale: es }) 
    : "Fecha desconocida";

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl bg-white text-black p-6 rounded-xl shadow-2xl mb-12 md:mx-auto">
      
      {/* 🧑‍💻 Usuario */}
      <div className="flex items-center gap-3 flex-wrap">
        {isLoading ? (
          <>
            <Skeleton height="40px" width="40px" className="rounded-full" />
            <div className="flex flex-col">
              <Skeleton width="120px" height="16px" />
              <Skeleton width="90px" height="12px" />
            </div>
          </>
        ) : (
          <>
            <Image 
              src={picture || "/default-avatar.png"} 
              alt={username} 
              width={40} 
              height={40} 
              className="rounded-full object-cover"
            />
            <div className="flex flex-col">
              <span className="font-bold text-sm text-black">{username}</span>
              <span className="text-xs text-gray-500">{formattedDate}</span>
            </div>
          </>
        )}
      </div>

      {/* 📸 Imagen del post */}
      {isLoading ? (
        <Skeleton height="300px" className="w-full" />
      ) : url && (
        <div className="overflow-hidden rounded-lg cursor-zoom-in hover:scale-105 transition-transform">
          <Image 
            src={url} 
            alt="Post" 
            width={500} 
            height={500} 
            className="rounded-lg object-cover w-full max-w-full"
          />
        </div>
      )}

      {/* ❤️ Iconos de interacción */}
      <div className="flex justify-between items-center px-2 flex-wrap">
        <LikeButton post_id={post_id} user_id={user_id} isLikedInitial={isLikedInitial} />

        {isLoading ? (
          <Skeleton width="100px" height="16px" />
        ) : (
          <Link href={`/post/${post_id}`} className="flex items-center gap-x-1 text-sm font-semibold text-gray-700 hover:text-blue-500 transition">
            <ChatBubbleLeftIcon className="h-5 w-5" />
            <span>{commentCount > 0 ? `${commentCount} comentarios` : "Sin comentarios"}</span>
          </Link>
        )}
      </div>

      {/* 📝 Descripción del post */}
      {isLoading ? (
        <Skeleton height="60px" className="w-full" />
      ) : (
        <p className="text-sm text-black">
          <span className="font-bold">{username}</span> {content}
        </p>
      )}

      {/* 📝 Formulario para agregar comentarios */}
      <form action={addComment} className="flex gap-2 mt-4">
        <input type="hidden" name="post_id" value={post_id} />
        <input 
          name="content" 
          className="border rounded-lg p-2 flex-grow text-black" 
          placeholder="Escribe un comentario..." 
          required 
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Enviar</button>
      </form>

      {/* 📜 Lista de comentarios en cascada */}
      <div className="mt-6">
        {isLoading ? (
          <>
            <Skeleton height="80px" className="w-full" />
            <Skeleton height="80px" className="w-full" />
          </>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem key={comment.comment_id} comment={comment} post_id={post_id} />
          ))
        ) : (
          <p className="text-gray-500">No hay comentarios aún.</p>
        )}
      </div>
    </div>
  );
}

/* 🔄 Componente recursivo para mostrar comentarios en cascada */
function CommentItem({ comment, post_id }) {
  const handleReply = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    await addComment(formData);
    event.target.reset();
  };

  return (
    <div className="border-l-4 border-gray-300 pl-4 mb-4">
      <div className="flex items-center gap-3 flex-wrap">
        <Image 
          src={comment.picture || "/default-avatar.png"} 
          alt="Avatar" 
          width={30} 
          height={30} 
          className="rounded-full object-cover"
        />
        <div>
          <p className="font-bold text-sm">{comment.username}</p>
          <p className="text-gray-700">{comment.content}</p>
        </div>
      </div>

      {/* ✏️ Formulario para responder */}
      <form onSubmit={handleReply} className="flex gap-2 mt-2 ml-10">
        <input type="hidden" name="post_id" value={post_id} />
        <input type="hidden" name="parent_id" value={comment.comment_id} />
        <input 
          name="content" 
          className="border rounded-lg p-2 flex-grow text-sm text-black" 
          placeholder="Responder..." 
          required 
        />
        <button type="submit" className="bg-gray-300 px-3 py-1 rounded text-sm">💬</button>
      </form>

      {/* 🔽 Renderizar respuestas dentro del comentario padre */}
      {comment.replies?.length > 0 && (
        <div className="ml-6 border-l-2 border-gray-300 pl-4 mt-2">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.comment_id} comment={reply} post_id={post_id} />
          ))}
        </div>
      )}
    </div>
  );
}
