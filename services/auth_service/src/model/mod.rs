use redis::aio::MultiplexedConnection;
mod error;
pub use self::error::{Error, Result};
pub mod redis_csrf;
pub mod redis_token;
use crate::{config::Settings, oauth::OauthManager};
use sqlx::{Postgres, postgres::PgPoolOptions};
pub type Pool = sqlx::Pool<Postgres>;
pub mod users_model;

#[derive(Clone, Debug)]
pub struct ModelManager {
    pub client: MultiplexedConnection,
    pub oauth_manager: OauthManager,
    pub pool: Pool,
}

impl ModelManager {
    pub async fn new() -> Self {
        let settings = Settings::get();
        let redis_pwd = settings.redis_password.clone();
        let client = redis::Client::open(format!("redis://:{}@redis:6379", redis_pwd)).unwrap();

        let con = client.get_multiplexed_tokio_connection().await.unwrap();

        let pool = PgPoolOptions::new()
            .max_connections(5)
            .connect(&format!(
                "postgres://postgres:{}@db/{}",
                settings.postgres_password, settings.postgres_db
            ))
            .await
            .expect("Connection pool could not be created");

        let oauth_manager = OauthManager::new();

        Self {
            client: con,
            oauth_manager,
            pool,
        }
    }
}
