use axum::{extract::Query, http::StatusCode, response::IntoResponse, response::Json, routing::get, Router};
use serde::Deserialize;

use crate::services::stocks_service::{fetch_latest_quote, fetch_quote_from_timerange, fetch_latest_quotes_parallel, fetch_historic_quotes, fetch_ticker, fetch_trending_quotes};

/// Defines all routes available in the Stocks API service.
///
/// # Routes
/// - `GET /stock`: Fetch latest quote for a stock symbol.
/// - `GET /range`: Fetch historical quotes for a stock in a date range.
/// - `GET /stocks`: Fetch latest quotes for multiple symbols (comma-separated).
/// - `GET /history`: Fetch historical quotes between start and end dates.
/// - `GET /ticker`: Search for tickers by company name or keyword.
/// - `GET /trending`: Fetch trending stock quotes in the US market.
pub fn routes() -> Router {
    Router::new()
        .route("/stock", get(get_stock_price))
        .route("/range", get(get_range))
        .route("/stocks", get(get_multiple_stock_prices))
        .route("/history", get(get_historic_stock))
        .route("/ticker", get(get_tickers))
        .route("/trending", get(get_trending_quotes))
}

/// Query parameters for `/stock` and `/stocks` endpoints.
#[derive(Deserialize)]
struct StockQuery {
    symbol: String,
}

/// Query parameters for `/range` endpoint.
#[derive(Deserialize)]
struct RangeQuery {
    symbol: String,
    range: String,
}

/// Query parameters for `/history` endpoint.
#[derive(Deserialize)]
struct HistoricStockQuery {
    symbol: String,
    start: String,
    end: String,
}

/// Query parameters for `/ticker` endpoint.
#[derive(Deserialize)]
struct TickerSearchQuery {
    string: String,
}

/// Handler for `GET /stock`
///
/// Fetches the latest quote for a single stock symbol.
///
/// **Query Parameters:**
/// - `symbol` (required): The stock symbol (e.g., AAPL)
///
/// **Returns:** JSON with latest quote info.
async fn get_stock_price(Query(params): Query<StockQuery>) -> impl IntoResponse {
    match fetch_latest_quote(&params.symbol).await {
        Ok(data) => (StatusCode::OK, Json(data)).into_response(),
        Err(e) => e.into_response() 
    }
}

/// Handler for `GET /range`
///
/// Fetches historical quotes for a symbol over a date range.
///
/// **Query Parameters:**
/// - `symbol` (required): Stock symbol.
/// - `range` (required): Date range (e.g., "6mo")
///
/// **Returns:** JSON with historical quotes.
async fn get_range(Query(params): Query<RangeQuery>) -> impl IntoResponse {
    match fetch_quote_from_timerange(&params.symbol, &params.range).await {
        Ok(data) => (StatusCode::OK, Json(data)).into_response(),
        Err(e) => e.into_response() 
    }
}

/// Handler for `GET /stocks`
///
/// Fetches the latest quotes for multiple stock symbols (parallel fetch).
///
/// **Query Parameters:**
/// - `symbol` (required): Comma-separated symbols (e.g., "AAPL,GOOG,MSFT")
///
/// **Returns:** JSON array of latest quotes.
async fn get_multiple_stock_prices(Query(params): Query<StockQuery>) -> impl IntoResponse {
    let symbols: Vec<&str> = params.symbol.split(',').map(|s| s.trim()).collect();
    match fetch_latest_quotes_parallel(&symbols).await {
        Ok(results) => (StatusCode::OK, Json(results)).into_response(),
        Err(e) => e.into_response() 
    }
}

/// Handler for `GET /history`
///
/// Fetches historical quotes between start and end dates.
///
/// **Query Parameters:**
/// - `symbol` (required): Stock symbol.
/// - `start` (required): Start date (RFC3339 format)
/// - `end` (required): End date (RFC3339 format)
///
/// **Returns:** JSON with historical quotes.
async fn get_historic_stock(Query(params): Query<HistoricStockQuery>) -> impl IntoResponse {
    match fetch_historic_quotes(&params.symbol, &params.start, &params.end).await {
        Ok(data) => (StatusCode::OK, Json(data)).into_response(),
        Err(e) => e.into_response() 
    }
}

/// Handler for `GET /ticker`
///
/// Searches for stock tickers by company name or keyword.
///
/// **Query Parameters:**
/// - `string` (required): Search string (e.g., "Apple")
///
/// **Returns:** JSON array of matching tickers.
async fn get_tickers(Query(params): Query<TickerSearchQuery>) -> impl IntoResponse {
    match fetch_ticker(&params.string).await {
        Ok(results) => (StatusCode::OK, Json(results)).into_response(),
        Err(e) => e.into_response() 
    }
}

/// Handler for `GET /trending`
///
/// Fetches the latest quotes for trending stocks in the US market.
///
/// **Returns:** JSON array of trending stock quotes.
async fn get_trending_quotes() -> impl IntoResponse {
    match fetch_trending_quotes().await {
        Ok(quotes) => (StatusCode::OK, Json(quotes)).into_response(),
        Err(e) => e.into_response() 
    }
}
