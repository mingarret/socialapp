"use client";

import { useState } from "react";
import Image from "next/image";
import { searchDatabase } from "../lib/action";
import Link from "next/link";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ users: [], posts: [] });

  // 🔍 Manejar la búsqueda en tiempo real
  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      const data = await searchDatabase(value);
      setResults(data);
    } else {
      setResults({ users: [], posts: [] });
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Buscar usuarios o publicaciones..."
        className="w-full p-3 border rounded-lg text-black"
      />

      {/* 🔹 Resultados */}
      {query.length > 2 && (
        <div className="absolute bg-white shadow-lg w-full rounded-lg mt-2 p-3 max-h-60 overflow-auto">
          {/* 🧑‍💻 Usuarios */}
          {results.users.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-2">Usuarios</h3>
              {results.users.map((user) => (
                <Link key={user.user_id} href={`/profile/${user.user_id}`} className="flex items-center gap-3 p-2 hover:bg-gray-200 rounded">
                  <Image src={user.picture || "/default-avatar.png"} alt={user.username} width={40} height={40} className="rounded-full" />
                  <span className="text-sm font-semibold text-black">{user.username}</span>
                </Link>
              ))}
            </div>
          )}

          {/* 📸 Publicaciones */}
          {results.posts.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-bold text-gray-700 mb-2">Publicaciones</h3>
              <div className="grid grid-cols-3 gap-2">
                {results.posts.map((post) => (
                  <Link key={post.post_id} href={`/post/${post.post_id}`} className="block">
                    <Image src={post.url} alt={post.content} width={100} height={100} className="rounded-lg object-cover w-full" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ❌ Si no hay resultados */}
          {results.users.length === 0 && results.posts.length === 0 && (
            <p className="text-sm text-gray-500">No se encontraron resultados.</p>
          )}
        </div>
      )}
    </div>
  );
}
