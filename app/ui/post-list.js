import { auth0 } from "../lib/auth0";
import { getPosts } from "../lib/data";
import Post from "./post"; // Nombre en minúsculas
import { ChatBubbleOvalLeftIcon, HeartIcon } from "@heroicons/react/24/outline";


export default async function PostList() {

  //obtener los datos
  const posts = await getPosts();

  const {user_id}= (await auth0.getSession()).user;

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-8 mt-10 pb-32"> 
      {posts.map((post) => (
        <Post key={post.post_id} content={post.content} url={post.url} />
      ))}
    </div>
  );
}