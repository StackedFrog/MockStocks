CREATE TYPE USER_TYPE AS ENUM('admin', 'user');
CREATE TYPE TRANSACTION_TYPE AS ENUM('purchase', 'sale');

CREATE TABLE Users (
    user_id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    email VARCHAR(50) NOT NULL UNIQUE,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(250),
    oauth_id VARCHAR(250) UNIQUE,
    role USER_TYPE NOT NULL,
    balance NUMERIC NOT NULL DEFAULT 25000.00
);

CREATE TABLE Transactions (
    transaction_id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES Users(user_id),
    date TIMESTAMPTZ NOT NULL,
    symbol VARCHAR(10) NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    transaction_type TRANSACTION_TYPE NOT NULL,
    quantity NUMERIC NOT NULL
);

CREATE TABLE Holdings (
    user_id UUID NOT NULL REFERENCES Users(user_id),
    symbol VARCHAR(10) NOT NULL,
    quantity NUMERIC NOT NULL,
    last_updated TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (user_id, symbol) -- composite key since user + symbol should be unique
);
