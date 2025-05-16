use crate::model::holdings::Holding;
use crate::model::holdings::get_all_holdings_by_id;
use crate::model::holdings::get_holding_by_symbol;
use crate::model::transactions::get_transactions_by_symbol;
use crate::model::transactions::Transaction;
use crate::model::transactions::add_complete_transaction;
use crate::model::transactions::get_all_transactions_by_user;
use crate::model::user::User;
use crate::model::user::delete_user_completely;
use crate::model::{
    ModelManager,
    holdings::NewHolding,
    transactions::{NewTransaction, TransactionType},
    user::get_user_by_id,
};
use axum::routing::delete;
use axum::{
    Json, Router,
    extract::State,
    routing::{get, post},
};
use rust_decimal::dec;
use rust_decimal::{Decimal, prelude::FromPrimitive};
use serde::Deserialize;
use serde::Serialize;
use shared_utils::ctx::Ctx;
use tracing::info;

use super::requests::get_stock;
use super::{Error, Result};

pub fn routes(mm: ModelManager) -> Router {
    Router::new()
        .route("/purchase", post(purchase_handler))
        .route("/sale", post(sale_handler))
        .route("/info", get(user_info_handler))
        .route("/holdings", get(holdings_handler))
        .route("/transactions", get(transactions_handler))
        .route("/delete_account", delete(delete_account_handler))
        .with_state(mm)
}

#[derive(Deserialize)]
pub struct TransactionPayload {
    pub symbol: String,
    pub balance: Decimal,
}

#[derive(Serialize)]
pub struct HoldingInfo {
    pub holding: Holding,
    pub performance: Decimal,
    pub price: Decimal,
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
    let latest_quote = get_stock(mm.client, &body.symbol).await?;
    let price = Decimal::from_f64(latest_quote.close).ok_or(Error::FailedToParsePrice)?;
    info!("{}", price);
    let quantity = body.balance / price;
    info!("{}", quantity);
    // check if holding already exists
    let holding = get_holding_by_symbol(&mm.pool, user_id, &body.symbol).await;

    let new_transaction = NewTransaction::new(
        user_id,
        body.symbol.clone(),
        latest_quote.close,
        TransactionType::Purchase,
        quantity,
    );
    let mut new_holding = NewHolding::new(user_id.clone(), body.symbol, quantity);

    match holding {
        Ok(holding) => {
            // update holding
            new_holding.update_quantity(holding.quantity);
        }
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
    let latest_quote = get_stock(mm.client, &body.symbol).await?;
    let price = Decimal::from_f64(latest_quote.close).ok_or(Error::FailedToParsePrice)?;
    info!("{}", price);
    let quantity = body.balance / price;
    info!("{}", quantity);
    // check the holding exists for the user
    let holding = get_holding_by_symbol(&mm.pool, user_id, &body.symbol).await?;

    let new_holding_quantity = holding.quantity - quantity;
    if new_holding_quantity < dec!(0.0) {
        Err(Error::InsufficientStockQuantity)?
    }

    let new_balance = user.balance + body.balance;

    // create transaction and holding
    let new_transaction = NewTransaction::new(
        user_id,
        body.symbol.clone(),
        latest_quote.close,
        TransactionType::Sale,
        quantity,
    );

    let new_holding = NewHolding::new(user_id.clone(), body.symbol, new_holding_quantity);

    // trasnsaction
    add_complete_transaction(&mm.pool, user_id, new_balance, new_holding, new_transaction).await?;

    Ok(())
}

async fn user_info_handler(ctx: Ctx, State(mm): State<ModelManager>) -> Result<Json<User>> {
    let user_id = ctx.user_id();
    let user = get_user_by_id(&mm.pool, user_id).await?;

    Ok(Json(user))
}

async fn holdings_handler(ctx: Ctx, State(mm): State<ModelManager>) -> Result<Json<Vec<HoldingInfo>>> {
    let user_id = ctx.user_id();
    let holdings = get_all_holdings_by_id(&mm.pool, user_id).await?;

    let mut holdings_info : Vec<HoldingInfo> = vec![];

    // iterate holdings and get all transactions for that symbol
    for h in holdings {
        let transactions = get_transactions_by_symbol(&mm.pool, user_id, &h.symbol).await?;
        // calculate total money spent
        let mut total_spent : Decimal = dec!(0.0);

        for t in transactions {
            let price = Decimal::from_f64(t.price).ok_or(Error::FailedToParsePrice)?;
            let transaction_value = price * t.quantity;

            match t.transaction_type {
                TransactionType::Purchase => {
                    total_spent += transaction_value;
                }
                TransactionType::Sale => {
                    total_spent -= transaction_value;
                }
            }
        }
        // calculate current value of holding
        let latest_quote = get_stock(mm.client.clone(), &h.symbol).await?;
        let price = Decimal::from_f64(latest_quote.close).ok_or(Error::FailedToParsePrice)?;
        let current_value = h.quantity * price;
        
        // compare investment vs current value and get profit/loss %
        let performance = ((total_spent - current_value) / current_value) * dec!(100.00);

        // create new struct with info
        let h_info = HoldingInfo { holding: h, performance, price };

        // add to vec of HoldingInfo structs
        holdings_info.push(h_info);
    }

    Ok(Json(holdings_info))
}

async fn transactions_handler(
    ctx: Ctx,
    State(mm): State<ModelManager>,
) -> Result<Json<Vec<Transaction>>> {
    let user_id = ctx.user_id();
    let transactions = get_all_transactions_by_user(&mm.pool, user_id).await?;

    Ok(Json(transactions))
}

async fn delete_account_handler(ctx: Ctx, State(mm): State<ModelManager>) -> Result<()> {
    let user_id = ctx.user_id();
    delete_user_completely(&mm.pool, user_id).await?;

    Ok(())
}
