import { auth0 } from "../lib/auth0";
import { getPosts } from "../lib/data";
import Post from "./post"; // Nombre en minúsculas
import { ChatBubbleOvalLeftIcon, HeartIcon } from "@heroicons/react/24/outline";


export default async function PostList() {

  //obtener los datos
  const posts = await getPosts();

  const {user_id}= (await auth0.getSession()).user;

  return (
    <div className="flex flex-col grow gap-16 mt-16 items-center">
      {posts.map( post => (
        <Post key={post.post_id} user_id= {user_id} post_id={post.post_id} content={post.content} url={post.url}/>
      ))}
    </div>
  );
}