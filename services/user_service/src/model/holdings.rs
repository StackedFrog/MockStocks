use crate::model::Pool;
use rust_decimal::Decimal;
use uuid::Uuid;
use crate::model::error::{Error, Result};
use chrono::{DateTime, Utc};

#[derive(sqlx::FromRow, Debug)]
pub struct Holding {
    user_id: Uuid,
    symbol: String,
    quantity: Decimal,
    last_updated: DateTime<Utc>
}

#[derive(sqlx::FromRow, Debug)]
pub struct NewHolding {
    user_id: Uuid,
    symbol: String,
    quantity:  Decimal
}

pub async fn get_all_holdings_by_id(pool: &Pool, id : Uuid) -> Result<Vec<Holding>> {
    let query = "SELECT * FROM Holdings WHERE user_id = ?";
    let holdings = sqlx::query_as(query)
        .bind(id)
        .fetch_all(pool)
        .await
        .map_err(|_e| Error::UserIDNotFound)?;

    return Ok(holdings);
}

pub async fn add_holding(pool : &Pool, holding : NewHolding) -> Result<Uuid> {
    let query = "INSERT INTO Holdings (user_id, symbol, quantity, last_updated) VALUES (?, ?, ?, ?)";
    let new_holding : Holding = sqlx::query_as(query)
    .bind(holding.user_id)
    .bind(holding.symbol)
    .bind(holding.quantity)
    .bind(Utc::now())
    .fetch_one(pool)
    .await
    .map_err(|_e| Error::HoldingNotAdded)?;

    return Ok(new_holding.user_id);
}

pub async fn update_quantity(pool : &Pool, updated : NewHolding) -> Result<()> {
    let query = "UPDATE Holdings SET quantity = ? last_updated = ? WHERE user_id = ? AND symbol = ?";
    sqlx::query(query)
    .bind(updated.quantity)
    .bind(Utc::now())
    .bind(updated.user_id)
    .bind(updated.symbol)
    .execute(pool)
    .await
    .map_err(|_e| Error::HoldingNotUpdated)?;

    return Ok(());
}

pub async fn delete_holding(pool : &Pool, id : Uuid, symbol : String) -> Result<()> {
    let query = "DELETE FROM Holdings WHERE user_id = ? AND symbol = ?";
    sqlx::query(query)
    .bind(id)
    .bind(symbol)
    .execute(pool)
    .await
    .map_err(|_e| Error::HoldingNotDeleted)?;

    return Ok(());
}