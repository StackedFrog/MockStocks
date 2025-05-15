use super::{Error, Result};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use telemetry::tracing_propegation::inject_tracing_context;
use tracing::info;

#[derive(Deserialize, Clone)]
pub struct LatestQuote {
    pub symbol: String,
    pub date: String,
    pub close: f64,
    pub open: f64,
    pub high: f64,
    pub low: f64,
    pub volume: u64,
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
