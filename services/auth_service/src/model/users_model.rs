use crate::jwt::token_util::TokenData;
use crate::model::Pool;
use crate::model::error::{Error, Result};
use crate::oauth::oauth_autherized::UserData;
use core::fmt;
use serde::{Deserialize, Serialize};
use tracing::info;
use uuid::Uuid;

#[derive(sqlx::FromRow, Debug)]
pub struct User {
    pub user_id: Uuid,
    // pub username: String,
    pub password: String,
    pub role: UserType,
}

impl TokenData for User {
    fn to_token_data(&self) -> (Uuid, UserType) {
        (self.user_id, self.role)
    }
}

#[derive(sqlx::FromRow, Debug)]
pub struct UserTokenData {
    pub user_id: Uuid,
    pub role: UserType,
}

impl TokenData for UserTokenData {
    fn to_token_data(&self) -> (Uuid, UserType) {
        (self.user_id, self.role)
    }
}

#[derive(Debug)]
pub struct NewUser {
    email: String,
    username: String,
    password: String,
    role: UserType,
}

impl NewUser {
    pub fn new(email: String, username: String, pwd_hash: String) -> Self {
        Self {
            email,
            username,
            password: pwd_hash,
            role: UserType::User,
        }
    }
}

#[derive(Debug, sqlx::Type, Deserialize, Serialize, Clone, Copy)]
#[sqlx(type_name = "user_type")]
pub enum UserType {
    #[sqlx(rename = "admin")]
    Admin,
    #[sqlx(rename = "user")]
    User,
}

impl fmt::Display for UserType {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{:?}", self)
    }
}

// get user by id
pub async fn get_user_by_id(pool: &Pool, id: &Uuid) -> Result<User> {
    let query = "SELECT * FROM Users WHERE user_id = $1";
    let user: User = sqlx::query_as(query)
        .bind(id)
        .fetch_one(pool)
        .await
        .map_err(|_e| Error::UserIDNotFound)?;

    return Ok(user);
}

// get user by username
pub async fn get_user_by_username(pool: &Pool, email: String) -> Result<User> {
    let query = "SELECT * FROM Users WHERE email= $1";
    let user: User = sqlx::query_as(query)
        .bind(email)
        .fetch_one(pool)
        .await
        .map_err(|_e| {
            info!("{}", _e);
            Error::UsernameNotFound
        })?;

    return Ok(user);
}

//add user
pub async fn add_user(pool: &Pool, user: NewUser) -> Result<UserTokenData> {
    let query = "INSERT INTO Users (email, username, password, role) VALUES ($1, $2, $3, $4) RETURNING user_id, role";
    let user: UserTokenData = sqlx::query_as(query)
        .bind(user.email)
        .bind(user.username)
        .bind(user.password)
        .bind(user.role)
        .fetch_one(pool)
        .await
        .map_err(|_e| {
            info!("{}", _e);
            Error::UserNotAdded
        })?;
    return Ok(user);
}

pub async fn get_user_by_oauth_id(pool: &Pool, oauth_id: &String) -> Result<Option<UserTokenData>> {
    let query = "SELECT * FROM Users WHERE oauth_id = $1";
    let user: Option<UserTokenData> = sqlx::query_as(query)
        .bind(oauth_id)
        .fetch_optional(pool)
        .await
        .map_err(|_| Error::UserNotAdded)?;
    Ok(user)
}
pub async fn get_users_role(pool: &Pool, user_id: &Uuid) -> Result<UserType> {
    let query = "SELECT role FROM Users WHERE user_id = $1";
    let user: UserType = sqlx::query_scalar(query)
        .bind(user_id)
        .fetch_one(pool)
        .await
        .map_err(|_| Error::UserNotAdded)?;
    Ok(user)
}
//add user
pub async fn add_oauth_user(pool: &Pool, user: UserData) -> Result<UserTokenData> {
    let query =
        "INSERT INTO Users (username, oauth_id, role) VALUES ($1, $2, $3) RETURNING user_id, role";
    let user_id: UserTokenData = sqlx::query_as(query)
        .bind(user.name)
        .bind(user.id)
        .bind(UserType::User)
        .fetch_one(pool)
        .await
        .map_err(|_e| Error::UserNotAdded)?;
    return Ok(user_id);
}

// update pwd
pub async fn update_pwd(pool: &Pool, id: Uuid, new_pwd: String) -> Result<()> {
    let query = "UPDATE Users SET password = $1 WHERE user_id = $2";
    sqlx::query(query)
        .bind(new_pwd)
        .bind(id)
        .execute(pool)
        .await
        .map_err(|_e| Error::PwdNotUpdated)?;

    return Ok(());
}

// update role
pub async fn update_role(pool: &Pool, id: Uuid, new_role: UserType) -> Result<()> {
    let query = "UPDATE Users SET role = $1 WHERE user_id = $2";
    sqlx::query(query)
        .bind(new_role)
        .bind(id)
        .execute(pool)
        .await
        .map_err(|_e| Error::RoleNotUpdated)?;

    return Ok(());
}
