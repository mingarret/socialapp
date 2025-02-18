import { sql } from "@vercel/postgres";


// Insertar un nuevo like en la base de datos 
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

  // Insertar un nuevo like en la base de datos 
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

// Insertar un nuevo like en la base de datos   
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

  // Insertar un nuevo like en la base de datos 
  export async function getUsersWhoLiked(post_id) {
    const { rows } = await sql`
      SELECT sa_users.username, sa_users.picture 
      FROM sa_likes
      JOIN sa_users ON sa_likes.user_id = sa_users.user_id
      WHERE sa_likes.post_id = ${post_id}
    `;
    
    return rows;
  }


  // Insertar un nuevo like en la base de datos 
  export async function getLike(user_id, post_id) {
    return (await sql`
        SELECT post_id FROM sa_likes WHERE user_id = ${user_id} AND post_id=${post_id}
    `).rows;
}


// ✅ Obtener comentarios y sus respuestas en cascada
export async function getComments(post_id) {
  const comments = (await sql`
    SELECT 
      c.comment_id, c.content, c.parent_id,
      u.username, u.picture 
    FROM sa_comments c
    JOIN sa_users u ON c.user_id = u.user_id
    WHERE c.post_id = ${post_id}
    ORDER BY c.parent_id NULLS FIRST, c.comment_id ASC
  `).rows || [];  // ✅ Asegura que siempre es un array
  

  // 🔄 Convertir los comentarios en estructura anidada
  const commentMap = new Map();

  comments.forEach(comment => {
    comment.replies = [];
    commentMap.set(comment.comment_id, comment);
  });

  const rootComments = [];

  comments.forEach(comment => {
    if (comment.parent_id) {
      commentMap.get(comment.parent_id)?.replies.push(comment);
    } else {
      rootComments.push(comment);
    }
  });

  return rootComments;
}


  
  // Insertar un nuevo comentario en la base de datos
  export async function insertComment(post_id, user_id, content, parent_id = null) {
    await sql`
      INSERT INTO sa_comments (post_id, user_id, content, parent_id)
      VALUES (${post_id}, ${user_id}, ${content}, ${parent_id})
    `;
  }
  
  // ✅ Obtener perfil de un usuario por su nombre de usuario
export async function getProfile(user_name) {
  const result = await sql`
    SELECT user_id, username, name, picture, email
    FROM sa_users
    WHERE username = ${user_name}
  `;

  return result.rows.length > 0 ? result.rows[0] : null; // ✅ Devuelve `null` si no se encuentra el usuario
}

  // ✅ Función para buscar usuarios en la base de datos por su nombre de usuario
export async function searchUsers(query) {
  return (
    await sql`
      SELECT user_id, username, name, picture
      FROM sa_users
      WHERE username ILIKE ${"%" + query + "%"}
      LIMIT 5
    `
  ).rows;
}

// ✅ Obtener los posts con el número de comentarios asociados
export async function getPostsWithCommentCount() {
  return (await sql`
    SELECT 
      p.post_id, 
      p.content, 
      p.url, 
      p.user_id, 
      COUNT(c.comment_id) AS comment_count
    FROM sa_posts p
    LEFT JOIN sa_comments c ON p.post_id = c.post_id
    GROUP BY p.post_id
    ORDER BY p.created_at DESC;
  `).rows; // ✅ Devuelve los resultados correctamente
}

