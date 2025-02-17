import Image from "next/image";
import { getPostsOfUser, getProfile } from "@/app/lib/data"; 

export default async function UserProfilePage({ params }) {
  const { user_name } = params; // ✅ Asegura que estás accediendo correctamente a params
  if (!user_name) {
    console.error("❌ Error: `user_name` no está definido.");
    return <p className="text-red-500">Error: Usuario no encontrado</p>;
  }

  const profile = await getProfile(user_name);

  if (!profile) {
    console.error("❌ Error: No se encontró el perfil de", user_name);
    return <p className="text-red-500">Usuario no encontrado</p>;
  }

  const posts = await getPostsOfUser(profile.user_id);

  return (
    <div>
      <div className="flex items-center gap-6 mb-8">
        <Image src={profile.picture || "/avatar-default.png"} alt="Perfil" width={100} height={100} className="rounded-full" />
        <div>
          <h2 className="text-3xl font-bold text-black">{profile.name}</h2>
          <p className="text-gray-600 text-lg">{profile.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Image key={post.post_id} src={post.url} alt="Post" width={200} height={200} className="rounded-lg" />
          ))
        ) : (
          <p className="text-gray-500">No has publicado nada aún.</p>
        )}
      </div>
    </div>
  );
}
