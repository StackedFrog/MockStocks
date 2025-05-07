use yahoo_finance_api::{Quote, YahooConnector};
use chrono::{DateTime, Local};
use serde::Serialize;
use time::{OffsetDateTime, format_description::well_known::Rfc3339};
use futures::future::try_join_all;
use super::{Error, Result};
// use reqwest::header::{HeaderMap, HeaderValue, USER_AGENT, ACCEPT, ACCEPT_LANGUAGE, CONNECTION};
// use serde_json::Value;
// use reqwest;

#[derive(Serialize, Clone)]
pub struct LatestQuote {
    pub symbol: String,
    pub date: String,
    pub close_price: f64,
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

pub async fn fetch_latest_quote(symbol: &str) -> Result<LatestQuote> {
    let provider = YahooConnector::new().map_err(|_| Error::ApiConnectorFailure)?;

    let response = provider
        .get_latest_quotes(symbol, "1d")
        .await
        .map_err(|_| Error::FailedToFetch)?;

    let quote = response
        .last_quote()
        .map_err(|_| Error::FailedToExtractQuote)?;

    let utc_date = DateTime::from_timestamp(quote.timestamp as i64, 0)
        .ok_or(Error::FailedToParseDateTime)?;
    let local_date: DateTime<Local> = DateTime::from(utc_date);

    Ok(LatestQuote {
        symbol: symbol.to_string(),
        date: local_date.to_string(),
        close_price: quote.close,
    })
}

pub async fn fetch_quote_from_timerange(symbol: &str, range: &str) -> Result<QuoteFromRange> {
    let provider = YahooConnector::new().map_err(|_| Error::ApiConnectorFailure)?;

    let response = provider
        .get_quote_range(symbol, "1d", range)
        .await
        .map_err(|_| Error::FailedToFetch)?;

    let fetched_quotes = response.quotes().map_err(|_| Error::FailedToExtractQuote)?;

    Ok(QuoteFromRange {
        symbol: symbol.to_string(),
        range: range.to_string(),
        quotes: fetched_quotes,
    })
}

pub async fn fetch_latest_quotes_parallel(symbols: &[&str]) -> Result<Vec<LatestQuote>> {
    if symbols.len() > 10 {
        return Err(Error::TooManySymbols);
    }

    let fetches = symbols.iter().map(|&symbol| fetch_latest_quote(symbol));

    let results = try_join_all(fetches)
        .await
        .map_err(|_| Error::FailedtoFetchMultipleQuotes)?;

    Ok(results)
}

pub async fn fetch_historic_quotes(symbol: &str, start: &str, end: &str) -> Result<HistoricQuotes> {
    let provider = YahooConnector::new().map_err(|_| Error::ApiConnectorFailure)?;

    let start_offset =
        OffsetDateTime::parse(start, &Rfc3339).map_err(|_| Error::FailedToParseDateTime)?;
    let end_offset =
        OffsetDateTime::parse(end, &Rfc3339).map_err(|_| Error::FailedToParseDateTime)?;
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

pub async fn fetch_ticker(search_term: &str) -> Result<Vec<TickerSearchResult>> {
    let provider = YahooConnector::new().map_err(|_| Error::ApiConnectorFailure)?;

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

// pub async fn fetch_trending_quotes() -> Result<Vec<LatestQuote>> {
//
//     let client = reqwest::Client::new();
//     let trending_url = "https://query1.finance.yahoo.com/v1/finance/trending/US";
//
//     let mut headers = HeaderMap::new();
//     headers.insert(USER_AGENT, HeaderValue::from_static(
//             "Mozilla/5.0 (Windows NT 10.0; Win64; x64) \
//             AppleWebKit/537.36 (KHTML, like Gecko) \
//             Chrome/123.0.0.0 Safari/537.36"));
//     headers.insert(ACCEPT, HeaderValue::from_static("application/json"));
//     headers.insert(ACCEPT_LANGUAGE, HeaderValue::from_static("en-US,en;q=0.9"));
//     headers.insert(CONNECTION, HeaderValue::from_static("keep-alive"));
//
//     let response = client
//         .get(trending_url)
//         .headers(headers)
//         .send()
//         .await
//         .map_err(|_| Error::FailedToFetch)?
//         .json::<Value>()
//         .await
//         .map_err(|_| Error::FailedToExtractQuote)?;
//
//     let symbols = response["finance"]["result"][0]["quotes"]
//         .as_array()
//         .unwrap()
//         .iter()
//         .filter_map(|q| q["symbol"].as_str())
//         .collect::<Vec<&str>>();
//
//     let quotes = fetch_latest_quotes_parallel(&symbols[0..9].to_vec()).await?;
//
//     Ok(quotes)
// }
