const createUsers = `
     CREATE TABLE IF NOT EXISTS users(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR,
      email VARCHAR,
      password VARCHAR,
      avatar VARCHAR NULL,
      role VARCHAR NOT NULL DEFAULT 'customer', 
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
     );
     CREATE TYPE roles AS ENUM ('admin', 'customer','sales');
     ALTER TABLE users
     ALTER COLUMN role TYPE roles
     USING (role::roles);
     ALTER TABLE users
     ADD CONSTRAINT check_role CHECK (role IN ('admin', 'customer'));
`

module.exports = createUsers
