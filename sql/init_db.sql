CREATE TYPE USER_TYPE AS ENUM('admin', 'user');

CREATE TABLE Users (
    user_id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    email VARCHAR(50) UNIQUE,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(250),
    oauth_id VARCHAR(250),
    role USER_TYPE NOT NULL
);

CREATE TABLE Transactions (
    transaction_id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES Users(user_id),
    date TIMESTAMPTZ NOT NULL,
    symbol VARCHAR(10) NOT NULL, -- code name of company
    transaction_type VARCHAR(10) NOT NULL, -- purchase/sale
    quantity NUMERIC NOT NULL -- amount of shares
);

CREATE TABLE Holdings (
    user_id UUID NOT NULL REFERENCES Users(user_id),
    symbol VARCHAR(10) NOT NULL, -- company code name or 'cash'
    quantity NUMERIC NOT NULL,
    last_updated TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (user_id, symbol) -- composite key since user + symbol should be unique
);
