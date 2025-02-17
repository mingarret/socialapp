import { sql } from "@vercel/postgres";

export async function getPosts() {
    return (await sql`
      SELECT 
        sa_posts.post_id, 
        sa_posts.content, 
        sa_posts.url, 
        sa_posts.user_id, 
        sa_users.username, 
        sa_users.picture,  
        sa_posts.created_at,
        COUNT(sa_likes.user_id) AS num_likes 
      FROM sa_posts
      JOIN sa_users USING(user_id) 
      LEFT JOIN sa_likes USING(post_id)
      GROUP BY sa_posts.post_id, sa_users.username, sa_users.picture, sa_posts.created_at
    `).rows;
  }

  export async function getPostsOfUser(user_id) {
    return (await sql`
      SELECT 
        sa_posts.post_id, 
        sa_posts.content, 
        sa_posts.url, 
        sa_posts.user_id, 
        sa_users.username, 
        sa_users.picture,  
        sa_posts.created_at,
        COUNT(sa_likes.user_id) AS num_likes 
      FROM sa_posts
      JOIN sa_users USING(user_id) 
      LEFT JOIN sa_likes USING(post_id)
      WHERE sa_posts.user_id = ${user_id}
      GROUP BY sa_posts.post_id, sa_users.username, sa_users.picture, sa_posts.created_at
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
        sa_users.picture,
        sa_posts.created_at,
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

// Obtener comentarios de un post
export async function getComments(post_id) {
    return (await sql`
      SELECT sa_comments.comment_id, sa_comments.content, sa_comments.created_at, 
             sa_users.username, sa_users.picture 
      FROM sa_comments 
      JOIN sa_users ON sa_comments.user_id = sa_users.user_id
      WHERE sa_comments.post_id = ${post_id}
      ORDER BY sa_comments.created_at DESC
    `).rows;
  }
  
  // Insertar un nuevo comentario
  export async function insertComment(post_id, user_id, content) {
    await sql`
      INSERT INTO sa_comments (post_id, user_id, content)
      VALUES (${post_id}, ${user_id}, ${content})
    `;
  }

  export async function getProfile(user_name) {
    return (await sql`
    SELECT 
      user_id,
      username,
      name,
      picture,
      email
    FROM sa_users
    WHERE username = ${user_name}
  `).rows[0];
  }