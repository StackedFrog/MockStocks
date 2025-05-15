use crate::model::Pool;
use crate::model::error::{Error, Result};
use rust_decimal::Decimal;
use serde::Serialize;
use sqlx::PgConnection;
use tracing::info;
use uuid::Uuid;

use super::holdings::delete_all_holdings;
use super::transactions::delete_all_transactions;

#[derive(sqlx::FromRow, Debug, Serialize)]
pub struct User {
    pub user_id: Uuid,
    pub username: String,
    pub role: UserType,
    pub balance: Decimal,
}

#[derive(Debug, sqlx::Type, Serialize)]
#[sqlx(type_name = "user_type")]
pub enum UserType {
    #[sqlx(rename = "admin")]
    Admin,
    #[sqlx(rename = "user")]
    User,
}

// get all users
pub async fn get_all_users(pool: &Pool) -> Result<Vec<User>> {
    let query = "SELECT * FROM Users";
    let users: Vec<User> = sqlx::query_as(query)
        .fetch_all(pool)
        .await
        .map_err(|_e| Error::FailedToFetchUsers)?;

    return Ok(users);
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

pub async fn get_users_role(pool: &Pool, user_id: &Uuid) -> Result<UserType> {
    let query = "SELECT role FROM Users WHERE user_id = $1";
    let user: UserType = sqlx::query_scalar(query)
        .bind(user_id)
        .fetch_one(pool)
        .await
        .map_err(|_| Error::FailedToFetchRole)?;
    Ok(user)
}

// update user balance
pub async fn update_balance(pool: &mut PgConnection, id: &Uuid, balance: Decimal) -> Result<()> {
    let query = "UPDATE Users SET balance = $1 WHERE user_id = $2";
    sqlx::query(query)
        .bind(balance)
        .bind(id)
        .execute(pool)
        .await
        .map_err(|_e| {
            info!("{}", _e);
            Error::BalanceNotUpdated
        })?;

    return Ok(());
}

// delete user
pub async fn delete_user(pool: &mut PgConnection, id: &Uuid) -> Result<()> {
    let query = "DELETE FROM Users WHERE user_id = $1";
    sqlx::query(query)
        .bind(id)
        .execute(pool)
        .await
        .map_err(|_e| Error::UserNotDeleted)?;

    return Ok(());
}

pub async fn delete_user_completely(pool: &Pool, user_id: &Uuid) -> Result<()> {
    // begin transaction (sqlx)
    let mut tx = pool.begin().await.map_err(|_| Error::TxNotCreated)?;

    delete_all_transactions(&mut *tx, user_id).await?;
    delete_all_holdings(&mut *tx, user_id).await?;
    delete_user(&mut *tx, user_id).await?;

    // commit tx
    tx.commit().await.map_err(|_| Error::TxFailed)?;

    Ok(())
}
