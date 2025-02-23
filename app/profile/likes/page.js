import { getUserLikes, getUserProfile } from "@/app/lib/action";
import Image from "next/image";
import Skeleton from "@/app/ui/Skeleton";

export default async function LikesPage() {
  const profile = await getUserProfile();
  const likes = await getUserLikes(profile.user_id);

  return (
    <div className="grid grid-cols-3 gap-6">
      {!likes ? (
        [...Array(6)].map((_, i) => <Skeleton key={i} height="200px" className="rounded-lg" />)
      ) : likes.length > 0 ? (
        likes.map((like) => (
          <Image key={like.post_id} src={like.url} alt="Post Likeado" width={200} height={200} className="rounded-lg" />
        ))
      ) : (
        <p className="text-gray-500">No has dado like a ninguna publicación.</p>
      )}
    </div>
  );
}
