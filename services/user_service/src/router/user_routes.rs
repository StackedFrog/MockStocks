use axum::{Json, Router, extract::State, routing::post};
use rust_decimal::Decimal;
use rust_decimal::dec;
use serde::Deserialize;
use uuid::Uuid;
use shared_utils::ctx::{self, Ctx};
use crate::model::holdings::get_holding_by_symbol;
use crate::model::holdings::update_quantity;
use crate::model::transactions::add_complete_transaction;
use crate::model::{
    ModelManager,
    holdings::NewHolding,
    transactions::{NewTransaction, TransactionType},
    user::{get_user_by_id},
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
    pub balance: Decimal,
}

async fn purchase_handler(
    ctx: Ctx,
    State(mm): State<ModelManager>,
    Json(body): Json<TransactionPayload>,
) -> Result<()> {
    // get user info
    let user_id = ctx.user_id();
    let user = get_user_by_id(&mm.pool, user_id).await?;

    let new_balance = user.balance - body.balance;
    if new_balance < dec!(0.0) {
        Err(Error::InsufficientBalance)?
    }

    // get stock price from API
    let some_price: Decimal = dec!(10.00);
    let quantity = some_price / body.balance;

    // check if holding already exists
    let holding = get_holding_by_symbol(&mm.pool, user_id, &body.symbol).await;

    let new_transaction = NewTransaction::new(user_id, body.symbol.clone(), TransactionType::Purchase, quantity);
    let mut new_holding = NewHolding::new(user_id.clone(), body.symbol, quantity);

    match holding {
        Ok(holding) => {
            // update holding
            new_holding.update_quantity(holding.quantity);
        },
        Err(_holding) => {
            new_holding.set_as_update();
        }
    }

    // trasnsaction
    add_complete_transaction(&mm.pool, user_id, new_balance, new_holding, new_transaction).await?;


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

    // check the holding exists for the user
    let holding = get_holding_by_symbol(&mm.pool, user_id, &body.symbol).await?;
    let quantity = some_price / body.balance;

    if holding.quantity < quantity {
        Err(Error::InsufficientStockQuantity)?
    }

    let new_balance = user.balance + body.balance;

    // add transaction
    let new_transaction = NewTransaction::new(user_id, body.symbol.clone(), TransactionType::Sale, quantity);

    let new_holding = NewHolding::new(user_id.clone(), body.symbol, holding.quantity - quantity);

    // trasnsaction
    add_complete_transaction(&mm.pool, user_id, new_balance, new_holding, new_transaction).await?;

    Ok(())
}
