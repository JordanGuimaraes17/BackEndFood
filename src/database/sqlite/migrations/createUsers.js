const createUsers = `
-- Cria a tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR,
    email VARCHAR,
    password VARCHAR,
    avatar VARCHAR NULL,
    role VARCHAR NOT NULL DEFAULT 'customer', -- Adiciona a coluna 'role' com o valor padrão 'customer'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Define uma restrição de CHECK para garantir que apenas os valores permitidos sejam inseridos na coluna 'role'
    CONSTRAINT check_role CHECK (role IN ('admin', 'customer'))
);


`

module.exports = createUsers
