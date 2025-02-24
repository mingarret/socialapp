"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import LikeButton from "./like-button";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { handleGetComments } from "../lib/action";
import Skeleton from "../ui/Skeleton";

export default function Post({ 
  post_id, 
  user_id, 
  username, 
  picture, 
  content, 
  url, 
  likeCount, 
  isLikedInitial, 
  created_at 
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [commentCount, setCommentCount] = useState(0);

  // ✅ Formato de fecha legible
  const formattedDate = created_at 
    ? formatDistanceToNow(new Date(created_at), { addSuffix: true, locale: es }) 
    : "Fecha desconocida";

  // 🔄 Obtener comentarios y contar el total
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const comments = await handleGetComments(post_id);
        setCommentCount(comments.length);
      } catch (error) {
        console.error("❌ Error al obtener comentarios:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchComments();
  }, [post_id]);

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl bg-white p-6 rounded-xl shadow-2xl mb-12">
      
      {/* 🧑‍💻 Usuario */}
      <div className="flex items-center gap-3">
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
            <Image src={picture || "/default-avatar.png"} alt={username || "Usuario"} width={40} height={40} className="rounded-full" />
            <div className="flex flex-col">
              {/* 🔹 Enlace al perfil del usuario */}
              <Link href={`/profile/${user_id}`} className="font-bold text-sm text-black hover:text-blue-500 transition">
                {username}
              </Link>
              <span className="text-xs text-gray-500">{formattedDate}</span>
            </div>
          </>
        )}
      </div>

      {/* 📸 Imagen del post con modal ampliado */}
      {isLoading ? (
        <Skeleton width="500px" height="300px" className="w-full" />
      ) : url && (
        <div className="overflow-hidden rounded-lg cursor-zoom-in hover:scale-105 transition-transform">
          <Image src={url} alt="Post" width={500} height={500} className="rounded-lg object-cover" />
        </div>
      )}

      {/* ❤️ Iconos de interacción */}
      <div className="flex justify-between items-center px-2">
        <LikeButton post_id={post_id} user_id={user_id} isLikedInitial={isLikedInitial} />

        {isLoading ? (
          <Skeleton width="100px" height="16px" />
        ) : (
          <Link href={`/post/${post_id}`} className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-blue-500 transition">
            <ChatBubbleLeftIcon className="h-7 w-7" />
            {commentCount > 0 ? `${commentCount} comentarios` : "Sin comentarios"}
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
    </div>
  );
}
