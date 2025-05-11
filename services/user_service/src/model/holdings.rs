use crate::model::Pool;
use crate::model::error::{Error, Result};
use chrono::{DateTime, Utc};
use rust_decimal::Decimal;
use sqlx::PgConnection;
use uuid::Uuid;

#[derive(sqlx::FromRow, Debug)]
pub struct Holding {
    pub user_id: Uuid,
    pub symbol: String,
    pub quantity: Decimal,
    pub last_updated: DateTime<Utc>,
}

#[derive(sqlx::FromRow, Debug)]
pub struct NewHolding {
    pub user_id: Uuid,
    pub symbol: String,
    pub quantity: Decimal,
}

pub async fn get_holding_by_symbol(pool: &Pool, id: Uuid, symbol: &String) -> Result<Holding> {
    let query = "SELECT * FROM Holdings WHERE user_id = $1 AND symbol = $2";
    let holdings = sqlx::query_as(query)
        .bind(id)
        .bind(symbol)
        .fetch_one(pool)
        .await
        .map_err(|_e| Error::UserIDNotFound)?;

    return Ok(holdings);
}

pub async fn get_all_holdings_by_id(pool: &Pool, id: Uuid) -> Result<Vec<Holding>> {
    let query = "SELECT * FROM Holdings WHERE user_id = $1";
    let holdings = sqlx::query_as(query)
        .bind(id)
        .fetch_all(pool)
        .await
        .map_err(|_e| Error::UserIDNotFound)?;

    return Ok(holdings);
}

pub async fn add_holding(pool: &mut PgConnection, holding: NewHolding) -> Result<Uuid> {
    let query =
        "INSERT INTO Holdings (user_id, symbol, quantity, last_updated) VALUES ($1, $2, $3, $4)";
    let new_holding: Holding = sqlx::query_as(query)
        .bind(holding.user_id)
        .bind(holding.symbol)
        .bind(holding.quantity)
        .bind(Utc::now())
        .fetch_one(pool)
        .await
        .map_err(|_e| Error::HoldingNotAdded)?;

    return Ok(new_holding.user_id);
}

pub async fn update_quantity(pool: &mut PgConnection, updated: NewHolding) -> Result<()> {
    let query =
        "UPDATE Holdings SET quantity = $1 last_updated = $2 WHERE user_id = $3 AND symbol = $4";
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

pub async fn delete_holding(pool: &Pool, id: Uuid, symbol: String) -> Result<()> {
    let query = "DELETE FROM Holdings WHERE user_id = $1 AND symbol = $2";
    sqlx::query(query)
        .bind(id)
        .bind(symbol)
        .execute(pool)
        .await
        .map_err(|_e| Error::HoldingNotDeleted)?;

    return Ok(());
}
