import { auth0 } from "@/app/lib/auth0";
import { getLike, getPost } from "@/app/lib/data";
import Post from "@/app/ui/post";

export default async function PostPage({ params }) {
  if (!params || !params.post_id) {
    return <div>Error: No se encontró el post.</div>;
  }

  const post_id = params.post_id;
  const session = await auth0.getSession();
  const user_id = session?.user?.user_id;

  const postData = await getPost(post_id);
  if (!postData || postData.length === 0) {
    return <div>Error: El post no existe.</div>;
  }

  const post = postData[0];
  const like = await getLike(user_id, post_id);

  return (
    <>
      <Post 
        user_id={user_id} 
        post_id={post_id}
        username={post.username || "Desconocido"}  
        picture={post.picture || "/default-avatar.png"} 
        content={post.content}
        url={post.url}
        //likeCount={post.num_likes}
        isLikedInitial={like.length > 0} 
      />
    </>
  );
}
