/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.addColumn('positions', {
    status: {
      type: 'varchar(50)',
      notNull: true,
      default: 'active',
      // 'active', 'inactive'
    },
  })
}

exports.down = pgm => {
  pgm.dropColumns('positions', [
    'status',
  ])
}
