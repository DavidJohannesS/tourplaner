-- Users Table
CREATE TABLE IF NOT EXISTS tour (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
    --password VARCHAR(255) NOT NULL
);

--CREATE TABLE IF NOT EXISTS cards (
--    id SERIAL PRIMARY KEY,
--    name VARCHAR(255) NOT NULL,
--    damage INTEGER NOT NULL,
--    element_type VARCHAR(50),
--    type VARCHAR(50),
--    owner_id INTEGER REFERENCES users(id)
--);
--
--CREATE TABLE IF NOT EXISTS trades (
--    id UUID PRIMARY KEY,
--    offered_card_id INTEGER REFERENCES cards(id),
--    required_card_type VARCHAR(50),
--    required_element_type VARCHAR(50),
--    min_damage INTEGER,
--    owner_id INTEGER REFERENCES users(id)
--);
--
--CREATE TABLE IF NOT EXISTS packages (
--    id SERIAL PRIMARY KEY,
--    card_ids INTEGER[]
--);
--
--CREATE TABLE IF NOT EXISTS battles (
--    id SERIAL PRIMARY KEY,
--    userA_id INTEGER REFERENCES users(id),
--    userB_id INTEGER REFERENCES users(id),
--    winner_id INTEGER REFERENCES users(id),
--    log TEXT,
--    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
--);
