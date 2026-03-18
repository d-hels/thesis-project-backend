import { Roles } from "../../lib/types";
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
      text: `
        INSERT INTO users (
          first_name,
          last_name,
          email,
          password,
          phone,
          address,
          role_id
        )
        VALUES (
          $1, $2, $3, $4, $5, $6,
          (SELECT id FROM roles WHERE name = 'admin')
        )
        RETURNING *;
      `,
      values: [first_name, last_name, email, password, phone, address],
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
  departmentId: any,
  positionId: any,
) {
  const client = await pool.connect();
  let res = { rows: [] };
  let res2 = { rows: [] };

  try {
    res = await client.query({
      text: `INSERT INTO users(first_name,last_name,email,password,phone,address,department_id,position_id, role_id)
        VALUES($1,$2,$3,$4,$5,$6,$7, $8, (SELECT id FROM roles WHERE name = 'manager')) RETURNING *`,
      values: [
        firstName,
        lastName,
        email,
        password,
        phone,
        address,
        departmentId,
        positionId,
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
      text: `
        SELECT
          users.id,
          users.first_name,
          users.last_name,
          users.password,
          users.email,
          users.phone,
          roles.name as role,
          users.department_id,
          users.position_id,
          departments.name AS department_name,
          positions.title AS positions_title,
          users.address,
          users.role_id,
          users.created_at
        FROM users
        LEFT JOIN departments
          ON users.department_id = departments.id
        LEFT JOIN positions
          ON users.position_id = positions.id
        LEFT JOIN roles
          ON users.role_id = roles.id
        WHERE users.email = $1
        LIMIT 1
      `,
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
          roles.name as role,
          users.department_id,
          departments.name AS department_name,
          users.address,
          users.status,
          users.is_active,
          users.last_login_at,
          users.created_at
          FROM users
          LEFT JOIN departments
          ON users.department_id = departments.id
          LEFT JOIN roles
          ON users.role_id = roles.id
          ORDER BY users.created_at DESC
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
  role?: any,
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
      role       = COALESCE($7, role),
      department_id = COALESCE($8, department_id)
    WHERE id = $1
    RETURNING id, first_name, last_name, email, phone, address, department_id`,
      values: [
        id,
        first_name,
        last_name,
        email,
        phone,
        address,
        role,
        departmentId,
      ],
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
  address?: any
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

export async function getUsersStatisticsQuery() {
  const client = await pool.connect();
  let res;
  try {
    res = await client.query(`
      SELECT 
    (SELECT COUNT(*) FROM users) as total_workers,
    
    (SELECT COUNT(*) FROM users 
     WHERE created_at >= DATE_TRUNC('week', CURRENT_DATE)) as new_users_this_week,
    
    (SELECT COUNT(DISTINCT user_id) FROM attendance 
     WHERE DATE(created_at) = CURRENT_DATE) as present_today,
    
    (
        (SELECT COUNT(DISTINCT user_id) FROM attendance WHERE DATE(created_at) = CURRENT_DATE) - 
        (SELECT COUNT(DISTINCT user_id) FROM attendance WHERE DATE(created_at) = CURRENT_DATE - INTERVAL '1 day')
    ) as attendance_increase;
    `);
  } finally {
    client.release();
  }
  return camelcasify(res);
}

export async function getActiveVerifiedNonAdminUsersQuery() {
  const client = await pool.connect();
  let res = { rows: [] };

  try {
    res = await client.query({
      text: `
        SELECT
          users.id,
          users.first_name || ' ' || users.last_name AS name,
          users.email,
          users.phone,
          users.department_id,
          departments.name AS department_name,
          users.position_id,
          positions.title AS position_title,
          users.address,
          users.status,
          users.created_at,
          roles.name AS role
        FROM users
        LEFT JOIN departments ON users.department_id = departments.id
        LEFT JOIN positions ON users.position_id = positions.id
        LEFT JOIN roles ON users.role_id = roles.id
          WHERE users.role_id IN ($1, $2)
          AND users.is_active = true
          AND users.is_verified = true
          AND users.deleted_at IS NULL
        ORDER BY users.created_at DESC
      `,
      values: [Roles.MANAGER, Roles.WORKER],
    });
  } finally {
    client.release();
  }

  return camelcasify(res, true);
}

export async function updateUserStatusQuery(id: any, isActive?: any) {
  const client = await pool.connect();
  let res;
  try {
    await client.query("BEGIN");
    if (isActive) {
      res = await client.query({
        text: `
          UPDATE users
          SET is_active = $2,
          status = 'active'
          WHERE id = $1`,
        values: [id, isActive],
      });
      await client.query("COMMIT");
    } else {
      res = await client.query({
        text: `
          UPDATE users
          SET is_active = $2,
          status = 'suspended'
          WHERE id = $1`,
        values: [id, isActive],
      });
      await client.query("COMMIT");
    }
  } catch (error: any) {
    console.log(error.message);
  } finally {
    client.release();
  }
}

export async function getWorkerCountQuery() {
  const client = await pool.connect();
  let res;
  try {
    res = await client.query(`
      SELECT COUNT(*)::int AS users_count
      FROM users
      WHERE role_id IN ($1, $2)
    `, [Roles.MANAGER, Roles.WORKER]);
  } finally {
    client.release();
  }
  return camelcasify(res);
}

export async function getUsersByDepartmentIdQuery(departmentId: string) {
  const client = await pool.connect();
  let res = { rows: [] };
  try {
    res = await client.query({
      text: `
        SELECT
        u.id,
        u.first_name || ' ' || u.last_name AS name,
        u.email,
        p.title AS position,
        u.department_id AS "departmentId",
        u.status,
        u.phone,
        r.name as role,
        u.created_at AS "hireDate"
        FROM users u
        JOIN positions p ON p.id = u.position_id
        LEFT JOIN roles r ON u.role_id = r.id
        WHERE u.department_id = $1
      `,
      values: [departmentId],
    });
  } finally {
    client.release();
  }

  return camelcasify(res, true);
}

export async function getUsersProfileQuery(id: any) {
  const client = await pool.connect();
  let res;
  try {
    res = await client.query(
      `
      SELECT
        e.id,
        e.first_name AS "firstName",
        e.last_name AS "lastName",
        p.title AS "position",
        d.name AS "department",
        e.email,
        e.address,
        e.phone,
        e.is_active,
        r.name as role,
        e.department_id,
        e.last_login_at,
        e.created_at AS "hireDate",
        e.status,
        m.first_name || ' ' || m.last_name AS "manager"
      FROM users e
      LEFT JOIN positions p ON e.position_id = p.id
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN roles r ON e.role_id = r.id
      LEFT JOIN users m 
            ON m.department_id = e.department_id 
            AND m.role_id = $2
      WHERE e.id = $1;
      `,
      [id, Roles.MANAGER]
    );
  } finally {
    client.release();
  }
  return camelcasify(res);
}

export async function changePasswordQuery(id: any, password: any) {
  const client = await pool.connect();
  let res;

  try {
    await client.query("BEGIN");

    res = await client.query(
      `
      UPDATE users
      SET password = $1
      WHERE id = $2
      RETURNING id;
      `,
      [password, id]
    );

    await client.query("COMMIT");
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error(error.message);
    throw error;
  } finally {
    client.release();
  }

  return camelcasify(res);
}

export async function getAllContractsQuery() {
  const client = await pool.connect();
  let res = { rows: [] };
  try {
    res = await client.query({
      text: `
        SELECT 
  c.id,
  u.id AS user_id,
  CONCAT(u.first_name, ' ', u.last_name) AS user_name,
  u.email AS user_email,
  c.contract_type,
  c.salary_amount,
  c.start_date,
  c.end_date,
  c.created_at,
  d.name AS department,
  p.title AS position
FROM contracts c
JOIN users u ON u.id = c.user_id
LEFT JOIN departments d ON d.id = u.department_id
LEFT JOIN positions p ON p.id = u.position_id
ORDER BY c.created_at DESC
      `,
    });
  } finally {
    client.release();
  }

  return camelcasify(res, true);
}

export async function getAllUsersQuery() {
  const client = await pool.connect();
  let res = { rows: [] };
  try {
    res = await client.query({
      text: `
        Select
        id,
        first_name || ' ' || last_name AS full_name
        from users
      `,
    });
  } finally {
    client.release();
  }
  return camelcasify(res, true);
}

export async function getManagersQuery() {
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
          roles.name as role,
          users.department_id,
          departments.name AS department_name,
          users.address,
          users.status,
          users.is_active,
          users.last_login_at,
          users.created_at
          FROM users
          LEFT JOIN departments
          ON users.department_id = departments.id
          LEFT JOIN roles
          ON users.role_id = roles.id
          where users.role_id = $1
          ORDER BY users.created_at DESC
      `,
      values: [Roles.MANAGER],
    });
  } finally {
    client.release();
  }
  return camelcasify(res, true);
}

export async function getDepartmentAttendancePercentageQuery() {
  const client = await pool.connect();
  let res = { rows: [] };
  try {
    res = await client.query({
      text: `SELECT 
  d.id,
  d.name as department_name,
  COUNT(DISTINCT u.id) as total_employees,
  COUNT(DISTINCT a.user_id) as present_today,
  ROUND(
    (COUNT(DISTINCT a.user_id)::decimal / NULLIF(COUNT(DISTINCT u.id), 0) * 100), 
    2
  ) as attendance_percentage,
  COUNT(CASE WHEN a.status = 'late' THEN 1 END) as late_count
FROM departments d
LEFT JOIN users u ON u.department_id = d.id AND u.is_active = true
LEFT JOIN attendance a ON a.user_id = u.id 
  AND a.date = CURRENT_DATE
  AND a.status IN ('present', 'late')
WHERE d.status = 'active'
GROUP BY d.id, d.name
ORDER BY attendance_percentage ASC limit 3;
      `,
      values: [],
    });
  } finally {
    client.release();
  }
  return camelcasify(res, true);
}
