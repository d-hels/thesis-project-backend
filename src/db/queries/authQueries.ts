import pool from "../setup";
import { camelcasify } from "../../lib/utils";

export async function getUserById(id: string) {
  const client = await pool.connect();
  let res = { rows: [] };
  try {
    res = await client.query({
      text: `SELECT id, role_id, first_name, last_name from users WHERE id = $1`,
      values: [id],
    });
  } finally {
    client.release();
  }
  return camelcasify(res);
}

export async function updateUserLastLogin(id: string) {
  const client = await pool.connect();
  let res = { rows: [] };

  try {
    res = await client.query({
      text: `
        UPDATE users
        SET last_login_at = NOW()
        WHERE id = $1
      `,
      values: [id],
    });
    console.log(res, 'res')
  } finally {
    client.release();
  }

  return camelcasify(res);
}
