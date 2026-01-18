import { camelcasify } from "../../lib/utils";
import pool from "../setup";

export async function createWorkerQuery(
  firstName: any,
  lastName: any,
  email: any,
  password: any,
  phone: any,
  address: any,
  departmentId?: any,
  positionsId?: any
) {
  const client = await pool.connect();
  let res = { rows: [] };
  let res2 = { rows: [] };

  try {
    res = await client.query({
      text: `INSERT INTO users(first_name,last_name,email,password,phone,address, department_id, positions_id, role)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      values: [
        firstName,
        lastName,
        email,
        password,
        phone,
        address,
        departmentId,
        positionsId,
        "worker",
      ],
    });

    res2 = await client.query({
      text: `INSERT INTO workers(user_id)
        VALUES($1) RETURNING *`,
      values: [res.rows[0]["id"]],
    });
  } finally {
    client.release();
  }
  return camelcasify(res);
}
