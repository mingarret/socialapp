import { getUserProfile, getUserPosts, getUserComments, getUserLikes } from "@/app/lib/action";
import Image from "next/image";

export default async function UserProfilePage({ params }) {
  const { user_id } = params;
  const profile = await getUserProfile(user_id);
  const posts = await getUserPosts(user_id);
  const comments = await getUserComments(user_id);
  const likes = await getUserLikes(user_id);

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md mt-6 space-y-8">
      {/* 🔹 Información del Usuario */}
      <div className="flex items-center gap-4">
        <Image src={profile.picture || "/default-avatar.png"} alt={profile.username} width={80} height={80} className="rounded-full" />
        <div>
          <h1 className="text-2xl font-bold text-black">{profile.username}</h1>
          <p className="text-gray-500">{profile.email}</p>
        </div>
      </div>

      {/* 🔹 Publicaciones del usuario */}
      <div>
        <h2 className="text-xl font-semibold text-black mb-4">Publicaciones</h2>
        {posts.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {posts.map((post) => (
              <Image key={post.post_id} src={post.url} alt="Post" width={150} height={150} className="rounded-lg" />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No ha publicado nada aún.</p>
        )}
      </div>

      {/* 🔹 Comentarios del usuario */}
      <div>
        <h2 className="text-xl font-semibold text-black mb-4">Comentarios</h2>
        {comments.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {comments.map((comment) => (
              <div key={comment.comment_id} className="p-4 border rounded-lg bg-gray-100">
                <Image src={comment.post_image || "/default-placeholder.png"} alt="Post comentado" width={150} height={150} className="rounded-lg mb-2" />
                <p className="text-black">{comment.content}</p>
                <span className="text-gray-500 text-sm">En: {comment.post_title || "Publicación desconocida"}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No ha comentado nada aún.</p>
        )}
      </div>

      {/* 🔹 Likes del usuario */}
      <div>
        <h2 className="text-xl font-semibold text-black mb-4">Likes</h2>
        {likes.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {likes.map((like) => (
              <Image key={like.post_id} src={like.url} alt="Post likeado" width={150} height={150} className="rounded-lg" />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No ha dado like a ninguna publicación.</p>
        )}
      </div>
    </div>
  );
}
