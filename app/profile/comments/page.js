import { getUserComments, getUserProfile } from "@/app/lib/action";
import Image from "next/image";
import Skeleton from "@/app/ui/Skeleton";

export default async function CommentsPage({ params }) {
  const { user_id } = params;
  const comments = await getUserComments(user_id);

  return (
    <div className="grid grid-cols-3 gap-6">
      {!comments ? (
        [...Array(6)].map((_, i) => <Skeleton key={i} height="250px" className="rounded-lg" />)
      ) : comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.comment_id} className="p-4 border rounded-lg bg-gray-100 flex flex-col items-center justify-between h-[250px]">
            <Image 
              src={comment.post_image} 
              alt="Post comentado" 
              width={150} 
              height={100} 
              className="rounded-lg object-cover"
            />
            <p className="text-black">{comment.content}</p>
            <span className="text-gray-500 text-sm">En: {comment.post_title || "Publicación desconocida"}</span>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No ha comentado nada aún.</p>
      )}
    </div>
  );
}
