import Image from "next/image";
import { getUserProfile, getUserPosts, getUserComments, getUserLikes } from "@/app/lib/action";

export default async function ProfilePage() {
  const profile = await getUserProfile(); // Obtiene el usuario logueado
  if (!profile) return <h1 className="text-black">Usuario no encontrado</h1>;

  const posts = await getUserPosts(profile.user_id);
  const comments = await getUserComments(profile.user_id);
  const likes = await getUserLikes(profile.user_id);

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-lg shadow-md mt-10 min-h-[600px]">
      <div className="flex items-center gap-4 mb-6">
        <Image src={profile.picture || "/avatar-default.png"} alt={profile.username} width={80} height={80} className="rounded-full" />
        <div>
          <h2 className="text-2xl font-bold text-black">{profile.username}</h2>
          <p className="text-gray-500">{profile.email}</p>
        </div>
      </div>

      <section>
        <h3 className="text-xl font-semibold text-black mb-4">Publicaciones</h3>
        <div className="grid grid-cols-3 gap-4">
          {posts.length > 0 ? (
            posts.map((post) => <Image key={post.post_id} src={post.url} alt="Post" width={150} height={150} className="rounded-lg" />)
          ) : (
            <p className="text-gray-500">No has publicado nada aún.</p>
          )}
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold text-black mb-4">Comentarios</h3>
        <div className="grid grid-cols-3 gap-4">
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
      </section>

      <section>
        <h3 className="text-xl font-semibold text-black mb-4">Likes</h3>
        <div className="grid grid-cols-3 gap-4">
          {likes.length > 0 ? (
            likes.map((like) => <Image key={like.post_id} src={like.url} alt="Post Likeado" width={150} height={150} className="rounded-lg" />)
          ) : (
            <p className="text-gray-500">No has dado like a ninguna publicación.</p>
          )}
        </div>
      </section>
    </div>
  );
}
