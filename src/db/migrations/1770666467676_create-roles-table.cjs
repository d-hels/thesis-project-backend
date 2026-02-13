/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('roles', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    name: {
      type: 'varchar(50)',
      notNull: true,
      unique: true,
    },
  });

  pgm.sql(`
    INSERT INTO roles (name)
    VALUES ('admin'), ('manager'), ('worker');
  `);
};

exports.down = pgm => {
  pgm.dropTable('roles');
};
