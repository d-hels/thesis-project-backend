/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.addColumn('contracts', {
    status: {
      type: 'varchar(50)',
      notNull: true,
      default: 'active',
      // 'draft', 'sent', 'active', 'expired', 'signed_by_employee', 'terminated'
    }
  })
}

exports.down = pgm => {
  pgm.dropColumns('contracts', [
    'status',
  ])
}
