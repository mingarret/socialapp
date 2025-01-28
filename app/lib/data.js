import { sql } from "@vercel/postgres";

// Obtener todos los posts de la base de datos
export async function getPosts() {
  try {
    const { rows } = await sql`
      SELECT id, content, url
      FROM posts
      ORDER BY id DESC
    `;
    return rows;
  } catch (error) {
    console.error("Error al obtener los posts:", error.message);
    throw new Error("No se pudieron obtener los posts.");
  }
}
