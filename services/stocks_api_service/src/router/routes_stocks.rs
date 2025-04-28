use axum::{extract::Query, http::StatusCode, response::IntoResponse, response::Json, routing::get, Router};
use serde::Deserialize;

use crate::services::stocks_service::{fetch_latest_quote, fetch_quote_from_timerange, fetch_latest_quotes_parallel, fetch_historic_quotes, fetch_ticker};

//TODO: implement proper error handling

pub fn routes() -> Router {
    Router::new()
        .route("/stock", get(get_stock_price))
        .route("/range", get(get_range))
        .route("/stocks", get(get_multiple_stock_prices))
        .route("/history", get(get_historic_stock))
        .route("/ticker", get(get_tickers))
}

#[derive(Deserialize)]
struct StockQuery {
    symbol: String,
}

#[derive(Deserialize)]
struct RangeQuery {
    symbol: String,
    range: String,
}

#[derive(Deserialize)]
struct HistoricStockQuery {
    symbol: String,
    start: String,
    end: String,
}

#[derive(Deserialize)]
struct TickerSearchQuery {
    string: String,
}

async fn get_stock_price(Query(params): Query<StockQuery>) -> impl IntoResponse {
    match fetch_latest_quote(&params.symbol).await {
        Ok(data) => (StatusCode::OK, Json(data)).into_response(),
        Err(e) => (StatusCode::BAD_REQUEST, Json(e)).into_response(),
    }
}

async fn get_range(Query(params): Query<RangeQuery>) -> impl IntoResponse {
    match fetch_quote_from_timerange(&params.symbol, &params.range).await {
        Ok(data) => (StatusCode::OK, Json(data)).into_response(),
        Err(e) => (StatusCode::BAD_REQUEST, Json(e)).into_response(),
    }
}

async fn get_multiple_stock_prices(Query(params): Query<StockQuery>) -> impl IntoResponse {
    let symbols: Vec<&str> = params.symbol.split(',').map(|s| s.trim()).collect();
    match fetch_latest_quotes_parallel(&symbols).await {
        Ok(results) => (StatusCode::OK, Json(results)).into_response(),
        Err(e) => (StatusCode::BAD_REQUEST, Json(e)).into_response(),
    }
}

async fn get_historic_stock(Query(params): Query<HistoricStockQuery>) -> impl IntoResponse {
    match fetch_historic_quotes(&params.symbol, &params.start, &params.end).await {
        Ok(data) => (StatusCode::OK, Json(data)).into_response(),
        Err(e) => (StatusCode::BAD_REQUEST, Json(e)).into_response(),
    }
}

async fn get_tickers(Query(params): Query<TickerSearchQuery>) -> impl IntoResponse {
    match fetch_ticker(&params.string).await {
        Ok(results) => (StatusCode::OK, Json(results)).into_response(),
        Err(e) => (StatusCode::BAD_REQUEST, Json(e)).into_response(),
    }
}
