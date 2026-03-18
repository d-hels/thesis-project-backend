/* eslint-disable camelcase */
exports.up = (pgm) => {
    pgm.sql(`
      INSERT INTO users (
        first_name,
        last_name,
        email,
        password,
        phone,
        address,
        status,
        is_active,
        is_verified,
        role_id,
        created_at
      ) VALUES (
        'Dielleza',
        'Helshani',
        'admin4@admin.com',
        '$2b$10$jHy/7GAMUpfc1iiWjtr6HOfcympGW1l02IVCrwzgNt.b/81RjBRCC',
        '045 949 101',
        'Beqe shaqa',
        'active',
        true,
        true,
        1,
        '2026-03-18 19:47:26.714454+00'
      );
    `);
  };
  
  exports.down = (pgm) => {
    pgm.sql(`
      DELETE FROM users WHERE email = 'admin@admin.com';
    `);
  };