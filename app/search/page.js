"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import SearchBar from "@/app/ui/search-bar";
import Modal from "@/app/ui/modal";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]); // 🔹 Lista de usuarios encontrados
  const [posts, setPosts] = useState([]); // 🔹 Lista de posts del usuario
  const [selectedPost, setSelectedPost] = useState(null); // 🔹 Post seleccionado
  const [loading, setLoading] = useState(false);

  // 🔎 Buscar usuarios y sus publicaciones al escribir en la barra de búsqueda
  useEffect(() => {
    if (!searchTerm.trim()) {
      setUsers([]);
      setPosts([]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?query=${searchTerm}`);
        const data = await res.json();

        setUsers(data.users || []); // Asegurar que `users` siempre sea un array
        setPosts(data.posts || []); // Asegurar que `posts` siempre sea un array
      } catch (error) {
        console.error("❌ Error en la búsqueda:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [searchTerm]);

  // 🧹 Limpiar búsqueda correctamente
  const clearSearch = () => {
    setSearchTerm("");
    setUsers([]);
    setPosts([]);
  };

  return (
    <div className="flex flex-col items-center p-10 max-w-6xl mx-auto bg-white shadow-lg rounded-lg mt-10 min-h-[700px]">
      <h1 className="text-3xl font-bold text-black mb-6">Buscar Publicaciones por Usuario</h1>

      {/* 🔎 Barra de búsqueda */}
      <div className="flex gap-4 w-full max-w-2xl">
        <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <button type="button" onClick={clearSearch} className="bg-red-500 text-white px-5 py-3 rounded-lg hover:bg-red-600">
          Limpiar
        </button>
      </div>

      {/* 📌 Resultados de la búsqueda */}
      {loading && <p className="text-gray-500 mt-6">Cargando...</p>}

      <div className="mt-6 w-full max-w-5xl">
        {/* 🔹 Mostrar usuarios encontrados */}
        {users.length > 0 && (
          <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
            <h2 className="text-lg font-semibold text-black mb-2">Usuarios</h2>
            {users.map((user) => (
              <a 
                key={user.user_id} 
                href={`/profile/${user.user_id}`} 
                className="flex items-center gap-4 p-2 hover:bg-gray-200 rounded-lg cursor-pointer"
              >
                <Image src={user.picture || "/default-avatar.png"} alt={user.username} width={40} height={40} className="rounded-full" />
                <span className="text-black">{user.username}</span>
              </a>
            ))}
          </div>
        )}

        {/* 🔹 Mostrar publicaciones del usuario */}
        {posts.length > 0 && (
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-black mb-2">Publicaciones</h2>
            <div className="grid grid-cols-3 gap-6">
              {posts.map((post) => (
                <div
                  key={post.post_id}
                  className="cursor-pointer transform transition duration-200 hover:scale-105"
                  onClick={() => setSelectedPost(post)}
                >
                  <Image src={post.url} alt="Post" width={250} height={250} className="rounded-lg object-cover shadow-md" />
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && users.length === 0 && posts.length === 0 && searchTerm && (
          <p className="text-gray-500 mt-6 text-lg">No se encontraron resultados</p>
        )}
      </div>

      {/* 🖼️ Modal para ampliar el post */}
      {selectedPost && (
        <Modal onClose={() => setSelectedPost(null)}>
          <div className="p-8 bg-white rounded-lg shadow-xl max-w-3xl">
            <h2 className="text-2xl font-bold mb-4 text-black">{selectedPost.username}</h2>
            <Image src={selectedPost.url} alt="Post" width={600} height={600} className="rounded-lg object-cover" />
            <p className="text-gray-700 mt-4">{selectedPost.content}</p>
            <button
              className="mt-6 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
              onClick={() => setSelectedPost(null)}
            >
              Cerrar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
