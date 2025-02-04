"use client";

import { useState, useEffect } from "react";//importar useState y useEffect 
import { HeartIcon, XMarkIcon } from "@heroicons/react/24/outline";//importar iconos de corazón y X
import { insertLike, removeLike, checkLike, countLikes, getUsersWhoLiked } from "../lib/action";//importar funciones de acción

export default function LikeButton({ post_id, user_id }) {
  const [liked, setLiked] = useState(false);//estado para saber si el usuario dio like
  const [likeCount, setLikeCount] = useState(0);//estado para contar los likes
  const [usersWhoLiked, setUsersWhoLiked] = useState([]);//estado para obtener los usuarios que dieron like
  const [showModal, setShowModal] = useState(false);//estado para mostrar el modal
  const [animate, setAnimate] = useState(false);//estado para animar el botón de like

  // Validar que `post_id` y `user_id` sean válidos
  if (!post_id || !user_id) {
    console.error("❌ Error en LikeButton: `post_id` o `user_id` son inválidos.", { post_id, user_id });
    return null;
  }

  // Obtener datos del like al cargar el componente
  useEffect(() => {
    const fetchLikeData = async () => {
      try {
        const hasLiked = await checkLike(post_id, user_id);
        const totalLikes = await countLikes(post_id);
        const users = await getUsersWhoLiked(post_id);

        setLiked(hasLiked);
        setLikeCount(totalLikes);
        setUsersWhoLiked(users);
      } catch (error) {
        console.error("❌ Error al obtener datos del like:", error);
      }
    };

    // Llamar a la función para obtener los datos
    fetchLikeData();
  }, [post_id, user_id]);

  
  // Manejar el evento de dar like
  const handleLike = async () => {
    try {
      if (!liked) {
        await insertLike(post_id, user_id);
        setLiked(true);
        setLikeCount((prev) => prev + 1);

        const totalLikes = await countLikes(post_id);
        const users = await getUsersWhoLiked(post_id);

        setLikeCount(totalLikes);
        setUsersWhoLiked(users);

        setAnimate(true);
        setTimeout(() => setAnimate(false), 300);
      }
    } catch (error) {
      console.error("❌ Error al insertar el like:", error);
    }
  };

  // Manejar el evento de eliminar like
  const handleUnlike = async () => {
    try {
      if (liked) {
        await removeLike(post_id, user_id);
        setLiked(false);
        setLikeCount((prev) => prev - 1);

        const totalLikes = await countLikes(post_id);
        const users = await getUsersWhoLiked(post_id);

        setLikeCount(totalLikes);
        setUsersWhoLiked(users);
      }
    } catch (error) {
      console.error("❌ Error al eliminar el like:", error);
    }
  };

  // Renderizar el botón de like
  return (
    <>
      <div className="relative flex items-center gap-2">
        {/* ❤️ Icono de Like */}
        <HeartIcon
          onClick={handleLike}
          onDoubleClick={handleUnlike} // Doble clic elimina el like
          className={`h-6 w-6 cursor-pointer transition-all duration-300 ${
            liked ? "text-red-500 fill-red-500" : "text-gray-500 hover:text-red-500"
          } ${animate ? "scale-125" : "scale-100"}`}
        />
  
        {/* 🔢 Contador de Likes */}
        <span className="text-sm font-semibold text-black relative z-10">{likeCount}</span>
      </div>

      {/* 🖼️ Modal con lista completa de usuarios */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4">Usuarios que dieron like</h2>
            <ul className="max-h-60 overflow-y-auto">
              {usersWhoLiked.map((user, index) => (
                <li key={index} className="flex items-center gap-2 p-2 border-b">
                  <img src={user.picture} alt={user.username} className="w-8 h-8 rounded-full" />
                  <span>{user.username}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
