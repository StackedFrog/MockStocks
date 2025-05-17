use super::{Error, Result};
use reqwest::Client;
use serde::Deserialize;
use telemetry::tracing_propegation::inject_tracing_context;
use tracing::info;

#[derive(Deserialize, Clone)]
pub struct LatestQuote {
    symbol: String,
    date: String,
    pub close: f64,
    open: f64,
    high: f64,
    low: f64,
    volume: u64,
}

pub async fn get_stock(client: Client, symbol: &String) -> Result<LatestQuote> {
    let headers = inject_tracing_context();

    let result = client
        .get("http://stocks_api_service:4003/stock")
        .query(&[("symbol", symbol)])
        .headers(headers)
        .send()
        .await
        .map_err(|_e| {
            info!("{}", _e);
            Error::FailedToFetchStock
        })?
        .json::<LatestQuote>()
        .await
        .map_err(|_| Error::FailedToParseLatestQuote)?;

    Ok(result)
}
