/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.createTable('attendance', {
    id: { type: 'serial', primaryKey: true },
    user_id: { type: 'integer', notNull: true },
    date: { type: 'date', notNull: true },
    check_in: { type: 'time', notNull: false },
    check_out: { type: 'time', notNull: false },
    status: { type: 'varchar(20)', notNull: true },
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

  pgm.createIndex('attendance', 'user_id')
  pgm.createIndex('attendance', 'date')

  pgm.addConstraint(
    'attendance',
    'fk_attendance_user',
    'FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE'
  )

  // one attendance per user per day
  pgm.addConstraint(
    'attendance',
    'unique_user_date',
    'UNIQUE(user_id, date)'
  )
}

exports.down = pgm => {
  pgm.dropTable('attendance')
}
