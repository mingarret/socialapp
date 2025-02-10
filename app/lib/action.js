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


export async function insertLike(post_id, user_id) {

  //guardar el like en la base de datos
  sql `INSERT INTO sa_likes(post_id, user_id) 
  
  VALUES (
    ${post_id},
    ${user_id} 
    ) `
}

//función para verificar si el usuario ya ha dado like
export async function checkLike(post_id, user_id) {
  const { rows } = await sql`
    SELECT 1 FROM sa_likes 
    WHERE post_id = ${post_id} AND user_id = ${user_id} 
    LIMIT 1
  `;
  return rows.length > 0;
}

//función para contar los likes
export async function countLikes(post_id) {
  const { rows } = await sql`
    SELECT COUNT(*) AS total FROM sa_likes WHERE post_id = ${post_id}
  `;
  return rows[0].total || 0;
}

//función para obtener los usuarios que dieron like
export async function getUsersWhoLiked(post_id) {
  const { rows } = await sql`
    SELECT sa_users.username 
    FROM sa_likes
    JOIN sa_users ON sa_likes.user_id = sa_users.user_id
    WHERE sa_likes.post_id = ${post_id}
  `;
  
  return rows;
}

//función para eliminar el like
export async function removeLike(post_id, user_id) {
  try {
    await sql`
      DELETE FROM sa_likes 
      WHERE post_id = ${post_id} AND user_id = ${user_id}
    `;
  } catch (error) {
    console.error("❌ Error al eliminar el like:", error);
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