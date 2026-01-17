import { camelcasify } from "../../lib/utils";
import pool from "../setup";

export async function createDepartmentQuery({ name, description }: any) {
  const client = await pool.connect();
  let res = { rows: [] };
  try {
    res = await client.query({
      text: `INSERT INTO departments(name, description) VALUES($1,$2) RETURNING *`,
      values: [name, description],
    });
  } finally {
    client.release();
  }
  return camelcasify(res);
}

export async function getDepartmentsQuery() {
  const client = await pool.connect();
  let res = { rows: [] };

  try {
    res = await client.query({
      text: `
            SELECT
            id,
            name,
            description,
            created_at
            FROM departments
            ORDER BY created_at DESC
        `,
    });
  } finally {
    client.release();
  }
  return camelcasify(res, true);
}

export async function updateDepartmentQuery(
  id: any,
  name?: any,
  description?: any
) {
  const client = await pool.connect();
  let res;
  try {
    await client.query("BEGIN");
    res = await client.query({
      text: `
          UPDATE departments SET
          name = COALESCE($2, name),
          description  = COALESCE($3, description)
          WHERE id = $1
          RETURNING id, name, description`,
      values: [id, name, description],
    });
    await client.query("COMMIT");
  } catch (error: any) {
    console.log(error.message);
  } finally {
    client.release();
  }
}

export async function deleteDepartmentQuery(id: any) {
  const client = await pool.connect();
  let res = { rows: [] };

  try {
    res = await client.query({
      text: `DELETE FROM departments WHERE id = $1`,
      values: [id],
    });
  } finally {
    client.release();
  }
  return camelcasify(res);
}

export async function createPositionQuery({
  title,
  description,
  departmentId,
}: any) {
  const client = await pool.connect();
  let res = { rows: [] };
  try {
    res = await client.query({
      text: `INSERT INTO positions(title, description, department_id) VALUES($1,$2,$3) RETURNING *`,
      values: [title, description, departmentId],
    });
  } finally {
    client.release();
  }
  return camelcasify(res);
}

export async function getPositionsQuery() {
  const client = await pool.connect();
  let res = { rows: [] };

  try {
    res = await client.query({
      text: `
          SELECT
  p.id,
  p.title,
  p.description,
  p.department_id,
  p.created_at,
  d.name AS departmentName
FROM positions p
LEFT JOIN departments d
  ON p.department_id = d.id
  ORDER BY p.created_at DESC
      `,
    });
  } finally {
    client.release();
  }
  return camelcasify(res, true);
}

export async function updatePositionQuery(
  id: any,
  title?: any,
  description?: any,
  departmentId?: any
) {
  const client = await pool.connect();
  let res;
  try {
    await client.query("BEGIN");
    res = await client.query({
      text: `
        UPDATE positions SET
        title = COALESCE($2, title),
        description  = COALESCE($3, description),
        department_id = COALESCE($4, department_id)
        WHERE id = $1
        RETURNING id, title, description, department_id`,
      values: [id, title, description, departmentId],
    });
    await client.query("COMMIT");
  } catch (error: any) {
    console.log(error.message);
  } finally {
    client.release();
  }
}

export async function deletePositionQuery(id: any) {
  const client = await pool.connect();
  let res = { rows: [] };

  try {
    res = await client.query({
      text: `DELETE FROM positions WHERE id = $1`,
      values: [id],
    });
  } finally {
    client.release();
  }
  return camelcasify(res);
}

export async function getPositionsByDepartmentIdQuery(departmentId: number) {
  const client = await pool.connect();
  let res = { rows: [] };

  try {
    res = await client.query({
      text: `
        SELECT
          p.id,
          p.title,
          p.department_id
        FROM positions p
        WHERE p.department_id = $1
      `,
      values: [departmentId],
    });
  } finally {
    client.release();
  }

  return camelcasify(res);
}

export async function getWorkersCountQuery() {
  const client = await pool.connect();
  let res = { rows: [] };
  try {
    res = await client.query({
      text: `SELECT COUNT(*)::int AS employee_count
        FROM users
        WHERE role = $1`,
      values: ['worker'],
    });
  } finally {
    client.release();
  }
  return camelcasify(res);
}

export async function getWorkersQuery() {
  const client = await pool.connect();
  let res = { rows: [] };
  try {
    res = await client.query({
      text: `
        SELECT
        users.id,
        users.first_name,
        users.last_name,
        users.email,
        users.phone,
        users.department_id,
        departments.name AS department_name,
        users.positions_id,
        positions.title AS position_title,
        users.address,
        users.created_at
        FROM users
        LEFT JOIN departments
          ON users.department_id = departments.id
        LEFT JOIN positions
          ON users.positions_id = positions.id
        WHERE users.role = 'worker'
      ORDER BY users.created_at DESC
      `,
      values: [],
    });
  } finally {
    client.release();
  }
  return camelcasify(res, true);
}

export async function deleteWorkerQuery(id: any) {
  const client = await pool.connect();
  let res = { rows: [] };
  let res2 = { rows: [] };

  try {
    res = await client.query({
      text: `DELETE FROM users WHERE id = $1`,
      values: [id],
    });

    res2 = await client.query({
      text: `DELETE FROM workers WHERE user_id = $1`,
      values: [id],
    });
  } finally {
    client.release();
  }
  return camelcasify(res);
}

export async function updateWorkerQuery(
  id: any,
  first_name?: any,
  last_name?: any,
  email?: any,
  phone?: any,
  address?: any,
  departmentId?: any,
  positionsId?: any
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
      department_id = COALESCE($7, department_id),
      positions_id = COALESCE($8, positions_id)
    WHERE id = $1
    RETURNING id, first_name, last_name, email, phone, address, department_id, positions_id`,
      values: [id, first_name, last_name, email, phone, address, departmentId, positionsId],
    });
    await client.query("COMMIT");
  } catch (error: any) {
    console.log(error.message);
  } finally {
    client.release();
  }
}
