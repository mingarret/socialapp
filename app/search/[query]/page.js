import { searchUsers } from "@/app/lib/data";
import Image from "next/image";
import Link from "next/link";

export default async function SearchResults({ params }) {
  const { query } = params;

  // 🔍 Obtener usuarios de la base de datos
  const users = await searchUsers(query);

  return (
    <div className="mt-6 w-full bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-lg font-bold text-black">Resultados para: "{query}"</h2>

      {users.length > 0 ? (
        <ul className="mt-4 space-y-4">
          {users.map((user) => (
            <li key={user.user_id} className="flex items-center gap-4">
              <Image 
                src={user.picture || "/default-avatar.png"} 
                alt={user.username} 
                width={40} 
                height={40} 
                className="rounded-full"
              />
              <Link 
                href={`/profile/${user.user_id}`} 
                className="text-blue-500 hover:underline"
              >
                {user.username}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 mt-4">No se encontraron usuarios.</p>
      )}
    </div>
  );
}
