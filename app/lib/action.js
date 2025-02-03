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