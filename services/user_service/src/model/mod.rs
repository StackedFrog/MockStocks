mod error;
pub mod holdings;
pub mod transactions;
pub mod user;
use crate::config::Settings;

pub use self::error::Error;
use reqwest::Client;
use sqlx::{Postgres, postgres::PgPoolOptions};
pub type Pool = sqlx::Pool<Postgres>;

#[derive(Clone, Debug)]
pub struct ModelManager {
    pub pool: Pool,
    pub client: Client,
}

impl ModelManager {
    pub async fn new() -> Self {
        let settings = Settings::get();
        let pool = PgPoolOptions::new()
            .max_connections(5)
            .connect(&format!(
                "postgres://postgres:{}@db/{}",
                settings.postgres_password, settings.postgres_db
            ))
            .await
            .expect("Connection pool could not be created");
        let client = Client::new();

        Self { pool, client }
    }
}
