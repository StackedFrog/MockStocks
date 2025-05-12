mod error;
pub mod proxy_utils;
use reqwest::{Client, redirect::Policy};

pub use self::error::{Error, Result};

#[derive(Clone, Debug)]
pub struct AppState {
    pub http_client: Client,
}

impl AppState {
    pub fn new() -> AppState {
        let client = Client::builder().redirect(Policy::none()).build().unwrap();
        AppState {
            http_client: client,
        }
    }
}
