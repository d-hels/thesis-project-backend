/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.addColumn('workers', {

    hire_date: {
      type: 'date',
      notNull: false
    },

    employment_type: {
      type: 'varchar(50)',
      notNull: false
      // examples: 'full_time', 'part_time', 'contract'
    },

    status: {
      type: 'varchar(50)',
      notNull: false,
      default: 'active'
      // recommended values: 'active', 'suspended', 'terminated'
    }
  })
}

exports.down = pgm => {
  pgm.dropColumns('workers', ['hire_date', 'employment_type', 'status'])
}
