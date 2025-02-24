import { getUserLikes, getUserProfile } from "@/app/lib/action";
import Image from "next/image";
import Skeleton from "@/app/ui/Skeleton";

export default async function LikesPage({ params }) {
  const { user_id } = params;
  const likes = await getUserLikes(user_id);

  return (
    <div className="grid grid-cols-3 gap-6">
      {!likes ? (
        [...Array(6)].map((_, i) => <Skeleton key={i} height="250px" className="rounded-lg" />)
      ) : likes.length > 0 ? (
        likes.map((like) => (
          <div key={like.post_id} className="p-4 border rounded-lg bg-gray-100 flex flex-col items-center justify-between h-[250px]">
            <Image 
              src={like.url} 
              alt="Post Likeado" 
              width={150} 
              height={100} 
              className="rounded-lg object-cover"
            />
          </div>
        ))
      ) : (
        <p className="text-gray-500">No ha dado like a ninguna publicación.</p>
      )}
    </div>
  );
}

