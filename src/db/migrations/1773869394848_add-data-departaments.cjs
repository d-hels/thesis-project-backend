/* eslint-disable camelcase */
exports.up = (pgm) => {
    pgm.sql(`
      INSERT INTO departments (
        name,
        description,
        status
      ) VALUES
        ('Software Development', 'Handles all coding, development, and software solutions.', 'active'),
        ('Quality Assurance', 'Responsible for testing and ensuring software quality.', 'active'),
        ('UI/UX Design', 'Designs user interfaces and improves user experience.', 'active'),
        ('DevOps', 'Manages deployment pipelines, servers, and cloud infrastructure.', 'active'),
        ('Product Management', 'Oversees product planning, strategy, and roadmap.', 'active'),
        ('Technical Support', 'Provides support and troubleshooting for clients.', 'active'),
        ('Data Analytics', 'Analyzes data to provide insights and business intelligence.', 'active'),
        ('Cybersecurity', 'Protects company systems and data from security threats.', 'active'),
        ('Human Resources', 'Manages hiring, onboarding, and employee relations.', 'active'),
        ('Marketing & Sales', 'Promotes products and handles client acquisition.', 'active');
    `);
};

exports.down = (pgm) => {
    pgm.sql(`
      DELETE FROM departments 
      WHERE name IN (
        'Software Development',
        'Quality Assurance',
        'UI/UX Design',
        'DevOps',
        'Product Management',
        'Technical Support',
        'Data Analytics',
        'Cybersecurity',
        'Human Resources',
        'Marketing & Sales'
      );
    `);
};