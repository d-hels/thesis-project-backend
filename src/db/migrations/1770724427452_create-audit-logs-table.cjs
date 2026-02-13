/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('audit_logs', {
    id: { type: 'uuid', notNull: true,primaryKey: true, default: pgm.func('gen_random_uuid()') },
    user_id: { type: 'uuid', notNull: true, unique: true },
    action: {
      type: 'varchar(50)',
      notNull: true,
    },
    entity: {
      type: 'varchar(50)',
      notNull: true,
    },
    entity_id: {
      type: 'integer',
      notNull: false,
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = pgm => {
  pgm.dropTable('audit_logs');
};
