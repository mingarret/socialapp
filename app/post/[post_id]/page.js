import { auth0 } from "@/app/lib/auth0"; 
import { getLike, getPost } from "@/app/lib/data";
import Post from "@/app/ui/post";

export default async function PostPage({ params }) {
    const post_id = params.post_id; // 🔹 Acceder directamente a params
    const session = await auth0.getSession();
    const user_id = session?.user?.user_id; // 🔹 Verificar si el usuario está logueado

    // 🔹 Obtener datos del post
    const post = (await getPost(post_id))[0];

    // 🔹 Si el usuario está autenticado, obtenemos si ha dado like
    const like = user_id ? await getLike(user_id, post_id) : [];

    return (
        <Post 
            user_id={user_id || null} // 🔹 Si no hay user_id, evitar errores
            post_id={post_id} 
            content={post.content} 
            url={post.url} 
            isLikedInitial={like.length > 0} 
        />
    );
}
