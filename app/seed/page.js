import { sql } from "@vercel/postgres";

export default async function Seed() {
  try {
    // Crear tabla si no existe
    await sql`
      CREATE TABLE IF NOT EXISTS posts (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        content TEXT NOT NULL,
        url TEXT NOT NULL
      )
    `;

    return <p>Database seeded successfully.</p>;
  } catch (error) {
    console.error("Error creando la tabla:", error.message);
    return <p>Error al seedear la base de datos.</p>;
  }
}
