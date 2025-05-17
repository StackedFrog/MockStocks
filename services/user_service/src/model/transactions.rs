use crate::model::Pool;
use crate::model::error::{Error, Result};
use chrono::{DateTime, Utc};
use rust_decimal::Decimal;
use serde::Serialize;
use sqlx::PgConnection;
use tracing::info;
use uuid::Uuid;

use super::holdings::{NewHolding, add_holding, update_quantity};
use super::user::update_balance;

#[derive(sqlx::FromRow, Debug, Serialize)]
pub struct Transaction {
    transaction_id: Uuid,
    user_id: Uuid,
    date: DateTime<Utc>,
    symbol: String,
    transaction_type: TransactionType,
    quantity: Decimal,
}

#[derive(sqlx::FromRow, Debug)]
pub struct NewTransaction {
    pub user_id: Uuid,
    pub symbol: String,
    pub transaction_type: TransactionType,
    pub quantity: Decimal,
}

#[derive(Debug, sqlx::Type, Serialize)]
#[sqlx(type_name = "transaction_type")]
pub enum TransactionType {
    #[sqlx(rename = "purchase")]
    Purchase,
    #[sqlx(rename = "sale")]
    Sale,
}

impl NewTransaction {
    pub fn new(
        user_id: &Uuid,
        symbol: String,
        transaction_type: TransactionType,
        quantity: Decimal,
    ) -> Self {
        Self {
            user_id: user_id.clone(),
            symbol,
            transaction_type,
            quantity,
        }
    }
}

pub async fn get_all_transactions_by_user(pool: &Pool, user_id: &Uuid) -> Result<Vec<Transaction>> {
    let query = "SELECT * FROM Transactions WHERE user_id = $1";
    let transactions = sqlx::query_as(query)
        .bind(user_id)
        .fetch_all(pool)
        .await
        .map_err(|_e| Error::UserIDNotFound)?;

    return Ok(transactions);
}

pub async fn add_transaction(pool: &mut PgConnection, transaction: NewTransaction) -> Result<()> {
    let query = "INSERT INTO Transactions (user_id, date, symbol, transaction_type, quantity) VALUES ($1, $2, $3, $4, $5)";
    sqlx::query(query)
        .bind(transaction.user_id)
        .bind(Utc::now())
        .bind(transaction.symbol)
        .bind(transaction.transaction_type)
        .bind(transaction.quantity)
        .execute(pool)
        .await
        .map_err(|_e| {
            info!("{}", _e);
            Error::TransactionNotAdded
        })?;

    Ok(())
}

pub async fn add_complete_transaction(
    pool: &Pool,
    user_id: &Uuid,
    new_balance: Decimal,
    new_holding: NewHolding,
    new_transaction: NewTransaction,
) -> Result<()> {
    // begin transaction (sqlx)
    let mut tx = pool.begin().await.map_err(|_| Error::TxNotCreated)?;

    update_balance(&mut *tx, user_id, new_balance).await?;
    add_transaction(&mut *tx, new_transaction).await?;

    if new_holding.update {
        update_quantity(&mut *tx, new_holding).await?;
    } else {
        add_holding(&mut *tx, new_holding).await?;
    }

    // commit tx
    tx.commit().await.map_err(|_| Error::TxFailed)?;

    Ok(())
}

pub async fn delete_all_transactions(pool: &mut PgConnection, user_id: &Uuid) -> Result<()> {
    let query = "DELETE FROM Transactions WHERE user_id = $1";
    sqlx::query(query)
        .bind(user_id)
        .execute(pool)
        .await
        .map_err(|_e| Error::TransactionsNotDeleted)?;

    return Ok(());
}
