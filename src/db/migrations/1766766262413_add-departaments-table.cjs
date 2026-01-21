/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.createTable('departments', {
    id: { type: 'uuid', notNull: true, default: pgm.func('gen_random_uuid()') },
    name: { type: 'varchar(100)', notNull: true, unique: true },
    description: { type: 'text', notNull: false },
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

  pgm.createIndex('departments', 'id');
  pgm.addConstraint('departments', 'pk_departments_id', 'PRIMARY KEY(id)');
}

exports.down = pgm => {
  pgm.dropTable('departments');
}
