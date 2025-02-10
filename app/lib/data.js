import { sql } from "@vercel/postgres";

export async function getPosts() {
    const result = await sql`
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
    `;

    console.log("📸 Posts con datos de usuario:", result.rows); // 🔍 Depuración
    return result.rows;
}

  
export async function getPost(post_id) {
    return (await sql`
    SELECT 
        sa_posts.post_id, 
        content, 
        url, 
        sa_posts.user_id, 
        sa_users.username, 
        sa_users.picture,
        COUNT(sa_likes.user_id) AS num_likes 
    FROM sa_posts
    JOIN sa_users USING(user_id) 
    LEFT JOIN sa_likes USING(post_id)
    WHERE post_id = ${post_id}
    GROUP BY sa_posts.post_id, sa_users.username, sa_users.picture
    `).rows;
}

  
  export async function getUsersWhoLiked(post_id) {
    const { rows } = await sql`
      SELECT sa_users.username, sa_users.picture 
      FROM sa_likes
      JOIN sa_users ON sa_likes.user_id = sa_users.user_id
      WHERE sa_likes.post_id = ${post_id}
    `;
    
    return rows;
  }

  export async function getLike(user_id, post_id) {
    return (await sql`
        SELECT post_id FROM sa_likes WHERE user_id = ${user_id} AND post_id=${post_id}
    `).rows;
}

  