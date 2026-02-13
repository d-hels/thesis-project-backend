/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.addColumn('users', {
    role_id: {
      type: 'integer',
      notNull: false,
      references: 'roles(id)',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
  });
};

exports.down = pgm => {
  pgm.dropColumn('users', 'role_id');
};
