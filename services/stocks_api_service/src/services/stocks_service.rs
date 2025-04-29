use yahoo_finance_api::{Quote, YahooConnector};
use reqwest::header::{HeaderMap, HeaderValue, USER_AGENT, ACCEPT, ACCEPT_LANGUAGE, CONNECTION};
use chrono::{DateTime, Local};
use serde::Serialize;
use serde_json::Value;
use time::{OffsetDateTime, format_description::well_known::Rfc3339};
use futures::future::{join_all, try_join_all};
use reqwest;
use moka::sync::Cache;
use once_cell::sync::Lazy;
use std::time::Duration;

//TODO: Clean up code, add comments, move errs

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

pub async fn fetch_latest_quote(symbol: &str) -> Result<LatestQuote, String> {
    let provider = YahooConnector::new().map_err(|err| format!("Error creating connector: {:?}", err))?;

    let response = provider
        .get_latest_quotes(symbol, "1d")
        .await
        .map_err(|err| format!("Error fetching stock data: {:?}", err))?;

    let quote = response
        .last_quote()
        .map_err(|err| format!("Error extracting quote: {:?}", err))?;

    let local_date: DateTime<Local> = DateTime::from(DateTime::from_timestamp(quote.timestamp as i64, 0).unwrap()); 

    Ok(LatestQuote {
        symbol: symbol.to_string(),
        date: local_date.to_string(),
        close_price: quote.close,
    })
}

pub async fn fetch_quote_from_timerange(symbol: &str, range: &str) -> Result<QuoteFromRange, String> {
    let provider = YahooConnector::new().map_err(|err| format!("Error creating connector: {:?}", err))?;

    let response = provider
        .get_quote_range(symbol, "1d", range)
        .await
        .map_err(|err| format!("Error fetching stock data: {:?}", err))?;

    let fetched_quotes = response.quotes().unwrap();

    Ok(QuoteFromRange {
        symbol: symbol.to_string(),
        range: range.to_string(),
        quotes: fetched_quotes,
    })
}

pub async fn fetch_latest_quotes_parallel(symbols: &[&str]) -> Result<Vec<LatestQuote>, String> {
    if symbols.len() > 10 {
        return Err("Too many symbols provided. Maximum allowed is 10.".to_string());
    }

    let fetches = symbols.iter().map(|&symbol| fetch_latest_quote(symbol));
    let results = join_all(fetches).await;

    let mut quotes = Vec::new();
    for result in results {
        match result {
            Ok(quote) => quotes.push(quote),
            Err(e) => return Err(format!("Failed to fetch one or more quotes: {}", e)),
        }
    }

    Ok(quotes)
}

pub async fn fetch_historic_quotes(symbol: &str, start: &str, end: &str) -> Result<HistoricQuotes, String> {
    let provider = YahooConnector::new().map_err(|err| format!("Error creating connector: {:?}", err))?;

    let start_offset = OffsetDateTime::parse(start, &Rfc3339)
        .map_err(|e| format!("Failed to parse start datetime: {}", e))?;
    let end_offset = OffsetDateTime::parse(end, &Rfc3339)
        .map_err(|e| format!("Failed to parse start datetime: {}", e))?;
    let response = provider
        .get_quote_history(symbol, start_offset, end_offset)
        .await
        .map_err(|err| format!("Error fetching stock data: {:?}", err))?;

    let fetched_quotes = response
        .quotes()
        .map_err(|err| format!("Error extracting quotes: {:?}", err))?;

    Ok(HistoricQuotes{
        symbol: symbol.to_string(),
        start: start.to_string(),
        end: end.to_string(),
        quotes: fetched_quotes,
    })
}

pub async fn fetch_ticker(search_term: &str) -> Result<Vec<TickerSearchResult>, String> {
    let provider = YahooConnector::new().map_err(|err| format!("Error creating connector: {:?}", err))?;

    let response = provider
        .search_ticker(search_term)
        .await
        .map_err(|err| format!("Error searching ticker: {:?}", err))?;

    let results = response.quotes
        .into_iter()
        .map(|quote| TickerSearchResult {
            symbol: quote.symbol,
            name: quote.long_name,
            exchange: quote.exchange,
        })
    .collect();

    Ok(results)
}

static TRENDING_CACHE: Lazy<Cache<(), Vec<LatestQuote>>> = Lazy::new(|| {
    Cache::builder()
        .time_to_live(Duration::from_secs(300))
        .max_capacity(1)
        .build()
});

pub async fn fetch_trending_quotes() -> Result<Vec<LatestQuote>, String> {
    if let Some(cached) = TRENDING_CACHE.get(&()) {
        return Ok(cached);
    }

    let client = reqwest::Client::new();
    let trending_url = "https://query1.finance.yahoo.com/v1/finance/trending/US";

    let mut headers = HeaderMap::new();
    headers.insert(USER_AGENT, HeaderValue::from_static(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) \
         AppleWebKit/537.36 (KHTML, like Gecko) \
         Chrome/123.0.0.0 Safari/537.36"));
    headers.insert(ACCEPT, HeaderValue::from_static("application/json"));
    headers.insert(ACCEPT_LANGUAGE, HeaderValue::from_static("en-US,en;q=0.9"));
    headers.insert(CONNECTION, HeaderValue::from_static("keep-alive"));

    let response = client
        .get(trending_url)
        .headers(headers)
        .send()
        .await
        .map_err(|e| format!("Failed to fetch trending stocks: {}", e))?
        .json::<Value>()
        .await
        .map_err(|e| format!("Failed to parse trending stocks: {}", e))?;

    let symbols = response["finance"]["result"][0]["quotes"]
        .as_array()
        .unwrap()
        .iter()
        .filter_map(|q| q["symbol"].as_str())
        .collect::<Vec<&str>>();

    let quote_futures = symbols.into_iter().map(|symbol| fetch_latest_quote(symbol));
    let quotes = try_join_all(quote_futures).await?;

    TRENDING_CACHE.insert((), quotes.clone());

    Ok(quotes)
}
