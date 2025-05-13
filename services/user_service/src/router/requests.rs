use super::{Error, Result};
use reqwest::Client;
use serde::{Deserialize, Serialize};
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
    let result = client
        .get("http://stocks_api_service:4003/stock")
        .query(&[("symbol", symbol)])
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
