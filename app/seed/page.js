import { sql } from "@vercel/postgres";

export default async function Seed() {
  try {
    // Borrar tablas si existen
    await sql`
      DROP TABLE IF EXISTS sa_likes;
      DROP TABLE IF EXISTS sa_posts;
      DROP TABLE IF EXISTS sa_users;
    `;

    // Crear tabla de usuarios si no existe
    await sql`
      CREATE TABLE IF NOT EXISTS sa_users (
        user_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        username TEXT NOT NULL,
        name TEXT NOT NULL,
        picture TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
      )
    `;

    // Crear tabla de posts si no existe
    await sql`
      CREATE TABLE IF NOT EXISTS sa_posts (
        post_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        content TEXT NOT NULL,
        url TEXT NOT NULL,
        user_id UUID REFERENCES sa_users(user_id)
      )
    `;

    // Crear tabla de likes (pivote) si no existe
    await sql`
      CREATE TABLE IF NOT EXISTS sa_likes (
        user_id UUID REFERENCES sa_users(user_id),
        post_id UUID REFERENCES sa_posts(post_id),
        PRIMARY KEY (user_id, post_id)
      )
    `;

    return (
      <div>
        <h1>Seed completed successfully</h1>
      </div>
    );
  } catch (error) {
    console.error("Error during seeding:", error);
    return (
      <div>
        <h1>Error during seeding</h1>
        <p>{error.message}</p>
      </div>
    );
  }
}