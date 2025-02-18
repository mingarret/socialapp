import { auth0 } from "@/app/lib/auth0";
import { getComments, getLike, getPost } from "@/app/lib/data";
import PostDetail from "@/app/ui/post-detail";

export default async function PostPage({ params }) {
  if (!params || !(await params).post_id) {
    return <div>Error: No se encontró el post.</div>;
  }

  const post_id = (await params).post_id;
  const session = await auth0.getSession();
  const user_id = session?.user?.user_id;

  const postData = await getPost(post_id);
  if (!postData || postData.length === 0) {
    return <div>Error: El post no existe.</div>;
  }

  const post = postData[0];
  const like = await getLike(user_id, post_id);
  const comments = await getComments(post_id);

  return (
    <>
      <PostDetail 
        user_id={user_id} 
        post_id={post_id}
        username={post.username || "Desconocido"}  
        picture={post.picture || "/default-avatar.png"} 
        content={post.content}
        url={post.url}
        //likeCount={post.num_likes}
        isLikedInitial={like.length > 0} 
        comments={comments}
      />
    </>
  );
}
