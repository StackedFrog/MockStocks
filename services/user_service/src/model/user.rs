use crate::model::Pool;
use crate::model::error::{Error, Result};
use rust_decimal::Decimal;
use sqlx::PgConnection;
use uuid::Uuid;

#[derive(sqlx::FromRow, Debug)]
pub struct User {
    pub user_id: Uuid,
    pub username: String,
    pub role: UserType,
    pub balance: Decimal,
}

#[derive(Debug, sqlx::Type)]
#[sqlx(type_name = "user_type")]
pub enum UserType {
    #[sqlx(rename = "admin")]
    Admin,
    #[sqlx(rename = "user")]
    User,
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

// update user password
pub async fn update_password(
    pool: &mut PgConnection,
    id: &Uuid,
    new_password: String,
) -> Result<()> {
    let query = "UPDATE Users SET password = $1 WHERE user_id = $2";
    sqlx::query(query)
        .bind(new_password)
        .bind(id)
        .execute(pool)
        .await
        .map_err(|_e| Error::PasswordNotUpdated)?;

    return Ok(());
}

// update user cash
pub async fn update_balance(pool: &mut PgConnection, id: &Uuid, balance: Decimal) -> Result<()> {
    let query = "UPDATE Users SET cash = $1 WHERE user_id = $2";
    sqlx::query(query)
        .bind(balance)
        .bind(id)
        .execute(pool)
        .await
        .map_err(|_e| Error::BalanceNotUpdated)?;

    return Ok(());
}

// delete user
pub async fn delete_user(pool: &Pool, id: &Uuid) -> Result<()> {
    let query = "DELETE FROM Users WHERE user_id = $1";
    sqlx::query(query)
        .bind(id)
        .execute(pool)
        .await
        .map_err(|_e| Error::UserNotDeleted)?;

    return Ok(());
}
