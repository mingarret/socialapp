import { sql } from "@vercel/postgres";

export async function getPosts() {
    return (await sql`
      SELECT 
        sa_posts.post_id, 
        content, 
        url, 
        sa_posts.user_id, 
        sa_users.username, 
        sa_users.picture,  -- ✅ Asegúrate de traer la imagen del usuario
        COUNT(sa_likes.user_id) AS num_likes 
      FROM sa_posts
      JOIN sa_users USING(user_id) 
      LEFT JOIN sa_likes USING(post_id)
      GROUP BY sa_posts.post_id, sa_users.username, sa_users.picture
    `).rows;
  }
  
  export async function getPost(post_id) {
    return (await sql`
      SELECT 
        sa_posts.post_id, 
        content, 
        url, 
        sa_posts.user_id, 
        sa_users.username, 
        sa_users.picture,  -- ✅ Traemos la imagen del usuario
        COUNT(sa_likes.user_id) AS num_likes 
      FROM sa_posts
      JOIN sa_users USING(user_id) 
      LEFT JOIN sa_likes USING(post_id)
      WHERE sa_posts.post_id = ${post_id}
      GROUP BY sa_posts.post_id, sa_users.username, sa_users.picture
    `).rows;
  }
  