use crate::stocks_service::{Error, Result};
use serde_json::Value;

pub struct YahooService;

impl YahooService {
    pub fn new() -> Self {
        YahooService
    }

    pub async fn get_trending_symbols(&self) -> Result<Vec<String>> {
        let trending_url = "https://query1.finance.yahoo.com/v1/finance/trending/US";

        let req = surf::get(trending_url)
            .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
            .header("Accept", "application/json")
            .header("Accept-Language", "en-US,en;q=0.9")
            .header("Accept-Encoding", "gzip, deflate, br");

        let mut res = req.await.map_err(|_| Error::FailedToFetch)?;
        println!("{:?}", res);
        let response: Value = res.body_json().await.map_err(|_| Error::FailedToParse)?;

        let symbols = response["finance"]["result"][0]["quotes"]
            .as_array()
            .ok_or(Error::FailedToExtractQuote)?
            .iter()
            .filter_map(|q| q["symbol"].as_str())
            .map(|s| s.to_string())
            .collect::<Vec<String>>();

        Ok(symbols)
    }
}
