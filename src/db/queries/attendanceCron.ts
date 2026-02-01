import cron from "node-cron";
import pool from "../setup";

cron.schedule("59 23 * * *", async () => {
  const client = await pool.connect();

  try {
    await client.query(`
      INSERT INTO attendance (user_id, date, status)
      SELECT u.id, CURRENT_DATE, 'absent'
      FROM users u
      WHERE u.role IS DISTINCT FROM 'admin'
      AND NOT EXISTS (
        SELECT 1
        FROM attendance a
        WHERE a.user_id = u.id
        AND a.date = CURRENT_DATE
      );
    `);

    console.log("Absent users marked automatically");
  } catch (err) {
    console.error("Attendance cron failed", err);
  } finally {
    client.release();
  }
});
