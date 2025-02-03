import { sql } from "@vercel/postgres";

export async function getPosts() {
    return (await sql`SELECT * FROM sa_posts`).rows;
}