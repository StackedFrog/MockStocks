use redis::aio::MultiplexedConnection;
mod error;
pub use self::error::{Error, Result};
pub mod redis_csrf;
pub mod redis_token;
use crate::{config::Settings, oAuth::OauthManager};

#[derive(Clone, Debug)]
pub struct ModelManager {
    pub client: MultiplexedConnection,
    pub oauth_manager: OauthManager,
}

impl ModelManager {
    pub async fn new() -> Self {
        let redis_pwd = Settings::get().redis_password.clone();
        let client = redis::Client::open(format!("redis://:{}@redis:6379", redis_pwd)).unwrap();
        let con = client.get_multiplexed_tokio_connection().await.unwrap();

        let oauth_manager = OauthManager::new();

        Self {
            client: con,
            oauth_manager,
        }
    }
}
