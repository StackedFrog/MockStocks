use redis::aio::MultiplexedConnection;
mod error;
pub mod redis_token;
pub use self::error::{Error, Result};
use crate::config::Settings;

#[derive(Clone, Debug)]
pub struct ModelManager {
    pub client: MultiplexedConnection,
}

impl ModelManager {
    pub async fn new() -> Self {
        let redis_pwd = Settings::get().redis_password.clone();
        let client = redis::Client::open(format!("redis://:{}@redis:6379", redis_pwd)).unwrap();
        let con = client.get_multiplexed_tokio_connection().await.unwrap();
        Self { client: con }
    }
}
