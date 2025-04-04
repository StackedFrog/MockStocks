use yahoo_finance_api::YahooConnector;
use std::time::{Duration, UNIX_EPOCH};
use time::{OffsetDateTime, format_description::well_known::Iso8601};
use serde::Serialize;

#[derive(Serialize)]
pub struct StockResponse {
    pub symbol: String,
    pub date: String,
    pub close_price: f64,
}

pub async fn fetch_stock_price(symbol: &str) -> Result<StockResponse, String> {
    let provider = YahooConnector::new().map_err(|err| format!("Error creating connector: {:?}", err))?;

    let response = provider
        .get_latest_quotes(symbol, "1d")
        .await
        .map_err(|err| format!("Error fetching stock data: {:?}", err))?;

    let quote = response
        .last_quote()
        .map_err(|err| format!("Error extracting quote: {:?}", err))?;

    let time: OffsetDateTime = OffsetDateTime::from(UNIX_EPOCH + Duration::from_secs(quote.timestamp));

    let formatted_date = time.date().format(&Iso8601::DEFAULT)
        .map_err(|err| format!("Error formatting date: {:?}", err))?;

    Ok(StockResponse {
        symbol: symbol.to_string(),
        date: formatted_date,
        close_price: quote.close,
    })
}
