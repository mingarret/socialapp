"use client";

import { useState, useEffect } from "react";
import { HeartIcon } from "@heroicons/react/24/solid";
import { insertLike, removeLike, checkLike, countLikes, getUsersWhoLiked } from "../lib/action";

export default function LikeButton({ post_id, user_id }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [usersWhoLiked, setUsersWhoLiked] = useState([]);
  const [showTooltip, setShowTooltip] = useState(false);

  if (!post_id || !user_id) {
    console.error("❌ Error en LikeButton: `post_id` o `user_id` son inválidos.", { post_id, user_id });
    return null;
  }

  // 🔹 Obtener estado inicial de likes
  useEffect(() => {
    const fetchLikeData = async () => {
      try {
        const hasLiked = await checkLike(post_id, user_id);
        const totalLikes = await countLikes(post_id);
        const users = await getUsersWhoLiked(post_id);

        setLiked(hasLiked);
        setLikeCount(parseInt(totalLikes, 10)); // 🔹 Asegurar que sea número
        setUsersWhoLiked(users);
      } catch (error) {
        console.error("❌ Error al obtener datos del like:", error);
      }
    };

    fetchLikeData();
  }, [post_id, user_id]);

  // 🔹 Manejar Like/Unlike con sincronización a la base de datos
  const handleLikeToggle = async () => {
    try {
      if (liked) {
        await removeLike(post_id, user_id);
      } else {
        await insertLike(post_id, user_id);
      }

      // 🔄 Obtener datos actualizados de la base de datos
      const totalLikes = await countLikes(post_id);
      const users = await getUsersWhoLiked(post_id);

      setLiked(!liked); // 🔹 Cambiar estado local después de confirmar con la DB
      setLikeCount(parseInt(totalLikes, 10)); // 🔹 Asegurar que sea número
      setUsersWhoLiked(users);
    } catch (error) {
      console.error("❌ Error al actualizar el like:", error);
    }
  };

  return (
    <div className="relative flex items-center gap-2">
      {/* ❤️ Icono de Like */}
      <HeartIcon
        onClick={handleLikeToggle}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`h-6 w-6 cursor-pointer transition-all duration-300 ${
          liked ? "text-red-500 fill-red-500" : "text-gray-500 hover:text-red-500"
        }`}
      />

      {/* 🔢 Contador de Likes */}
      <span className="text-sm font-semibold text-black">{likeCount}</span>

      {/* 🖼️ Tooltip con lista de usuarios */}
      {showTooltip && usersWhoLiked.length > 0 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white text-black text-xs p-2 rounded shadow-lg w-40 z-50">
          <h3 className="text-sm font-semibold mb-2">Usuarios que dieron like:</h3>
          <ul className="max-h-40 overflow-y-auto">
            {usersWhoLiked.map((user, index) => (
              <li key={index} className="flex items-center gap-2 p-2 border-b">
                <img src={user.picture || "/default-avatar.png"} alt={user.username} className="w-6 h-6 rounded-full" />
                <span>{user.username}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
