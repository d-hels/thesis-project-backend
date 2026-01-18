import { camelcasify } from "../../lib/utils";
import pool from "../setup";

export async function createAdminQuery(
  first_name: any,
  last_name: any,
  email: any,
  password: any,
  phone: any,
  address: any
) {
  const client = await pool.connect();
  let res = { rows: [] };
  try {
    res = await client.query({
      text: `INSERT INTO users(first_name,last_name,email,password,phone,address,role)
        VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      values: [first_name, last_name, email, password, phone, address, "admin"],
    });
  } finally {
    client.release();
  }
  return camelcasify(res);
}

export async function createManagerQuery(
  firstName: any,
  lastName: any,
  email: any,
  password: any,
  phone: any,
  address: any,
  departmentId: any
) {
  const client = await pool.connect();
  let res = { rows: [] };
  let res2 = { rows: [] };

  try {
    res = await client.query({
      text: `INSERT INTO users(first_name,last_name,email,password,phone,address,department_id, role)
        VALUES($1,$2,$3,$4,$5,$6,$7, $8) RETURNING *`,
      values: [
        firstName,
        lastName,
        email,
        password,
        phone,
        address,
        departmentId,
        "manager",
      ],
    });

    res2 = await client.query({
      text: `INSERT INTO managers(user_id)
        VALUES($1) RETURNING *`,
      values: [res.rows[0]["id"]],
    });
  } finally {
    client.release();
  }
  return camelcasify(res);
}

export async function getUserByEmailQuery(email: string) {
  const client = await pool.connect();
  let res = { rows: [] };
  try {
    res = await client.query({
      text: `SELECT * from users 
        WHERE email = $1`,
      values: [email],
    });
  } finally {
    client.release();
  }
  return camelcasify(res);
}

export async function getUsersQuery() {
  const client = await pool.connect();
  let res = { rows: [] };
  try {
    res = await client.query({
      text: `SELECT
          users.id,
          users.first_name,
          users.last_name,
          users.email,
          users.phone,
          users.role,
          users.department_id,
          departments.name AS department_name,
          users.address,
          users.created_at
        FROM users
        LEFT JOIN departments
          ON users.department_id = departments.id
      `,
      values: [],
    });
  } finally {
    client.release();
  }
  return camelcasify(res, true);
}

export async function updateUserQuery(
  id: any,
  first_name?: any,
  last_name?: any,
  email?: any,
  phone?: any,
  address?: any,
  departmentId?: any
) {
  const client = await pool.connect();
  let res;
  try {
    await client.query("BEGIN");
    res = await client.query({
      text: `
     UPDATE users
    SET
      first_name = COALESCE($2, first_name),
      last_name  = COALESCE($3, last_name),
      email      = COALESCE($4, email),
      phone      = COALESCE($5, phone),
      address    = COALESCE($6, address),
      department_id = COALESCE($7, department_id)
    WHERE id = $1
    RETURNING id, first_name, last_name, email, phone, address, department_id`,
      values: [id, first_name, last_name, email, phone, address, departmentId],
    });
    await client.query("COMMIT");
  } catch (error: any) {
    console.log(error.message);
  } finally {
    client.release();
  }
}

export async function updateMyProfileQuery(
  id: any,
  firstName?: any,
  lastName?: any,
  email?: any,
  phone?: any,
  address?: any,
) {
  const client = await pool.connect();
  let res;
  try {
    await client.query("BEGIN");
    res = await client.query({
      text: `
     UPDATE users
    SET
      first_name = COALESCE($2, first_name),
      last_name  = COALESCE($3, last_name),
      email      = COALESCE($4, email),
      phone      = COALESCE($5, phone),
      address    = COALESCE($6, address)
    WHERE id = $1
    RETURNING id, first_name, last_name, email, phone, address`,
      values: [id, firstName, lastName, email, phone, address],
    });
    await client.query("COMMIT");
  } catch (error: any) {
    console.log(error.message);
  } finally {
    client.release();
  }
  return camelcasify(res);
}

export async function deleteUserQuery(id: any) {
  const client = await pool.connect();
  let res = { rows: [] };
  let res2 = { rows: [] };

  try {
    res = await client.query({
      text: `DELETE FROM users WHERE id = $1`,
      values: [id],
    });

    res2 = await client.query({
      text: `DELETE FROM managers WHERE user_id = $1`,
      values: [id],
    });
  } finally {
    client.release();
  }
  return camelcasify(res);
}

export async function getUsersCountQuery() {
  const client = await pool.connect();
  let res;
  try {
    res = await client.query(`
      SELECT COUNT(*)::int AS users_count
      FROM users
    `);
  } finally {
    client.release();
  }
  return camelcasify(res);
}
