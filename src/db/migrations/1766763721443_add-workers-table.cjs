/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.createTable('workers', {
    id: { type: 'serial', unique: true },
    user_id: { type: 'serial', unique: true },
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
  })
  pgm.createIndex('workers', 'id')

  pgm.addConstraint(
    'workers',
    'fk_users_userId',
    'FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE'
  )
}

exports.down = pgm => {
  pgm.dropTable('workers')
}
