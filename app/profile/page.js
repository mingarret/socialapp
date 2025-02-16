"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getUserProfile, getUserPosts, getUserComments, getUserLikes } from "@/app/lib/action";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("posts");
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const profile = await getUserProfile();
        if (!profile) throw new Error("No se pudo obtener el perfil");

        setUser(profile);

        if (profile.user_id) {
          setPosts(await getUserPosts(profile.user_id));
          setComments(await getUserComments(profile.user_id));
          setLikes(await getUserLikes(profile.user_id));
        }
      } catch (error) {
        console.error("❌ Error cargando datos del perfil:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <p className="text-white text-center mt-10">Cargando perfil...</p>;
  if (!user) return <p className="text-white text-center mt-10">Error al cargar el perfil</p>;

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-lg shadow-md mt-10 min-h-[600px]">
      {/* 🔹 Información del Usuario */}
      <div className="flex items-center gap-6 mb-8">
        <Image src={user.picture || "/default-avatar.png"} alt="Perfil" width={100} height={100} className="rounded-full" />
        <div>
          <h2 className="text-3xl font-bold text-black">{user.name}</h2>
          <p className="text-gray-600 text-lg">{user.email}</p>
        </div>
      </div>

      {/* 🔹 Tabs de Navegación */}
      <div className="flex border-b mb-8 text-lg">
        {["posts", "comments", "likes"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === tab ? "border-b-4 border-blue-500 text-blue-500" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab === "posts" ? "Publicaciones" : tab === "comments" ? "Comentarios" : "Likes"}
          </button>
        ))}
      </div>

      {/* 🔹 Contenido de cada tab */}
      <div className="min-h-[400px]">
        {activeTab === "posts" && (
          <div className="grid grid-cols-3 gap-6">
            {posts.length > 0 ? (
              posts.map((post) => (
                <Image key={post.post_id} src={post.url} alt="Post" width={200} height={200} className="rounded-lg" />
              ))
            ) : (
              <p className="text-gray-500">No has publicado nada aún.</p>
            )}
          </div>
        )}

        {activeTab === "comments" && (
          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.comment_id} className="p-4 border rounded-lg bg-gray-100">
                  <p className="text-black">{comment.content}</p>
                  <span className="text-gray-500 text-sm">En: {comment.post_title || "Publicación desconocida"}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No has comentado nada aún.</p>
            )}
          </div>
        )}

        {activeTab === "likes" && (
          <div className="grid grid-cols-3 gap-6">
            {likes.length > 0 ? (
              likes.map((like) => (
                <Image key={like.post_id} src={like.url} alt="Post Likeado" width={200} height={200} className="rounded-lg" />
              ))
            ) : (
              <p className="text-gray-500">No has dado like a ninguna publicación.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
