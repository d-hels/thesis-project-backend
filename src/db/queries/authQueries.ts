import pool from "../setup";
import { camelcasify } from "../../lib/utils";

export async function getUserById(id: number) {
  const client = await pool.connect();
  let res = { rows: [] };
  try {
    res = await client.query({
      text: `SELECT id, role, first_name, last_name from users WHERE id = $1`,
      values: [id],
    });
  } finally {
    client.release();
  }
  return camelcasify(res);
}
