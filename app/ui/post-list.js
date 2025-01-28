import { getPosts } from "../lib/data";
import Post from "./post";

export default async function PostList() {
  const posts = await getPosts();

  return (
    <div className="flex flex-col grow gap-16 mt-16 items-center">
      {posts.map((post) => (
        <Post key={post.id} content={post.content} url={post.url} />
      ))}
    </div>
  );
}