use crate::model::Pool;
use crate::model::error::{Error, Result};
use chrono::{DateTime, Utc};
use rust_decimal::{dec, Decimal};
use serde::Serialize;
use sqlx::PgConnection;
use tracing::info;
use uuid::Uuid;

use super::holdings::{add_holding, delete_holding, update_quantity, NewHolding};
use super::user::update_balance;

#[derive(sqlx::FromRow, Debug, Serialize)]
pub struct Transaction {
    transaction_id: Uuid,
    user_id: Uuid,
    pub date: DateTime<Utc>,
    pub symbol: String,
    pub amount: f64,
    pub price: f64,
    pub transaction_type: TransactionType,
    pub quantity: Decimal,
}

#[derive(sqlx::FromRow, Debug)]
pub struct NewTransaction {
    pub user_id: Uuid,
    pub symbol: String,
    pub amount: f64,
    pub price: f64,
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
        amount: f64,
        price: f64,
        transaction_type: TransactionType,
        quantity: Decimal,
    ) -> Self {
        Self {
            user_id: user_id.clone(),
            symbol,
            amount,
            price,
            transaction_type,
            quantity,
        }
    }
}

pub async fn get_all_transactions_by_user(pool: &Pool, user_id: &Uuid) -> Result<Vec<Transaction>> {
    let query = "SELECT * FROM Transactions WHERE user_id = $1 ORDER BY date DESC";
    let transactions = sqlx::query_as(query)
        .bind(user_id)
        .fetch_all(pool)
        .await
        .map_err(|_e| Error::UserIDNotFound)?;

    return Ok(transactions);
}

pub async fn get_transactions_by_symbol(
    pool: &Pool,
    user_id: &Uuid,
    symbol: &String,
) -> Result<Vec<Transaction>> {
    let query = "SELECT * FROM Transactions WHERE user_id = $1 AND symbol = $2";
    let transactions = sqlx::query_as(query)
        .bind(user_id)
        .bind(symbol)
        .fetch_all(pool)
        .await
        .map_err(|_e| Error::UserIDNotFound)?;

    return Ok(transactions);
}

pub async fn add_transaction(pool: &mut PgConnection, transaction: NewTransaction) -> Result<()> {
    let query = "INSERT INTO Transactions (user_id, date, symbol, amount, price, transaction_type, quantity) VALUES ($1, $2, $3, $4, $5, $6, $7)";
    sqlx::query(query)
        .bind(transaction.user_id)
        .bind(Utc::now())
        .bind(transaction.symbol)
        .bind(transaction.amount)
        .bind(transaction.price)
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
        if new_holding.quantity == dec!(0.0) {
            delete_holding(&mut *tx, user_id, &new_holding.symbol).await?;
        } else {
            update_quantity(&mut *tx, new_holding).await?;
        }
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
