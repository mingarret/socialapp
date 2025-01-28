import { getPosts } from "../lib/data";
import Post from "./post";

export default async function PostList() {
  const posts = await getPosts();

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-8 mt-10 pb-20">
      {posts.map((post) => (
        <Post key={post.id} content={post.content} url={post.url} />
      ))}
    </div>
  );
}
