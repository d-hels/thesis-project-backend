/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.dropColumn('departments', 'user_id')
}

exports.down = pgm => {
  pgm.addColumn('departments', {
    user_id: { type: 'integer', notNull: false }
  })
}
