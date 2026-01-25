/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.addColumn('users', {
    position_id: {
      type: 'uuid',
      notNull: false,
      references: 'positions(id)',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    },
  });
}

exports.down = pgm => {
  pgm.dropColumn('users', 'position_id');
}
