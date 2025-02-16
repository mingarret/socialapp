import { notFound } from "next/navigation";
import Image from "next/image";
import { getUserProfile, getUserPosts } from "@/app/lib/action";

export default async function UserProfilePage({ params }) {
  const { user_id } = params;
  
  // 🔹 Obtener datos del usuario y sus posts
  const user = await getUserProfile(user_id);
  const posts = await getUserPosts(user_id);

  if (!user) {
    return notFound(); // ⛔ Mostrar página 404 si el usuario no existe
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      {/* 🔹 Información del Usuario */}
      <div className="flex items-center gap-4 mb-6">
        <Image src={user.picture || "/default-avatar.png"} alt="Perfil" width={80} height={80} className="rounded-full" />
        <div>
          <h2 className="text-2xl font-bold text-black">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>

      {/* 🔹 Publicaciones del usuario */}
      <h3 className="text-xl font-semibold text-black mb-4">Publicaciones</h3>
      <div className="grid grid-cols-3 gap-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Image key={post.post_id} src={post.url} alt="Post" width={150} height={150} className="rounded-lg" />
          ))
        ) : (
          <p className="text-gray-500">Este usuario no ha publicado nada aún.</p>
        )}
      </div>
    </div>
  );
}
