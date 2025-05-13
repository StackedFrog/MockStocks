use std::sync::Arc;

use super::{ClientManager, Error, Result};
use chrono::{DateTime, Local};
use futures::future::try_join_all;
use serde::Serialize;
use time::{OffsetDateTime, format_description::well_known::Rfc3339};
use yahoo_finance_api::{Quote, YahooConnector};

#[derive(Serialize, Clone)]
pub struct LatestQuote {
    pub symbol: String,
    pub date: String,
    pub close: f64,
    pub open: f64,
    pub high: f64,
    pub low: f64,
    pub volume: u64,
}

#[derive(Serialize)]
pub struct QuoteFromRange {
    pub symbol: String,
    pub range: String,
    pub quotes: Vec<Quote>,
}

#[derive(Serialize)]
pub struct HistoricQuotes {
    pub symbol: String,
    pub start: String,
    pub end: String,
    pub quotes: Vec<Quote>,
}

#[derive(Serialize)]
pub struct TickerSearchResult {
    pub symbol: String,
    pub name: String,
    pub exchange: String,
}

pub async fn fetch_latest_quote(
    provider: Arc<YahooConnector>,
    symbol: &str) -> Result<LatestQuote> {

    // YahooConnector::new().map_err(|_| Error::ApiConnectorFailure)?;

    let response = provider
        .get_latest_quotes(symbol, "1d")
        .await
        .map_err(|_| Error::FailedToFetch)?;

    let quote = response
        .last_quote()
        .map_err(|_| Error::FailedToExtractQuote)?;

    let utc_date =
        DateTime::from_timestamp(quote.timestamp as i64, 0).ok_or(Error::FailedToParse)?;
    let local_date: DateTime<Local> = DateTime::from(utc_date);

    Ok(LatestQuote {
        symbol: symbol.to_string(),
        date: local_date.to_string(),
        close: quote.close,
        open: quote.open,
        high: quote.high,
        low: quote.low,
        volume: quote.volume,
    })
}

pub async fn fetch_quote_from_timerange(
    provider: Arc<YahooConnector>,
    symbol: &str,
    range: &str,
    interval: &str,
) -> Result<QuoteFromRange> {
    // let provider = YahooConnector::new().map_err(|_| Error::ApiConnectorFailure)?;

    let response = provider
        .get_quote_range(symbol, interval, range)
        .await
        .map_err(|_| Error::FailedToFetch)?;

    let fetched_quotes = response.quotes().map_err(|_| Error::FailedToExtractQuote)?;

    Ok(QuoteFromRange {
        symbol: symbol.to_string(),
        range: range.to_string(),
        quotes: fetched_quotes,
    })
}

pub async fn fetch_latest_quotes_parallel(provider: Arc<YahooConnector>,symbols: &[&str]) -> Result<Vec<LatestQuote>> {
    if symbols.len() > 10 {
        return Err(Error::TooManySymbols);
    }

    let fetches = symbols.iter().map(|&symbol| fetch_latest_quote(provider.clone(), symbol));

    let results = try_join_all(fetches)
        .await
        .map_err(|_| Error::FailedtoFetchMultipleQuotes)?;

    Ok(results)
}

pub async fn fetch_historic_quotes(

    provider: Arc<YahooConnector>,
    symbol: &str, start: &str, end: &str) -> Result<HistoricQuotes> {
    // let provider = YahooConnector::new().map_err(|_| Error::ApiConnectorFailure)?;

    let start_offset = OffsetDateTime::parse(start, &Rfc3339).map_err(|_| Error::FailedToParse)?;
    let end_offset = OffsetDateTime::parse(end, &Rfc3339).map_err(|_| Error::FailedToParse)?;
    let response = provider
        .get_quote_history(symbol, start_offset, end_offset)
        .await
        .map_err(|_| Error::FailedToFetch)?;

    let fetched_quotes = response.quotes().map_err(|_| Error::FailedToExtractQuote)?;

    Ok(HistoricQuotes {
        symbol: symbol.to_string(),
        start: start.to_string(),
        end: end.to_string(),
        quotes: fetched_quotes,
    })
}

pub async fn fetch_ticker(

    provider: Arc<YahooConnector>,
    search_term: &str) -> Result<Vec<TickerSearchResult>> {
    // let provider = YahooConnector::new().map_err(|_| Error::ApiConnectorFailure)?;

    let response = provider
        .search_ticker(search_term)
        .await
        .map_err(|_| Error::FailedToSearchForTicker)?;

    let results = response
        .quotes
        .into_iter()
        .map(|quote| TickerSearchResult {
            symbol: quote.symbol,
            name: quote.long_name,
            exchange: quote.exchange,
        })
        .collect();

    Ok(results)
}
