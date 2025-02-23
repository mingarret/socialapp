import { getUserPosts, getUserProfile } from "@/app/lib/action";
import Image from "next/image";
import Skeleton from "@/app/ui/Skeleton";

export default async function PostsPage() {
  const profile = await getUserProfile();
  const posts = await getUserPosts(profile.user_id);

  return (
    <div className="grid grid-cols-3 gap-6">
      {!posts ? (
        [...Array(6)].map((_, i) => <Skeleton key={i} height="200px" className="rounded-lg" />)
      ) : posts.length > 0 ? (
        posts.map((post) => (
          <Image key={post.post_id} src={post.url} alt="Post" width={200} height={200} className="rounded-lg" />
        ))
      ) : (
        <p className="text-gray-500">No has publicado nada aún.</p>
      )}
    </div>
  );
}
