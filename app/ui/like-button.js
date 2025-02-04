"use client";

import { useState, useEffect } from "react";
import { HeartIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { insertLike, checkLike, countLikes, getUsersWhoLiked } from "../lib/action";

export default function LikeButton({ post_id, user_id }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [usersWhoLiked, setUsersWhoLiked] = useState([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showModal, setShowModal] = useState(false); // Estado para el modal
  const [animate, setAnimate] = useState(false); // Estado para animación de like

  if (!post_id || !user_id) {
    console.error("❌ Error en LikeButton: `post_id` o `user_id` son inválidos.", { post_id, user_id });
    return null;
  }

  // 🛠 Obtener estado inicial (si el usuario ya ha dado like y cuántos hay)
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

    fetchLikeData();
  }, [post_id, user_id]);

  // 🛠 Manejar el Like
  const handleLike = async () => {
    try {
      if (!liked) {
        await insertLike(post_id, user_id);
        setLiked(true);
        setLikeCount((prev) => prev + 1);

        // 🔄 Actualizar datos
        const totalLikes = await countLikes(post_id);
        const users = await getUsersWhoLiked(post_id);

        setLikeCount(totalLikes);
        setUsersWhoLiked(users);

        // 🔹 Activar animación
        setAnimate(true);
        setTimeout(() => setAnimate(false), 300);
      }
    } catch (error) {
      console.error("❌ Error al insertar el like:", error);
    }
  };

  return (
    <>
      <div className="relative flex items-center gap-2">
        {/* ❤️ Icono de Like */}
        <HeartIcon
          onClick={handleLike}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onDoubleClick={() => setShowModal(true)} // 🔹 Abrir modal con doble clic
          className={`h-6 w-6 cursor-pointer transition ${
            liked ? "text-red-500" : "text-gray-500"
          } hover:text-red-500 ${animate ? "scale-125" : "scale-100"}`}
        />
        <span className="text-sm font-semibold">{likeCount}</span>

        {/* 🔹 Tooltip con nombres de los primeros usuarios */}
        {showTooltip && usersWhoLiked.length > 0 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white text-black text-xs p-2 rounded shadow-lg w-40">
            {usersWhoLiked.slice(0, 5).map((user, index) => (
              <div key={index} className="truncate">
                {user.username}
              </div>
            ))}
          </div>
        )}
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
