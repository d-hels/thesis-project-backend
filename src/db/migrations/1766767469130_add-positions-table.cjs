/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.createTable('positions', {
    id: { type: 'uuid', notNull: true, primaryKey: true, default: pgm.func('gen_random_uuid()') },
    department_id: {
      type: 'uuid',
      notNull: true,
      references: 'departments(id)',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    title: { type: 'varchar(100)', notNull: true, unique: true },
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
}

exports.down = pgm => {
  pgm.dropTable('positions');
}
