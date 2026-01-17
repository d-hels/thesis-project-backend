/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.addColumn('users', {
    department_id: {
      type: 'integer',
      notNull: false,
      references: 'departments(id)',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    },
  })
}

exports.down = pgm => {
  pgm.dropColumn('users', 'department_id')
}
