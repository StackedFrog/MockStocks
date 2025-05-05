mod error;
pub mod proxy_utils;
use reqwest::Client;

pub use self::error::{Error, Result};

#[derive(Clone, Debug)]
pub struct AppState {
    pub http_client: Client,
}

impl AppState {
    pub fn new() -> AppState {
        AppState {
            http_client: Client::new(),
        }
    }
}
