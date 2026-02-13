/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  // Enable the uuid-ossp extension if not already enabled
  pgm.sql('CREATE EXTENSION IF NOT EXISTS "pgcrypto";'); // for gen_random_uuid()

  pgm.createTable('users', {
    id: { type: 'uuid', notNull: true, primaryKey: true, default: pgm.func('gen_random_uuid()') },
    first_name: { type: 'varchar(80)', notNull: true },
    last_name: { type: 'varchar(80)', notNull: true },
    email: { type: 'varchar(80)', notNull: true, unique: true },
    password: { type: 'varchar(255)', notNull: true },
    phone: { type: 'text', notNull: false },
    address: { type: 'text', notNull: false },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp with time zone',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

};

exports.down = pgm => {
  pgm.dropTable('users');
};
