"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sql } from "@vercel/postgres";
import { put } from "@vercel/blob";
import { auth0 } from "./auth0";

export async function createPost(formData) {
  const session = await auth0.getSession();
  if (!session || !session.user) {
    throw new Error("Usuario no autenticado");
  }

  const { user_id } = session.user;
  const { url } = await put("media", formData.get("media"), { access: "public" });
  const content = formData.get("content");

  await sql`
    INSERT INTO sa_posts(content, url, user_id)
    VALUES (${content}, ${url}, ${user_id})`;

  revalidatePath("/"); // ✅ Ahora está correctamente importado
  redirect("/");
}

//función para insertar un like
export async function insertLike(post_id, user_id) {
  await sql`
    INSERT INTO sa_likes (post_id, user_id) 
    VALUES (${post_id}, ${user_id})
    ON CONFLICT (post_id, user_id) DO NOTHING
  `;
}

//función para verificar si el usuario ya ha dado like
export async function checkLike(post_id, user_id) {
  const { rows } = await sql`
    SELECT 1 FROM sa_likes 
    WHERE post_id = ${post_id} 
    AND user_id = ${user_id} 
    LIMIT 1
  `;
  return rows.length > 0; // ✅ Retorna `true` si el usuario ha dado like
}

//función para contar los likes
export async function countLikes(post_id) {
  const { rows } = await sql`
    SELECT COUNT(*) AS total 
    FROM sa_likes 
    WHERE post_id = ${post_id}
  `;
  return parseInt(rows[0]?.total, 10) || 0;
}


//función para obtener los usuarios que dieron like
export async function getUsersWhoLiked(post_id) {
  const { rows } = await sql`
    SELECT sa_users.username, sa_users.picture 
    FROM sa_likes
    JOIN sa_users ON sa_likes.user_id = sa_users.user_id
    WHERE sa_likes.post_id = ${post_id}
  `;

  return rows; // ✅ Ahora devuelve `username` y `picture`
}


//función para eliminar el like
export async function removeLike(post_id, user_id) {
  try {
    await sql`
      DELETE FROM sa_likes 
      WHERE post_id = ${post_id} AND user_id = ${user_id}
    `;
  } catch (error) {
    console.error("❌ Error al eliminar like:", error);
  }
}


//función para obtener los posts
export async function getPosts() {
  return (await sql`
  SELECT 
      sa_posts.post_id, 
      content, 
      url, 
      sa_posts.user_id, 
      sa_users.username,  -- ✅ Obtener nombre del usuario
      sa_users.picture,   -- ✅ Obtener foto del usuario
      COUNT(sa_likes.user_id) AS num_likes  -- ✅ Contar likes
  FROM sa_posts
  JOIN sa_users ON sa_posts.user_id = sa_users.user_id  -- ✅ Unir con la tabla de usuarios
  LEFT JOIN sa_likes ON sa_posts.post_id = sa_likes.post_id
  GROUP BY sa_posts.post_id, sa_users.username, sa_users.picture
`).rows;
}


// Función para obtener los likes de un usuario en posts específicos
export async function getLikes(user_id) {
  const { rows } = await sql`
    SELECT post_id FROM sa_likes WHERE user_id = ${user_id}
  `;
  return rows;
}

// ✅ Función para obtener los comentarios de un post
export async function getComments(post_id) {
  try {
    const comments = await sql`
      SELECT sa_comments.content, sa_users.username, sa_users.picture 
      FROM sa_comments
      JOIN sa_users ON sa_comments.user_id = sa_users.user_id
      WHERE sa_comments.post_id = ${post_id}
      ORDER BY sa_comments.created_at DESC
    `;

    const count = comments.rows.length; // Contar comentarios

    return { comments: comments.rows, count };
  } catch (error) {
    console.error("❌ Error al obtener comentarios:", error);
    return { comments: [], count: 0 };
  }
}


// ✅ Función para insertar un nuevo comentario
export async function insertComment(post_id, user_id, content) {
  try {
    await sql`
      INSERT INTO sa_comments (post_id, user_id, content) 
      VALUES (${post_id}, ${user_id}, ${content})
    `;
  } catch (error) {
    console.error("❌ Error al insertar comentario:", error);
  }
}

export async function searchDatabase(query) {
  if (!query) return { users: [], posts: [] };

  const users = await sql`
      SELECT user_id, username, picture 
      FROM sa_users 
      WHERE username ILIKE ${'%' + query + '%'}
      LIMIT 10
  `;

  const posts = await sql`
      SELECT post_id, content, url, user_id 
      FROM sa_posts 
      WHERE content ILIKE ${'%' + query + '%'}
      LIMIT 10
  `;

  return { users: users.rows, posts: posts.rows };
}

// 🔹 Obtiene información del usuario autenticado
export async function getUserProfile() {
  const session = await auth0.getSession();
  if (!session?.user?.email) return null; // Si no hay usuario autenticado, retorna null

  const result = await sql`SELECT * FROM sa_users WHERE email = ${session.user.email} LIMIT 1`;
  return result.rows[0];
}


// 🔹 Obtiene las publicaciones del usuario
export async function getUserPosts(userId) {
  return (await sql`SELECT * FROM sa_posts WHERE user_id = ${userId}`).rows;
}

// 🔹 Obtiene los comentarios del usuario
export async function getUserComments(userId) {
  return (await sql`
    SELECT sa_comments.content, sa_posts.content AS post_title
    FROM sa_comments
    JOIN sa_posts ON sa_comments.post_id = sa_posts.post_id
    WHERE sa_comments.user_id = ${userId}
  `).rows;
}

// 🔹 Obtiene los likes del usuario
export async function getUserLikes(userId) {
  return (await sql`
    SELECT sa_posts.url, sa_posts.post_id
    FROM sa_likes
    JOIN sa_posts ON sa_likes.post_id = sa_posts.post_id
    WHERE sa_likes.user_id = ${userId}
  `).rows;
}
