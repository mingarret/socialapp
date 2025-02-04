"use client";

import { insertLike } from "../lib/action";
import { HeartIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function LikeButton({ post_id, user_id }) {
  const [liked, setLiked] = useState(false);

  if (!post_id || !user_id) {
    console.error("❌ Error en LikeButton: `post_id` o `user_id` son inválidos.", { post_id, user_id });
    return null;
  }

  const handleLike = async () => {
    try {
      await insertLike(post_id, user_id);
      setLiked(true);
    } catch (error) {
      console.error("❌ Error al insertar el like:", error);
    }
  };

  return (
    <HeartIcon
      onClick={handleLike}
      className={`h-6 w-6 cursor-pointer ${liked ? "text-red-500" : "text-gray-500"} hover:text-red-500 transition`}
    />
  );
}
