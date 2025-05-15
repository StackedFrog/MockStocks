pub mod error;
pub mod stocks_service;
use std::sync::Arc;

use yahoo_finance_api::YahooConnector;

pub use self::error::{Error, Result};

#[derive(Clone)]
pub struct ClientManager {
    pub client: Arc<YahooConnector>,
}

impl ClientManager {
    pub fn new() -> Self {
        let provider = Arc::new(YahooConnector::new().unwrap());
        Self { client: provider }
    }
}
