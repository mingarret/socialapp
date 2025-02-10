"use client";

import { useEffect, useState } from "react";
import { getComments } from "../lib/data";
import Image from "next/image";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";

export default function CommentsModal({ post_id, onClose }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    async function fetchComments() {
      const data = await getComments(post_id);
      setComments(data);
    }
    fetchComments();
  }, [post_id]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Comentarios</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-gray-500 text-center">No hay comentarios todavía.</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.comment_id} className="flex items-center gap-3">
                <Image src={comment.picture || "/default-avatar.png"} alt={comment.username} width={30} height={30} className="rounded-full" />
                <div>
                  <p className="text-sm font-bold">{comment.username}</p>
                  <p className="text-sm text-gray-700">{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
