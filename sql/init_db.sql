CREATE TYPE USER_TYPE AS ENUM('admin', 'user');

CREATE TABLE Users (
    user_id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(50) NOT NULL,
    role USER_TYPE NOT NULL
);