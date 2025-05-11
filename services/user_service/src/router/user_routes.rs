use axum::{Json, Router, extract::State, routing::post};
use rust_decimal::Decimal;
use rust_decimal::dec;
use serde::Deserialize;
use uuid::Uuid;
use shared_utils::ctx::{self, Ctx};
use crate::model::holdings::get_holding_by_symbol;
use crate::model::holdings::update_quantity;
use crate::model::{
    ModelManager,
    holdings::{NewHolding, add_holding},
    transactions::{NewTransaction, TransactionType, add_transaction},
    user::{get_user_by_id, update_cash},
};

use super::{Error, Result};

pub fn routes(mm: ModelManager) -> Router {
    Router::new()
        .route("/purchase", post(purchase_handler))
        .route("/sale", post(sale_handler))
        .with_state(mm)
}

#[derive(Deserialize)]
pub struct TransactionPayload {
    pub symbol: String,
    pub cash: Decimal,
}

async fn purchase_handler(
    ctx: Ctx,
    State(mm): State<ModelManager>,
    Json(body): Json<TransactionPayload>,
) -> Result<()> {
    // get user info
    let user_id = ctx.user_id();
    let user = get_user_by_id(&mm.pool, user_id).await?;

    // get stock price from API
    let some_price: Decimal = dec!(10.00);
    let new_cash = user.cash - body.cash;
    let quantity = some_price / body.cash;

    if new_cash < dec!(0.0) {
        // something to stop
    }

    // check if holding already exists
    let holding = get_holding_by_symbol(&mm.pool, user_id, &body.symbol).await;

    // begin transaction (sqlx)
    let mut tx = mm.pool.begin().await.map_err(|_| Error::TxNotCreated)?;

    // update cash from user
    update_cash(&mut *tx, user_id, new_cash).await?;

    // add transaction
    let new_transaction = NewTransaction {
        user_id,
        symbol: body.symbol.clone(),
        transaction_type: TransactionType::Purchase,
        quantity: quantity,
    };

    add_transaction(&mut *tx, new_transaction).await?;

    match holding {
        Ok(holding) => {
            // update holding
            let updated_holding = NewHolding {
                user_id,
                symbol: body.symbol.clone(),
                quantity: holding.quantity + quantity
            };
            update_quantity(&mut *tx, updated_holding);
        },
        Err(_holding) => {
            // add holding
            let new_holding = NewHolding {
                user_id,
                symbol: body.symbol.clone(),
                quantity
            };
            add_holding(&mut *tx, new_holding).await?;
        }
    }

    // commit tx
    tx.commit().await;

    Ok(())
}

async fn sale_handler(
    ctx: Ctx,
    State(mm): State<ModelManager>,
    Json(body): Json<TransactionPayload>,
) -> Result<()> {
    // get user info
    let user_id = ctx.user_id();
    let user = get_user_by_id(&mm.pool, user_id).await?;

    // get stock price from API
    let some_price: Decimal = dec!(10.00);
    let new_cash = user.cash + some_price * body.quantity;

    // begin transaction (sqlx)
    let mut tx = mm.pool.begin().await.map_err(|_| Error::TxNotCreated)?;

    // update cash from user
    update_cash(&mut *tx, user_id, new_cash).await?;

    // add transaction
    let new_transaction = NewTransaction {
        user_id,
        symbol: body.symbol.clone(),
        transaction_type: TransactionType::Purchase,
        quantity: body.quantity,
    };

    add_transaction(&mut *tx, new_transaction).await?;

    // add holding
    let new_holding = NewHolding {
        user_id,
        symbol: body.symbol.clone(),
        quantity: body.quantity,
    };

    add_holding(&mut *tx, new_holding).await?;

    // commit tx
    tx.commit().await;

    Ok(())
}
// mm.pool.acquire().await.unwrap()
