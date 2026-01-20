/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.addColumn('users', {

    // Employment info
    hire_date: {
      type: 'date',
      notNull: false,
    },

    status: {
      type: 'varchar(50)',
      notNull: true,
      default: 'active',
      // 'active', 'on_leave', 'suspended', 'terminated'
    },

    // Account & access control
    is_active: {
      type: 'boolean',
      notNull: true,
      default: true,
    },

    is_verified: {
      type: 'boolean',
      notNull: true,
      default: true,
    },

    last_login_at: {
      type: 'timestamp with time zone',
      notNull: false,
    },

    deleted_at: {
      type: 'timestamp with time zone',
      notNull: false,
    },
    //  UPDATE users
    //  SET deleted_at = NOW(),
    //  is_active = false
    //  WHERE id = 5;

  })
}

exports.down = pgm => {
  pgm.dropColumns('users', [
    'hire_date',
    'status',
    'is_active',
    'is_verified',
    'last_login_at',
    'deleted_at',
  ])
}
