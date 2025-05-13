use crate::stocks_service::Result;
use crate::stocks_service::stocks_service::{
    HistoricQuotes, LatestQuote, QuoteFromRange, TickerSearchResult, fetch_historic_quotes,
    fetch_latest_quote, fetch_latest_quotes_parallel, fetch_quote_from_timerange, fetch_ticker,
};
use crate::yahoo_service::yahoo_service::YahooService;
use axum::{Router, extract::Query, response::Json, routing::get};
use serde::Deserialize;

pub fn routes() -> Router {
    Router::new()
        .route("/stock", get(get_stock_price))
        .route("/range", get(get_range))
        .route("/stocks", get(get_multiple_stock_prices))
        .route("/history", get(get_historic_stock))
        .route("/ticker", get(get_tickers))
        .route("/trending", get(get_trending_quotes))
}

#[derive(Deserialize)]
struct StockQuery {
    symbol: String,
}

#[derive(Deserialize)]
struct RangeQuery {
    symbol: String,
    range: String,
    interval: String,
}

#[derive(Deserialize)]
struct HistoricStockQuery {
    symbol: String,
    start: String,
    end: String,
}

async fn get_stock_price(Query(params): Query<StockQuery>) -> Result<Json<LatestQuote>> {
    let data = fetch_latest_quote(&params.symbol).await?;
    Ok(Json(data))
}

async fn get_range(Query(params): Query<RangeQuery>) -> Result<Json<QuoteFromRange>> {
    let data = fetch_quote_from_timerange(&params.symbol, &params.range, &params.interval).await?;
    Ok(Json(data))
}

async fn get_multiple_stock_prices(
    Query(params): Query<StockQuery>,
) -> Result<Json<Vec<LatestQuote>>> {
    let symbols: Vec<&str> = params.symbol.split(',').map(|s| s.trim()).collect();
    let data = fetch_latest_quotes_parallel(&symbols).await?;
    Ok(Json(data))
}

async fn get_historic_stock(
    Query(params): Query<HistoricStockQuery>,
) -> Result<Json<HistoricQuotes>> {
    let data = fetch_historic_quotes(&params.symbol, &params.start, &params.end).await?;
    Ok(Json(data))
}

async fn get_tickers(Query(params): Query<StockQuery>) -> Result<Json<Vec<TickerSearchResult>>> {
    let data = fetch_ticker(&params.symbol).await?;
    Ok(Json(data))
}

async fn get_trending_quotes() -> Result<Json<Vec<String>>> {
    let service = YahooService::new();
    let data = service.get_trending_symbols().await?;
    Ok(Json(data))
}
