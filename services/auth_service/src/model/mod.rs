use redis::aio::MultiplexedConnection;
pub mod redis_token;
mod error;
use crate::config::Settings;
pub use self::error::{Error, Result};

#[derive(Clone, Debug)]
pub struct ModelManager{
    pub client : MultiplexedConnection
}

impl ModelManager{
    pub async fn new() -> Self{
        let redis_pwd = Settings::get().redis_password.clone();
        let client= redis::Client::open(format!("redis://:{}@redis:6379", redis_pwd)).unwrap();
        let con = client.get_multiplexed_tokio_connection().await.unwrap();
        Self{client: con}
    }
}
