import { Roles } from "../../lib/types";
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
      text: `INSERT INTO users(first_name,last_name,email,password,phone,address, department_id, position_id, role_id)
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
        Roles.WORKER,
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

export async function checkInAttendanceQuery({
  userId,
  checkIn,
}: {
  userId: string
  checkIn: string // 'HH:mm'
}) {
  const client = await pool.connect()
  let res = { rows: [] }

  try {
    res = await client.query({
      text: `
        INSERT INTO attendance (
          user_id,
          date,
          check_in,
          status
        )
        VALUES (
          $1,
          CURRENT_DATE,
          $2,
          CASE
            WHEN $2 > TIME '09:15' THEN 'late'
            ELSE 'present'
          END
        )
        ON CONFLICT (user_id, date)
        DO UPDATE SET
          check_in = EXCLUDED.check_in,
          status = CASE
            WHEN EXCLUDED.check_in > TIME '09:15' THEN 'late'
            ELSE 'present'
          END,
          updated_at = CURRENT_TIMESTAMP
        WHERE attendance.check_in IS NULL
        RETURNING *
      `,
      values: [userId, checkIn],
    })
  } finally {
    client.release()
  }

  // 👇 IMPORTANT PART
  if (res.rows.length === 0) {
    return { success: false, reason: 'ALREADY_CHECKED_IN' }
  }

  return camelcasify(res)
}

export async function checkOutAttendanceQuery({
  userId,
  checkOut,
}: {
  userId: string
  checkOut: string // 'HH:mm'
}) {
  const client = await pool.connect()
  let res = { rows: [] }

  try {
    res = await client.query({
      text: `
        UPDATE attendance
SET
  check_out = $2,
  status = CASE
    WHEN check_in IS NOT NULL
      AND EXTRACT(EPOCH FROM ($2::time - check_in)) / 3600 BETWEEN 2 AND 6
      THEN 'half-day'
    WHEN check_in IS NOT NULL
      AND EXTRACT(EPOCH FROM ($2::time - check_in)) / 3600 >= 6
      THEN 'present'
    ELSE status
  END,
  updated_at = CURRENT_TIMESTAMP
WHERE user_id = $1
  AND date = CURRENT_DATE
  AND check_out IS NULL
RETURNING *;

      `,
      values: [userId, checkOut],
    })
  } finally {
    client.release()
  }

  if (res.rows.length === 0) {
    return { success: false, reason: 'ALREADY_CHECKED_OUT' }
  }

  return camelcasify(res)
}
