"use client";

import { useState } from "react";
import Image from "next/image";
import SearchBar from "@/app/ui/search-bar";
import Modal from "@/app/ui/modal"; // ✅ Componente modal para ampliar el post

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]); // Lista de posts del usuario
  const [selectedPost, setSelectedPost] = useState(null); // Post seleccionado
  const [loading, setLoading] = useState(false);

  // 🔎 Buscar posts de un usuario
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setResults([]);

    try {
      const res = await fetch(`/api/search?query=${searchTerm}`);
      const data = await res.json();
      setResults(data.posts); // 🔹 Mostrar solo los posts del usuario
    } catch (error) {
      console.error("❌ Error en la búsqueda:", error);
    }
    
    setLoading(false);
  };

  // 🧹 Limpiar búsqueda
  const clearSearch = () => {
    setSearchTerm("");
    setResults([]);
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Buscar publicaciones por usuario</h1>

      {/* 🔎 Barra de búsqueda */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Buscar</button>
        <button type="button" onClick={clearSearch} className="bg-red-500 text-white px-4 py-2 rounded">Limpiar</button>
      </form>

      {/* 📌 Resultados de la búsqueda */}
      {loading && <p className="text-white mt-4">Cargando...</p>}

      <div className="mt-6 w-full max-w-4xl">
        {results.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {results.map((post) => (
              <div
              key={post.id}
              className="cursor-pointer"
              onClick={() => {
                console.log("Post seleccionado:", post); // 🔍 Verifica si el post se selecciona
                setSelectedPost(post);
              }}
            >
              <Image src={post.url} alt="Post" width={200} height={200} className="rounded-lg object-cover" />
            </div>
            
            ))}
          </div>
        ) : (
          !loading && <p className="text-gray-400 mt-4">No hay publicaciones</p>
        )}
      </div>

      {selectedPost && (
      <>
        {console.log("Mostrando modal con post:", selectedPost)}
        <Modal onClose={() => setSelectedPost(null)}>
          <div className="p-6 bg-white rounded-lg shadow-lg max-w-2xl">
            <h2 className="text-xl font-bold mb-2 text-black">{selectedPost.username}</h2>
            <Image src={selectedPost.url} alt="Post" width={500} height={500} className="rounded-lg object-cover" />
            <p className="text-gray-700 mt-4">{selectedPost.content}</p>
            <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded" onClick={() => setSelectedPost(null)}>Cerrar</button>
          </div>
        </Modal>
      </>
)}

    </div>
  );
}
