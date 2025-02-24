import { getUserPosts, getUserProfile } from "@/app/lib/action";
import Image from "next/image";
import Skeleton from "@/app/ui/Skeleton";

export default async function PostsPage({ params }) {
  const { user_id } = params;
  const posts = await getUserPosts(user_id);

  return (
    <div className="grid grid-cols-3 gap-6">
      {!posts ? (
        [...Array(6)].map((_, i) => <Skeleton key={i} height="250px" className="rounded-lg" />)
      ) : posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.post_id} className="p-4 border rounded-lg bg-gray-100 flex flex-col items-center justify-between h-[250px]">
            <Image 
              src={post.url} 
              alt="Post" 
              width={150} 
              height={100} 
              className="rounded-lg object-cover"
            />
          </div>
        ))
      ) : (
        <p className="text-gray-500">No ha publicado nada aún.</p>
      )}
    </div>
  );
}
