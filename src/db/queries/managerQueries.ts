import { Roles } from "../../lib/types";
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
          d.id,
          d.name,
          d.description,
          d.status,
          d.created_at as "createdAt",
          d.updated_at as "updatedAt",
          -- Get manager name from users table
          (
            SELECT CONCAT(u.first_name, ' ', u.last_name)
            FROM users u
            WHERE u.department_id = d.id
              AND u.role_id = $1
              AND u.deleted_at IS NULL
            LIMIT 1
          ) as "manager",
          -- Count workers in department
          (
            SELECT COUNT(*)
            FROM users u
            WHERE u.department_id = d.id
              AND u.role_id = $2
              AND u.deleted_at IS NULL
          ) as "employeeCount",
          -- Count active workers
          (
            SELECT COUNT(*)
            FROM users u
            WHERE u.department_id = d.id
              AND u.role_id = $2
              AND u.is_active = true
              AND u.deleted_at IS NULL
          ) as "activeEmployees"
        FROM departments d
        ORDER BY d.created_at DESC
      `, values: [Roles.MANAGER, Roles.WORKER]
    });
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
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
      text: `UPDATE departments
        SET status = 'inactive'
        WHERE id = $1`,
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
  p.description,
  p.title AS title,
  d.name AS department_name,
  d.id AS department_id,
  p.created_at,
  p.status,
  COUNT(u.id) AS employee_count
FROM positions p
JOIN departments d ON d.id = p.department_id
LEFT JOIN users u ON u.position_id = p.id
GROUP BY
  p.id,
  p.description,
  p.title,
  d.name,
  d.id,
  p.created_at
ORDER BY p.created_at DESC;

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

  return camelcasify(res, true);
}

export async function getWorkersCountQuery() {
  const client = await pool.connect();
  let res = { rows: [] };
  try {
    res = await client.query({
      text: `SELECT COUNT(*)::int AS employee_count
        FROM users
        WHERE role_id = $1`,
      values: [Roles.WORKER],
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
        users.position_id,
        positions.title AS position_title,
        users.address,
        users.created_at
        FROM users
        LEFT JOIN departments
          ON users.department_id = departments.id
        LEFT JOIN positions
          ON users.position_id = positions.id
        WHERE users.role_id = $1
      ORDER BY users.created_at DESC
      `,
      values: [Roles.WORKER],
    });
  } finally {
    client.release();
  }
  return camelcasify(res, true);
}

export async function getWorkersByDepartmentQuery(departmentId: string) {
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
        users.status,
        users.department_id,
        departments.name AS department_name,
        users.position_id,
        positions.title AS position_title,
        users.address,
        users.created_at
        FROM users
        LEFT JOIN departments
          ON users.department_id = departments.id
        LEFT JOIN positions
          ON users.position_id = positions.id
        WHERE users.role_id = $2 and users.department_id = $1
      ORDER BY users.created_at DESC
      `,
      values: [departmentId, Roles.WORKER],
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
  status?: string,
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
      status     = COALESCE($7, status),
      department_id = COALESCE($8, department_id),
      position_id = COALESCE($8, position_id)
    WHERE id = $1
    RETURNING id, first_name, last_name, email, phone, address, status, department_id, position_id`,
      values: [
        id,
        first_name,
        last_name,
        email,
        phone,
        address,
        status,
        departmentId,
        positionsId,
      ],
    });
    await client.query("COMMIT");
  } catch (error: any) {
    console.log(error.message);
  } finally {
    client.release();
  }
}

export async function getAttendanceWorkersByDepartmentQuery(id: string) {
  const client = await pool.connect();
  let res = { rows: [] };
  try {
    res = await client.query({
      text: `
        SELECT 
        a.*,
        u.first_name || ' ' || u.last_name AS full_name
        FROM attendance a
        JOIN users u 
        ON u.id = a.user_id
        WHERE u.department_id = $1
        AND a.date = CURRENT_DATE
        AND u.role_id = $2
      `,
      values: [id, Roles.WORKER],
    });
  } finally {
    client.release();
  }
  return camelcasify(res, true);
}

export async function getAbsentWorkersCountByDepartmentQuery(id: string) {
  const client = await pool.connect();
  let res = { rows: [] };
  try {
    res = await client.query({
      text: `
        SELECT COUNT(DISTINCT a.user_id) AS present_count
        FROM attendance a
        JOIN users u ON u.id = a.user_id
        WHERE a.date = CURRENT_DATE
        AND a.status = 'absent'
        AND u.department_id = $1
      `,
      values: [id],
    });
  } finally {
    client.release();
  }
  return camelcasify(res);
}

