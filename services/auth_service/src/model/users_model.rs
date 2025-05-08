use core::hash;

use crate::model::Pool;
use crate::model::error::{Error, Result};
use uuid::Uuid;

#[derive(sqlx::FromRow, Debug)]
pub struct User {
    pub user_id: Uuid,
    pub username: String,
    pub password: String,
    pub role: UserType,
    cash: f32,
}

pub struct NewUser {
    username: String,
    password: String,
    role: UserType,
}

impl NewUser {
    pub fn new_basic_user(username: String, pwd_hash: String) -> Self {
        Self {
            username,
            password: pwd_hash,
            role: UserType::User,
        }
    }
}

#[derive(Debug, sqlx::Type)]
#[sqlx(type_name = "user_type")]
pub enum UserType {
    #[sqlx(rename = "admin")]
    Admin,
    #[sqlx(rename = "user")]
    User,
}

pub async fn get_all_users(pool: &Pool) -> Result<Vec<User>> {
    let query = "SELECT * FROM Users";
    let users: Vec<User> = sqlx::query_as(query)
        .fetch_all(pool)
        .await
        .map_err(|_e| Error::UsersNotFound)?;

    return Ok(users);
}

// get user by username
pub async fn get_user_by_username(pool: &Pool, username: String) -> Result<User> {
    let query = "SELECT * FROM Users WHERE username = ?";
    let user: User = sqlx::query_as(query)
        .bind(username)
        .fetch_one(pool)
        .await
        .map_err(|_e| Error::UsernameNotFound)?;

    return Ok(user);
}

//add user
pub async fn add_user(pool: &Pool, user: NewUser) -> Result<Uuid> {
    let query = "INSERT INTO Users (username, password, role) VALUES (?, ?, ?)";
    let user: User = sqlx::query_as(query)
        .bind(user.username)
        .bind(user.password)
        .bind(user.role)
        .fetch_one(pool)
        .await
        .map_err(|_e| Error::UserNotAdded)?;

    return Ok(user.user_id);
}

// update role
pub async fn update_role(pool: &Pool, id: Uuid, new_role: UserType) -> Result<()> {
    let query = "UPDATE Users SET role = ? WHERE user_id = ?";
    sqlx::query(query)
        .bind(new_role)
        .bind(id)
        .execute(pool)
        .await
        .map_err(|_e| Error::RoleNotUpdated)?;

    return Ok(());
}
