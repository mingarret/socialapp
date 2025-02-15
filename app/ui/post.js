"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChatBubbleLeftIcon, XMarkIcon } from "@heroicons/react/24/outline";
import LikeButton from "./like-button";
import { insertComment, getComments } from "../lib/action";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export default function Post({ post_id, user_id, username, picture, content, url, likeCount, isLikedInitial, created_at }) {
  const [isOpen, setIsOpen] = useState(false); // Modal de imagen ampliada
  const [commentModal, setCommentModal] = useState(false); // Modal para comentar
  const [viewCommentsModal, setViewCommentsModal] = useState(false); // Modal para ver comentarios
  const [comment, setComment] = useState(""); // Estado del comentario
  const [loading, setLoading] = useState(false); // Estado de carga
  const [comments, setComments] = useState([]); // Lista de comentarios
  const [commentCount, setCommentCount] = useState(0); // Contador de comentarios

  // ✅ Convertir `created_at` en un objeto Date válido
  const formattedDate = created_at ? new Date(created_at) : null;

  // 🔹 Obtener comentarios cuando el usuario abre el modal de comentarios
  useEffect(() => {
    if (viewCommentsModal) {
      fetchComments();
    }
  }, [viewCommentsModal]);

  // 🔹 Obtener comentarios cuando se monta el componente o cambia el post
  useEffect(() => {
    fetchComments();
  }, [post_id]);

  const fetchComments = async () => {
    try {
      const { comments, count } = await getComments(post_id);
      setComments(comments);
      setCommentCount(count);
    } catch (error) {
      console.error("❌ Error al obtener comentarios:", error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;

    setLoading(true);
    try {
      await insertComment(post_id, user_id, comment);
      setComment(""); // ✅ Limpia el campo de comentario
      setCommentModal(false); // ✅ Cierra el modal de comentarios
      await fetchComments(); // ✅ Actualiza comentarios en tiempo real
    } catch (error) {
      console.error("❌ Error al enviar el comentario:", error);
    }
    setLoading(false);
  };

  // 🔹 Cerrar modal con tecla ESC
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setCommentModal(false);
        setViewCommentsModal(false);
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full max-w-lg bg-white p-5 rounded-lg shadow-lg mb-10">
      
      {/* 🧑‍💻 Usuario */}
      <div className="flex items-center gap-3">
        <Image 
          src={picture || "/default-avatar.png"}  
          alt={username || "Usuario desconocido"} 
          width={40} 
          height={40} 
          className="rounded-full" 
        />
        <div className="flex flex-col">
          <span className="font-bold text-sm text-black">{username || "Desconocido"}</span>
          <span className="text-xs text-gray-500">
            {formattedDate ? formatDistanceToNow(formattedDate, { addSuffix: true, locale: es }) : "Fecha desconocida"}
          </span>
        </div>
      </div>

      {/* 📸 Imagen del post */}
      {url && (
        <div 
          className="overflow-hidden rounded-lg cursor-zoom-in hover:scale-105 transition-transform relative"
          onClick={() => setIsOpen(true)}
        >
          <Image src={url} alt="post" width={500} height={500} className="rounded-lg object-cover" />
        </div>
      )}

      {/* ❤️ Iconos de Interacción */}
      <div className="flex justify-between items-center px-2">
        <div className="flex items-center gap-2">
          <LikeButton post_id={post_id} user_id={user_id} isLikedInitial={isLikedInitial} />
        </div>
        <div className="flex items-center gap-2">
          <ChatBubbleLeftIcon
            className="h-7 w-7 cursor-pointer hover:text-blue-500 transition text-gray-700"
            onClick={() => setCommentModal(true)}
          />
          <span className="text-sm font-semibold text-gray-700">{commentCount} comentarios</span>
        </div>
      </div>

      {/* 💬 Enlace para ver todos los comentarios */}
      <p 
        className="text-sm text-blue-600 hover:underline cursor-pointer"
        onClick={() => setViewCommentsModal(true)}
      >
        Ver todos los comentarios
      </p>

      {/* 📜 Modal para ver todos los comentarios */}
      {viewCommentsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[600px] max-h-[500px] overflow-auto relative">
            <button className="absolute top-2 right-2 text-gray-600 hover:text-black" onClick={() => setViewCommentsModal(false)}>
              <XMarkIcon className="h-6 w-6" />
            </button>
            <h2 className="text-lg font-bold mb-4 text-black">Comentarios</h2>
            
            {comments.length > 0 ? (
              <ul className="space-y-4">
                {comments.map((cmt, index) => (
                  <li key={index} className="flex gap-3 p-2 border-b">
                    <Image src={cmt.picture || "/default-avatar.png"} alt={cmt.username} width={30} height={30} className="rounded-full" />
                    <div>
                      <span className="font-bold text-sm">{cmt.username}</span>
                      <p className="text-gray-700">{cmt.content}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No hay comentarios todavía.</p>
            )}
          </div>
        </div>
      )}

      {/* 🖊️ Modal para comentar */}
      {commentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button className="absolute top-2 right-2 text-gray-600 hover:text-black" onClick={() => setCommentModal(false)}>
              <XMarkIcon className="h-6 w-6" />
            </button>
            <h2 className="text-lg font-bold mb-4 text-black">Escribe un comentario</h2>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2 border rounded-lg text-black"
              placeholder="Escribe tu comentario aquí..."
            />
            <button 
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
              onClick={handleCommentSubmit}
              disabled={loading}
            >
              {loading ? "Guardando..." : "Comentar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
