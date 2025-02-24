import { sql } from "@vercel/postgres";

export default async function Seed() {
  try {
    console.log("🌱 Seeding database...");

    //await resetPosts();
    //await resetUsers();
    //await resetComments();
    //await resetLikes();

    console.log("✅ Seed completado correctamente.");
  } catch (error) {
    console.error("❌ Error en el seed:", error);
  }
}

async function resetPosts(){
  await sql`TRUNCATE TABLE sa_posts RESTART IDENTITY CASCADE`;
  await sql`
  CREATE TABLE IF NOT EXISTS sa_posts (
    post_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    content TEXT NOT NULL,
    url TEXT NOT NULL,
    user_id UUID REFERENCES sa_users(user_id) ON DELETE CASCADE
  )
`;
}


async function resetUsers(){
  await sql`TRUNCATE TABLE sa_users RESTART IDENTITY CASCADE`;
  await sql`
  CREATE TABLE IF NOT EXISTS sa_users (
    user_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    username TEXT NOT NULL,
    name TEXT NOT NULL,
    picture TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
  )
`;
}

async function resetComments(){
  await sql`DROP TABLE IF EXISTS sa_comments`;
  await sql`
  CREATE TABLE IF NOT EXISTS sa_comments (
    comment_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID REFERENCES sa_posts(post_id) ON DELETE CASCADE,
    user_id UUID REFERENCES sa_users(user_id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES sa_comments(comment_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW()
)
`;
}

async function resetLikes(){
  await sql`TRUNCATE TABLE sa_likes RESTART IDENTITY CASCADE`;
  await sql`
  CREATE TABLE IF NOT EXISTS sa_likes (
    user_id UUID REFERENCES sa_users(user_id) ON DELETE CASCADE,
    post_id UUID REFERENCES sa_posts(post_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, post_id)
  )
`;
}