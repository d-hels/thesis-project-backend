/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.createTable('contracts', {
    id: { type: 'uuid', notNull: true, default: pgm.func('gen_random_uuid()') },

    user_id: {
      type: 'uuid',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },

    contract_type: {
      type: 'varchar(50)',
      notNull: true, // full_time, part_time, temporary
    },

    salary_amount: {
      type: 'numeric(10,2)',
      notNull: true,
    },

    start_date: {
      type: 'date',
      notNull: true,
    },

    end_date: {
      type: 'date',
      notNull: false, // NULL = active contract
    },

    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Add indexes
  pgm.createIndex('contracts', 'id');
  pgm.createIndex('contracts', 'user_id');

  // Set primary key
  pgm.addConstraint('contracts', 'pk_contracts_id', 'PRIMARY KEY(id)');
}

exports.down = pgm => {
  pgm.dropTable('contracts');
}
