import { sql } from '@vercel/postgres';
import {Auth0Client} from "@auth0/nextjs-auth0/server";

export const auth0 = new Auth0Client({
  async beforeSessionSaved(session, idToken) {
    const { nickname, name, picture, email } = session.user;

    try {
      await sql`INSERT INTO sa_users (username, name, picture, email) 
                VALUES (${nickname}, ${name}, ${picture}, ${email}
                ) `
    } catch (e) {
    }

    const user_id = (await sql`SELECT user_id FROM sa_users WHERE email=${email}`).rows[0].user_id;

    return {
      ...session,
      user: {
        ...session.user,
        user_id: user_id,
      },
    };
  },
});