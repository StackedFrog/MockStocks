use crate::model::Pool;
use crate::model::error::{Error, Result};
use chrono::{DateTime, Utc};
use rust_decimal::Decimal;
use serde::Serialize;
use sqlx::PgConnection;
use tracing::info;
use uuid::Uuid;

#[derive(sqlx::FromRow, Debug, Serialize)]
pub struct Holding {
    pub user_id: Uuid,
    pub symbol: String,
    pub quantity: Decimal,
    pub last_updated: DateTime<Utc>,
}

#[derive(sqlx::FromRow, Debug)]
pub struct NewHolding {
    pub update: bool,
    pub user_id: Uuid,
    pub symbol: String,
    pub quantity: Decimal,
}

impl NewHolding {
    pub fn new(user_id: Uuid, symbol: String, quantity: Decimal) -> Self {
        NewHolding {
            update: true,
            user_id,
            symbol,
            quantity,
        }
    }

    pub fn update_quantity(self: &mut Self, quantity: Decimal) -> &Self {
        //self.update = true;
        self.quantity += quantity;
        self
    }

    pub fn set_as_update(self: &mut Self) -> &Self {
        self.update = false;
        self
    }
}

pub async fn get_holding_by_symbol(pool: &Pool, id: &Uuid, symbol: &String) -> Result<Holding> {
    let query = "SELECT * FROM Holdings WHERE user_id = $1 AND symbol = $2";
    let holding = sqlx::query_as(query)
        .bind(id)
        .bind(symbol)
        .fetch_one(pool)
        .await
        .map_err(|_e| Error::UserIDNotFound)?;

    return Ok(holding);
}

pub async fn get_all_holdings_by_id(pool: &Pool, id: &Uuid) -> Result<Vec<Holding>> {
    let query = "SELECT * FROM Holdings WHERE user_id = $1";
    let holdings = sqlx::query_as(query)
        .bind(id)
        .fetch_all(pool)
        .await
        .map_err(|_e| Error::UserIDNotFound)?;

    return Ok(holdings);
}

pub async fn add_holding(pool: &mut PgConnection, holding: NewHolding) -> Result<()> {
    let query =
        "INSERT INTO Holdings (user_id, symbol, quantity, last_updated) VALUES ($1, $2, $3, $4)";
    sqlx::query(query)
        .bind(holding.user_id)
        .bind(holding.symbol)
        .bind(holding.quantity)
        .bind(Utc::now())
        .execute(pool)
        .await
        .map_err(|_e| Error::HoldingNotAdded)?;

    return Ok(());
}

pub async fn update_quantity(pool: &mut PgConnection, updated: NewHolding) -> Result<()> {
    let query =
        "UPDATE Holdings SET quantity = $1, last_updated = $2 WHERE user_id = $3 AND symbol = $4";
    sqlx::query(query)
        .bind(updated.quantity)
        .bind(Utc::now())
        .bind(updated.user_id)
        .bind(updated.symbol)
        .execute(pool)
        .await
        .map_err(|_e| {
            info!("{}", _e);
            Error::HoldingNotUpdated
        })?;

    return Ok(());
}

pub async fn delete_holding(pool: &mut PgConnection, id: &Uuid, symbol: &String) -> Result<()> {
    let query = "DELETE FROM Holdings WHERE user_id = $1 AND symbol = $2";
    sqlx::query(query)
        .bind(id)
        .bind(symbol)
        .execute(pool)
        .await
        .map_err(|_e| Error::HoldingNotDeleted)?;

    return Ok(());
}

pub async fn delete_all_holdings(pool: &mut PgConnection, user_id: &Uuid) -> Result<()> {
    let query = "DELETE FROM Holdings WHERE user_id = $1";
    sqlx::query(query)
        .bind(user_id)
        .execute(pool)
        .await
        .map_err(|_e| Error::HoldingsNotDeleted)?;

    return Ok(());
}
