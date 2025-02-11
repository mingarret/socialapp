"use client";

import SearchBar from "@/app/ui/search-bar"; // 🔹 Todo en minúsculas
import { useState } from "react";
import Image from "next/image";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]); // Aquí irán los resultados

  // 🔎 Función de búsqueda (simulación)
  const handleSearch = async (e) => {
    e.preventDefault();
    console.log("Buscando:", searchTerm);
    setResults([
      { id: 1, username: "ximillo", picture: "/default-avatar.png", content: "Mi primer post" },
      { id: 2, username: "andrea", picture: "/default-avatar.png", content: "Explorando el mundo" },
    ]);
  };
  

  return (
    <div className="flex flex-col items-center mt-16">
      {/* 🔍 Input de búsqueda */}
      <h1 className="text-white text-2xl font-bold mb-4">Buscar en Social App</h1>
      <form onSubmit={handleSearch} className="relative w-full max-w-md">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar usuarios o publicaciones..."
          className="w-full bg-gray-800 text-white p-3 pl-12 rounded-lg outline-none border border-gray-600"
        />
        <MagnifyingGlassIcon className="absolute left-4 top-3 w-6 h-6 text-gray-400" />
      </form>

      {/* 📜 Resultados de búsqueda */}
      <div className="mt-6 w-full max-w-lg">
        {results.length > 0 ? (
          <ul className="space-y-4">
            {results.map((user) => (
              <li
                key={user.id}
                className="flex items-center bg-gray-900 p-4 rounded-lg shadow-md hover:bg-gray-800 transition"
              >
                <Image src={user.picture} alt={user.username} width={50} height={50} className="rounded-full" />
                <div className="ml-4">
                  <p className="text-white font-bold">{user.username}</p>
                  <p className="text-gray-400 text-sm">{user.content}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mt-4">No se encontraron resultados</p>
        )}
      </div>
    </div>
  );
}