export async function getIfaUserCheckedInQuery(id: string) {
  const client = await pool.connect();

  try {
    const res = await client.query({
      text: `
        SELECT
  check_in IS NOT NULL  AS checked_in,
  check_out IS NOT NULL AS checked_out
FROM attendance
WHERE user_id = $1
  AND date = CURRENT_DATE
LIMIT 1;

      `,
      values: [id],
    });

    if (!res.rows.length) {
      // no attendance record today
      return {
        success: false,
        payload: "can_check_in",
      };
    }

    const { checked_in, checked_out } = res.rows[0];

    // ❌ already checked in AND checked out (nothing allowed)
    if (checked_in && checked_out) {
      return {
        success: false,
        payload: "already_checked_in_and_out",
      };
    }

    // ✅ checked in, can CHECK OUT
    if (checked_in && !checked_out) {
      return {
        success: true,
        payload: "can_check_out",
      };
    }

    return {
      success: true,
      data: camelcasify(res),
    };
  } finally {
    client.release();
  }
}

export async function getDepartmentAttendanceStatsByIdQuery(departmentId: string) {
  const client = await pool.connect();
  let res = { rows: [] };

  try {
    res = await client.query({
      text: `
        SELECT
          d.id AS department_id,
          d.name AS department_name,

          COUNT(u.id) AS total_workers,

          COUNT(
            CASE
              WHEN a.status IN ('present', 'late') THEN 1
            END
          ) AS present_workers,

          COUNT(
            CASE
              WHEN a.status NOT IN ('present', 'late') OR a.status IS NULL THEN 1
            END
          ) AS absent_workers,

          ROUND(
            COUNT(
              CASE
                WHEN a.status IN ('present', 'late') THEN 1
              END
            ) * 100.0 / COUNT(u.id),
            2
          ) AS attendance_percentage

        FROM departments d
        JOIN users u
          ON u.department_id = d.id
        LEFT JOIN attendance a
          ON a.user_id = u.id
          AND a.date = CURRENT_DATE

        WHERE d.id = $1
          AND u.role_id = $2

        GROUP BY d.id, d.name;
      `,
      values: [departmentId, Roles.WORKER],
    });
  } finally {
    client.release();
  }

  return camelcasify(res);
}

export async function getDepartmentAttendanceByDateRangeQuery(
  departmentId: string,
  startDate: string,
  endDate: string
) {
  const client = await pool.connect();
  let res = { rows: [] };

  try {
    res = await client.query({
      text: `
        SELECT
          a.*,
          u.first_name || ' ' || u.last_name AS full_name,
          u.email
        FROM attendance a
        JOIN users u 
          ON a.user_id = u.id
          AND a.date BETWEEN $2 AND $3
        WHERE u.department_id = $1
          AND u.role_id = $4
        ORDER BY a.date ASC, u.first_name ASC;
      `,
      values: [departmentId, startDate, endDate, Roles.WORKER],
    });
  } finally {
    client.release();
  }

  return camelcasify(res, true);
}

export async function getWorkersByDepartmentIdQuery(departmentId: string) {
  const client = await pool.connect();
  let res = { rows: [] };
  try {
    res = await client.query({
      text: `
        Select
        id,
        first_name || ' ' || last_name AS full_name
        from users
        where department_id = $1
        AND role_id = $2
      `,
      values: [departmentId, Roles.WORKER],
    });
  } finally {
    client.release();
  }
  return camelcasify(res, true);
}

export async function getContractsQuery() {
  const client = await pool.connect();
  let res = { rows: [] };

  try {
    res = await client.query({
      text: `
        SELECT 
        c.*,
        u.first_name || ' ' || u.last_name AS full_name
        FROM contracts c
        JOIN users u 
        ON u.id = c.user_id
        ORDER BY created_at DESC
      `,
    });
  } finally {
    client.release();
  }
  return camelcasify(res, true);
}

export async function createContractQuery({ userId, contractType, salaryAmount, startDate, endDate, status }: any) {
  const client = await pool.connect();
  let res = { rows: [] };
  try {
    res = await client.query({
      text: `INSERT INTO contracts(user_id, contract_type, salary_amount, start_date, end_date, status)
        VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
      values: [userId, contractType, salaryAmount, startDate, endDate, status],
    });
  } finally {
    client.release();
  }
  return camelcasify(res);
}

export async function updateContractStatusQuery(
  id: any,
  status?: any,
) {
  const client = await pool.connect();
  let res;
  try {
    await client.query("BEGIN");
    res = await client.query({
      text: `
          UPDATE contracts SET
          status = COALESCE($2, status)
          WHERE id = $1`,
      values: [id, status],
    });
    await client.query("COMMIT");
  } catch (error: any) {
    console.log(error.message);
  } finally {
    client.release();
  }
}

export async function transferUserToDepartmentQuery(
  id: any,
  departmentId?: any,
) {
  const client = await pool.connect();
  let res;
  try {
    await client.query("BEGIN");
    res = await client.query({
      text: `
        UPDATE users SET
        department_id = COALESCE($2, department_id)
        WHERE id = $1`,
      values: [id, departmentId],
    });
    await client.query("COMMIT");
  } catch (error: any) {
    console.log(error.message);
  } finally {
    client.release();
  }
}