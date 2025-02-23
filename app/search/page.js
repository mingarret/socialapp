import { redirect } from "next/navigation";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function SearchPage() {
  async function searchUser(formData) {
    "use server";
    const query = formData.get("query");
    if (query.trim()) redirect(`/search/${query}`);
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 px-4"> 
      {/* 🔹 Fondo gris oscuro como el resto de la app */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center text-white mb-6 flex items-center gap-2">
          🔍 Busca un usuario
        </h2>

        <form action={searchUser} className="flex items-center border border-gray-600 rounded-lg overflow-hidden shadow-sm">
          <input
            type="text"
            name="query"
            placeholder="Escribe un nombre de usuario..."
            className="flex-grow p-3 text-white bg-gray-700 outline-none placeholder-gray-400"
          />
          <button type="submit" className="bg-blue-500 text-white px-5 py-3 hover:bg-blue-600 transition">
            <MagnifyingGlassIcon className="h-6 w-6" />
          </button>
        </form>
      </div>
    </div>
  );
}
