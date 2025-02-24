"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChatBubbleLeftIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid"; // ✅ Ícono de respuesta
import LikeButton from "./like-button";
import { format } from "timeago.js"; // ✅ Importamos timeago.js
import { addComment, handleDeleteComment } from "../lib/action";
import Skeleton from "../ui/Skeleton";

export default function PostDetail({ 
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
  created_at, 
  loggedUserId 
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // ✅ Usamos `timeago.js` para formatear la fecha
  const formattedDate = created_at ? format(new Date(created_at), "es") : "Fecha desconocida";

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl bg-white text-black p-6 rounded-xl shadow-2xl mb-12 md:mx-auto">
      
      {/* 🧑‍💻 Usuario */}
      <div className="flex items-center gap-3 flex-wrap">
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
      </div>

      {/* 📸 Imagen del post */}
      {url && (
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
        <div className="flex items-center gap-x-1 text-sm font-semibold text-gray-700">
          <ChatBubbleLeftIcon className="h-5 w-5" />
          <span>{commentCount > 0 ? `${commentCount} comentarios` : "Sin comentarios"}</span>
        </div>
      </div>

      {/* 📝 Descripción del post */}
      <p className="text-sm text-black">
        <span className="font-bold">{username}</span> {content}
      </p>

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

      {/* 📜 Lista de comentarios */}
      <div className="mt-6">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem 
              key={comment.comment_id} 
              comment={comment} 
              post_id={post_id} 
              loggedUserId={loggedUserId} 
              router={router} 
            />
          ))
        ) : (
          <p className="text-gray-500">No hay comentarios aún.</p>
        )}
      </div>
    </div>
  );
}

/* 🔄 Componente de comentario con opción de responder */
function CommentItem({ comment, post_id, loggedUserId, router }) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  // ✅ Formateamos la fecha del comentario con `timeago.js`
  const commentDate = format(new Date(comment.created_at), "es");

  const handleDelete = async () => {
    const response = await handleDeleteComment(comment.comment_id);
    if (response.success) {
      alert("Comentario eliminado");
      router.refresh(); // 🔄 Recargar la página para actualizar la lista de comentarios
    } else {
      alert(response.error);
    }
  };

  return (
    <div className="border-l-4 border-gray-300 pl-4 mb-4">
      <div className="flex justify-between items-start">
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
            <p className="text-gray-500 text-xs">{commentDate}</p> {/* ✅ Mostramos la fecha con `timeago.js` */}
            <p className="text-gray-700">{comment.content}</p>
          </div>
        </div>

        {/* ❌ Botón de eliminar comentario */}
        {comment.user_id === loggedUserId && (
          <button onClick={handleDelete} className="text-red-500 hover:text-red-700">
            <TrashIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* 🔁 Botón de Responder */}
      <button 
        onClick={() => setShowReplyForm(!showReplyForm)} 
        className="text-blue-500 flex items-center mt-1 hover:text-blue-700 text-sm"
      >
        <ArrowUturnLeftIcon className="h-4 w-4 mr-1" />
        Responder
      </button>

      {/* 📥 Formulario de respuesta */}
      {showReplyForm && (
        <form action={addComment} className="flex gap-2 mt-2 ml-10">
          <input type="hidden" name="post_id" value={post_id} />
          <input type="hidden" name="parent_id" value={comment.comment_id} />
          <input 
            name="content" 
            className="border rounded-lg p-2 flex-grow text-sm text-black" 
            placeholder="Escribe una respuesta..." 
            required 
          />
          <button type="submit" className="bg-gray-300 px-3 py-1 rounded text-sm">💬</button>
        </form>
      )}

      {/* 🔽 Renderizar respuestas dentro del comentario padre */}
      {comment.replies?.length > 0 && (
        <div className="ml-6 border-l-2 border-gray-300 pl-4 mt-2">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.comment_id} comment={reply} post_id={post_id} loggedUserId={loggedUserId} router={router} />
          ))}
        </div>
      )}
    </div>
  );
}

