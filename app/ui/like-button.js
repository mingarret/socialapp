"use client";

import { useState, useEffect } from "react";
import { HeartIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { insertLike, removeLike, checkLike, countLikes, getUsersWhoLiked } from "../lib/action";

export default function LikeButton({ post_id, user_id }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [usersWhoLiked, setUsersWhoLiked] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [animate, setAnimate] = useState(false);

  // Validación de `post_id` y `user_id`
  if (!post_id || !user_id) {
    console.error("❌ Error en LikeButton: `post_id` o `user_id` son inválidos.", { post_id, user_id });
    return null;
  }

  // 🔹 Obtener estado inicial del like y conteo de likes
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

  // 🔹 Manejar Like/Unlike con un solo clic
  const handleLikeToggle = async () => {
    try {
      if (liked) {
        await removeLike(post_id, user_id);
        setLiked(false);
        setLikeCount((prev) => prev - 1);
      } else {
        await insertLike(post_id, user_id);
        setLiked(true);
        setLikeCount((prev) => prev + 1);

        // 🔹 Animación de like
        setAnimate(true);
        setTimeout(() => setAnimate(false), 300);
      }

      // 🔄 Actualizar usuarios que han dado like
      const users = await getUsersWhoLiked(post_id);
      setUsersWhoLiked(users);
    } catch (error) {
      console.error("❌ Error al actualizar el like:", error);
    }
  };

  return (
    <>
      <div className="relative flex items-center gap-2">
        {/* ❤️ Icono de Like */}
        <HeartIcon
          onClick={handleLikeToggle} // 🔹 Un solo clic maneja Like/Unlike
          className={`h-6 w-6 cursor-pointer transition-all duration-300 ${
            liked ? "text-red-500 fill-red-500" : "text-gray-500 hover:text-red-500"
          } ${animate ? "scale-125" : "scale-100"}`}
        />

        {/* 🔢 Contador de Likes con Hover para mostrar Modal */}
        <span
          className="text-sm font-semibold text-black cursor-pointer relative z-10"
          onMouseEnter={() => setShowModal(true)}
          onMouseLeave={() => setShowModal(false)}
        >
          {likeCount} Me gusta
        </span>

        {/* 🖼️ Modal con lista de usuarios que dieron like */}
        {showModal && usersWhoLiked.length > 0 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white text-black text-xs p-2 rounded shadow-lg w-40 z-50">
            <h3 className="text-sm font-semibold mb-2">Usuarios que dieron like:</h3>
            <ul className="max-h-40 overflow-y-auto">
              {usersWhoLiked.map((user, index) => (
                <li key={index} className="flex items-center gap-2 p-2 border-b">
                  <img src={user.picture} alt={user.username} className="w-6 h-6 rounded-full" />
                  <span>{user.username}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
