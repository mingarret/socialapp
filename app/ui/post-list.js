import { auth0 } from "../lib/auth0";
import { getPosts, getLikes } from "../lib/action";
import PostShort from "./post-short";

export default async function PostList() {
  const session = await auth0.getSession();
  const user_id = session?.user?.user_id; // ✅ El usuario autenticado

  const [posts, likes] = await Promise.all([getPosts(), getLikes(user_id)]);

  return (
    <div className="flex flex-col grow items-center gap-16 mt-24">
      {posts.map((post) => (
         <PostShort
          key={post.post_id}
          post_id={post.post_id}
          user_id={post.user_id}  // ✅ CORREGIDO: Ahora es el usuario que publicó el post
          username={post.username}
          picture={post.picture}
          content={post.content}
          url={post.url}
          created_at={post.created_at}  // ✅ Enviar `created_at` al componente
          likeCount={post.num_likes} //REVISAR SI LOS LIKES NO FUNCIONAN
          commentCount={post.commentcount} // ✅ Asegúrate de que la "C" coincide con lo devuelto en SQL
          isLikedInitial={likes.some((like) => like.post_id === post.post_id)}
       />
      
      ))}
    </div>
  );
}
