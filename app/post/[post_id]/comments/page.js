import { addComment, handleGetComments } from "@/app/lib/action";
import Image from "next/image";
import { notFound } from "next/navigation";


export default async function CommentsPage({ params }) {
  const { post_id } = params;
  const comments = await handleGetComments(post_id);
  if (!comments) return notFound(); // ❌ Manejo de error si el post no existe

  return (
    <div className="fixed inset-0 bg-white flex flex-col p-6">
      <h2 className="text-2xl font-bold mb-4">Comentarios</h2>

      {/* 📜 Lista de comentarios */}
      <div className="flex flex-col gap-4 overflow-y-auto">
        {comments.map((comment) => (
          <Comment key={comment.comment_id} comment={comment} />
        ))}
      </div>

      {/* 📝 Formulario para comentar */}
      <CommentForm post_id={post_id} />
    </div>
  );
}

/* 🗨️ Componente de comentario y respuestas */
function Comment({ comment }) {
  return (
    <div className="flex gap-4 border-b pb-4">
      <Image src={comment.picture || "/avatar-default.png"} width={40} height={40} className="rounded-full" alt={comment.username} />
      <div>
        <p className="font-bold">{comment.username}</p>
        <p className="text-gray-700">{comment.content}</p>
        
        {/* 🔽 Mostrar respuestas en cascada */}
        {comment.replies?.length > 0 && (
          <div className="ml-6 mt-2 border-l-2 border-gray-300 pl-4">
            {comment.replies.map((reply) => (
              <Comment key={reply.comment_id} comment={reply} />
            ))}
          </div>
        )}

        {/* ✏️ Botón para responder */}
        <ReplyForm parent_id={comment.comment_id} post_id={comment.post_id} />
      </div>
    </div>
  );
}

/* ✏️ Formulario para escribir comentarios */
function CommentForm({ post_id, user_id }) {
  return (
    <form action={addComment} className="mt-6 flex gap-2">
      <input type="hidden" name="post_id" value={post_id} />
      <input type="hidden" name="user_id" value={user_id} /> {/* ✅ Ahora se envía el user_id */}
      <input type="text" name="content" placeholder="Escribe un comentario..." className="border rounded-lg px-4 py-2 flex-grow" required />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Enviar</button>
    </form>
  );
}

/* 🔄 Formulario para responder a un comentario */
function ReplyForm({ parent_id, post_id, user_id }) {
  return (
    <form action={addComment} className="mt-2 flex gap-2">
      <input type="hidden" name="post_id" value={post_id} />
      <input type="hidden" name="user_id" value={user_id} /> {/* ✅ Ahora se envía el user_id */}
      <input type="hidden" name="parent_id" value={parent_id} />
      <input type="text" name="content" placeholder="Responder..." className="border rounded-lg px-4 py-2 flex-grow text-sm" required />
      <button type="submit" className="bg-gray-300 px-2 py-1 rounded text-sm">💬</button>
    </form>
  );
}
