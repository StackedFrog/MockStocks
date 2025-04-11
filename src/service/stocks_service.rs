use yahoo_finance_api::{Quote, YahooConnector};
use chrono::{DateTime, Local};
use serde::Serialize;
use time::{OffsetDateTime, format_description::well_known::Rfc3339};
use futures::future::join_all;
//TODO: Clean up code, add comments, move errs

#[derive(Serialize)]
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
