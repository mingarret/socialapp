"use server"; // Esto habilita Server Actions en este archivo.

import { put } from "@vercel/blob";
import { sql } from "@vercel/postgres";

export async function createPost(formData) {
  try {
    // Subir la imagen al bucket.
    const { url } = await put("media", formData.get("media"), {
      access: "public",
    });

    // Obtener el contenido del formulario.
    const content = formData.get("content");

    // Insertar el post en la base de datos.
    await sql`
      INSERT INTO POSTS (content, url)
      VALUES (${content}, ${url})
    `;

    return { success: true };
  } catch (error) {
    console.error("Error al crear el post:", error);
    throw new Error("No se pudo crear el post.");
  }
}
