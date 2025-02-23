import { getUserComments, getUserProfile } from "@/app/lib/action";
import Skeleton from "@/app/ui/Skeleton";

export default async function CommentsPage() {
  const profile = await getUserProfile();
  const comments = await getUserComments(profile.user_id);

  return (
    <div className="space-y-4">
      {!comments ? (
        [...Array(5)].map((_, i) => <Skeleton key={i} height="50px" className="rounded-lg" />)
      ) : comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.comment_id} className="p-4 border rounded-lg bg-gray-100">
            <p className="text-black">{comment.content}</p>
            <span className="text-gray-500 text-sm">En: {comment.post_title || "Publicación desconocida"}</span>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No has comentado nada aún.</p>
      )}
    </div>
  );
}
