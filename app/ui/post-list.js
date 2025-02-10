import { auth0 } from "../lib/auth0";
import { getPosts, getLikes } from "../lib/action";
import Post from "./post";

export default async function PostList() {
  const session = await auth0.getSession();
  const user_id = session?.user?.user_id; // ✅ El usuario autenticado

  const [posts, likes] = await Promise.all([getPosts(), getLikes(user_id)]);

  return (
    <div className="flex flex-col grow items-center gap-16 mt-24">
      {posts.map((post) => (
        <Post
          key={post.post_id}
          post_id={post.post_id}
          user_id={user_id}  // ✅ Pasamos el usuario autenticado aquí
          username={post.username}
          picture={post.picture}
          content={post.content}
          url={post.url}
          isLikedInitial={likes.some((like) => like.post_id === post.post_id)}
        />
      ))}
    </div>
  );
}
