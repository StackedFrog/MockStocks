-- Ensure required extension is enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Insert mock users
INSERT INTO Users (email, username, password, oauth_id, role, balance) VALUES
('alice@example.com', 'alice', 'hashed_pw_1', NULL, 'user', 24000.00),
('bob@example.com', 'bob', 'hashed_pw_2', NULL, 'user', 18000.00),
('charlie@example.com', 'charlie', 'hashed_pw_3', NULL, 'admin', 50000.00);

-- Select user_ids for use in transactions
WITH u AS (
  SELECT user_id, username FROM Users WHERE username IN ('alice', 'bob', 'charlie')
)
-- Insert mock transactions
INSERT INTO Transactions (user_id, date, symbol, price, transaction_type, quantity)
SELECT
  u.user_id,
  NOW() - (INTERVAL '1 day' * g.i),
  g.symbol,
  g.price,
  g.transaction_type,
  g.quantity
FROM u,
  (VALUES
    ('AAPL', 180.50, 'purchase'::TRANSACTION_TYPE, 10, 0),
    ('AAPL', 182.00, 'sale'::TRANSACTION_TYPE, 5, 1),
    ('TSLA', 250.25, 'purchase'::TRANSACTION_TYPE, 3, 2),
    ('GOOG', 2750.10, 'purchase'::TRANSACTION_TYPE, 2, 3),
    ('MSFT', 310.20, 'sale'::TRANSACTION_TYPE, 1, 4)
  ) AS g(symbol, price, transaction_type, quantity, i);

-- Insert mock holdings (one per user for now)
WITH u AS (
  SELECT user_id, username FROM Users WHERE username IN ('alice', 'bob', 'charlie')
)
INSERT INTO Holdings (user_id, symbol, quantity, last_updated)
SELECT
  u.user_id,
  g.symbol,
  g.quantity,
  NOW() - (INTERVAL '1 day' * g.i)
FROM u,
  (VALUES
    ('AAPL', 5, 0),
    ('TSLA', 3, 1),
    ('GOOG', 2, 2)
  ) AS g(symbol, quantity, i);
