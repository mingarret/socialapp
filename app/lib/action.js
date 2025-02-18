"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sql } from "@vercel/postgres";
import { put } from "@vercel/blob";
import { auth0 } from "./auth0";
import { searchUsers } from "./data";
import { insertComment, getComments } from "./data";
import { getComments as fetchComments } from "./data"; // ✅ Importa la única función válida


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


//TODO: los selects van en principio en el data.js

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
    SELECT sa_comments.comment_id, sa_comments.content, sa_posts.content AS post_title
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

export async function handleSearchUsers(query) {
  if (!query.trim()) return []; // ✅ Si la búsqueda está vacía, no hacer nada

  try {
    const users = await searchUsers(query);

    if (!users || users.length === 0) {
      console.warn("⚠️ No se encontraron usuarios.");
      return [];
    }

    return users.map(user => ({
      user_id: user.user_id, // ✅ Aseguramos que `user_id` está presente
      username: user.username,
      name: user.name,
      picture: user.picture
    }));
  } catch (error) {
    console.error("❌ Error en la búsqueda de usuarios:", error);
    return [];
  }
}


export async function handleGetProfile(user_name) {
  if (!user_name) throw new Error("❌ Username inválido");

  try {
    const user = await getProfile(user_name);

    if (!user) {
      console.warn(`⚠️ Usuario no encontrado: ${user_name}`);
      return null;
    }

    return user;
  } catch (error) {
    console.error("❌ Error al obtener el perfil:", error);
    return null;
  }
}


// ✅ Obtener comentarios de un post
export async function handleGetComments(post_id) {
  if (!post_id) throw new Error("❌ Post ID inválido");

  try {
    const comments = await sql`
      SELECT 
        c.comment_id, c.content, c.parent_id,
        u.username, u.picture 
      FROM sa_comments c
      JOIN sa_users u ON c.user_id = u.user_id
      WHERE c.post_id = ${post_id}
      ORDER BY c.parent_id NULLS FIRST, c.comment_id ASC
    `;

    // 🔹 Agrupar respuestas en cascada
    const commentMap = {};
    comments.rows.forEach(comment => {
      comment.replies = [];
      commentMap[comment.comment_id] = comment;
    });

    const rootComments = [];
    comments.rows.forEach(comment => {
      if (comment.parent_id) {
        commentMap[comment.parent_id]?.replies.push(comment);
      } else {
        rootComments.push(comment);
      }
    });

    return rootComments;
  } catch (error) {
    console.error("❌ Error al obtener comentarios:", error);
    return [];
  }
}


// ✅ Insertar un comentario
export async function addComment(formData) {
  const session = await auth0.getSession();
  if (!session || !session.user) {
    throw new Error("Usuario no autenticado");
  }

  const { user_id } = session.user;

  const post_id = formData.get("post_id");
  const content = formData.get("content");
  const parent_id = formData.get("parent_id") || null;

  // 🔹 Validación de datos
  if (!post_id || !user_id || !content.trim()) {
    throw new Error("❌ Datos inválidos para comentar");
  }

  try {
    await insertComment(post_id, user_id, content, parent_id);
  } catch (error) {
    console.error("❌ Error al insertar comentario:", error);
    throw new Error("❌ No se pudo insertar el comentario");
  }
}


