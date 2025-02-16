import { sql } from "@vercel/postgres";

export default async function Seed() {
  try {
    console.log("🌱 Seeding database...");

    // ✅ Eliminar solo los datos de las tablas sin borrar la estructura
    await sql`TRUNCATE TABLE sa_likes RESTART IDENTITY CASCADE`;
    await sql`TRUNCATE TABLE sa_posts RESTART IDENTITY CASCADE`;
    await sql`TRUNCATE TABLE sa_users RESTART IDENTITY CASCADE`;

    // ✅ Crear la tabla de usuarios si no existe
    await sql`
      CREATE TABLE IF NOT EXISTS sa_users (
        user_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        username TEXT NOT NULL,
        name TEXT NOT NULL,
        picture TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
      )
    `;

    // ✅ Crear la tabla de posts si no existe
    await sql`
      CREATE TABLE IF NOT EXISTS sa_posts (
        post_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        content TEXT NOT NULL,
        url TEXT NOT NULL,
        user_id UUID REFERENCES sa_users(user_id) ON DELETE CASCADE
      )
    `;

    // ✅ Crear la tabla de likes si no existe
    await sql`
      CREATE TABLE IF NOT EXISTS sa_likes (
        user_id UUID REFERENCES sa_users(user_id) ON DELETE CASCADE,
        post_id UUID REFERENCES sa_posts(post_id) ON DELETE CASCADE,
        PRIMARY KEY (user_id, post_id)
      )
    `;

    // 🔹 Insertamos un usuario de prueba
    /* const { rows } = await sql`
      INSERT INTO sa_users (username, name, picture, email) VALUES
      ('ximillo', 'Ximillo', 'https://randomuser.me/api/portraits/men/1.jpg', 'ximillo@example.com')
      RETURNING user_id
    `;

    const userId = rows[0].user_id; */

    // 🔹 Insertamos posts con el usuario de prueba
    await sql`
      INSERT INTO sa_posts (content, url, user_id) VALUES
      ('Hola, este es mi primer post!', 'https://via.placeholder.com/500', ${userId}),
      ('Disfrutando el día 🌞', 'https://via.placeholder.com/500', ${userId})
    `;

    console.log("✅ Seed completado correctamente.");
  } catch (error) {
    console.error("❌ Error en el seed:", error);
  }
}
