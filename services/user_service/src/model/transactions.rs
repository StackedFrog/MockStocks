use crate::model::Pool;
use rust_decimal::Decimal;
use uuid::Uuid;
use crate::model::error::{Error, Result};
use chrono::{DateTime, Utc};

#[derive(sqlx::FromRow, Debug)]
pub struct Transaction {
    transaction_id: Uuid,
    user_id: Uuid,
    date: DateTime<Utc>,
    symbol: String,
    transaction_type: String,
    quantity: Decimal,
}

#[derive(sqlx::FromRow, Debug)]
pub struct NewTransaction {
    user_id: Uuid,
    date: DateTime<Utc>,
    symbol: String,
    transaction_type: String,
    quantity:  Decimal
}

pub async fn get_all_transactions_by_user(pool: &Pool, user_id : Uuid) -> Result<Vec<Transaction>> {
    let query = "SELECT * FROM Transactions WHERE user_id = ?";
    let transactions = sqlx::query_as(query)
        .bind(user_id)
        .fetch_all(pool)
        .await
        .map_err(|_e| Error::UserIDNotFound)?;

    return Ok(transactions);
}

pub async fn add_transaction(pool : &Pool, transaction : NewTransaction) -> Result<Transaction> {
    let query = "INSERT INTO Transactions (user_id, date, symbol, transaction_type, quantity) VALUES (?, ?, ?, ?, ?)";
    let new_transaction : Transaction = sqlx::query_as(query)
    .bind(transaction.user_id)
    .bind(Utc::now())
    .bind(transaction.symbol)
    .bind(transaction.transaction_type)
    .bind(transaction.quantity)
    .fetch_one(pool)
    .await
    .map_err(|_e| Error::TransactionNotAdded)?;

    return Ok(new_transaction);
}