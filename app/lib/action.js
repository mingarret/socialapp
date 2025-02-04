"use server";

import { put } from "@vercel/blob";
import { sql } from "@vercel/postgres";

//accion para el formulario de crear post
export async function createPost(formData) {

  //guardar la imagen en el bucket
  const { url } = await put("media", formData.get("media"), {
    access: "public",
  });

  //variables del contenido
  const content = formData.get("content");
 
  //guardar el post en la base de datos
  await sql`INSERT INTO sa_posts(content, url) 
  VALUES(
    ${content}, 
    ${url})`;
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


