import { sql } from "@vercel/postgres";
import Image from "next/image";
import Link from "next/link";

export default async function SearchResults({ params }) {
  const { query } = params;

  // 🔍 Buscar usuarios en la base de datos
  const { rows: users } = await sql`
    SELECT user_id, username, picture FROM sa_users
    WHERE username ILIKE ${"%" + query + "%"}
    LIMIT 10
  `;

  return (
    <div className="mt-6 w-full bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-lg font-bold text-black">Resultados para: "{query}"</h2>

      {/* 🔄 Skeleton mientras carga */}
      {!users.length ? (
        <ul className="mt-4 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="flex items-center gap-4 animate-pulse">
              <div className="w-10 h-10 bg-gray-300 rounded-full" />
              <div className="w-32 h-4 bg-gray-300 rounded" />
            </li>
          ))}
        </ul>
      ) : (
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
              <Link href={`/profile/${user.user_id}`} className="text-blue-500 hover:underline">
                {user.username}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
