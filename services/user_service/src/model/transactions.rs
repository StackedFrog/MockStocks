use crate::model::Pool;
use crate::model::error::{Error, Result};
use chrono::{DateTime, Utc};
use rust_decimal::Decimal;
use sqlx::PgConnection;
use uuid::Uuid;

#[derive(sqlx::FromRow, Debug)]
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

#[derive(Debug, sqlx::Type)]
#[sqlx(type_name = "transaction_type")]
pub enum TransactionType {
    #[sqlx(rename = "purchase")]
    Purchase,
    #[sqlx(rename = "sale")]
    Sale,
}

pub async fn get_all_transactions_by_user(pool: &Pool, user_id: Uuid) -> Result<Vec<Transaction>> {
    let query = "SELECT * FROM Transactions WHERE user_id = $1";
    let transactions = sqlx::query_as(query)
        .bind(user_id)
        .fetch_all(pool)
        .await
        .map_err(|_e| Error::UserIDNotFound)?;

    return Ok(transactions);
}

pub async fn add_transaction(
    pool: &mut PgConnection,
    transaction: NewTransaction,
) -> Result<Transaction> {
    let query = "INSERT INTO Transactions (user_id, date, symbol, transaction_type, quantity) VALUES ($1, $2, $3, $4, $5)";
    let new_transaction: Transaction = sqlx::query_as(query)
        .bind(transaction.user_id)
        .bind(transaction.symbol)
        .bind(transaction.transaction_type)
        .bind(transaction.quantity)
        .fetch_one(pool)
        .await
        .map_err(|_| Error::TransactionNotAdded)?;
}
