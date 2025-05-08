pub mod holdings;
pub mod transactions;
pub mod user;
mod error;
pub use self::error::{Error, Result};
use sqlx::{postgres::PgPoolOptions, Postgres};
pub type Pool = sqlx::Pool<Postgres>;


#[derive(Clone, Debug)]
pub struct ModelManager{
    pub pool: Pool
}

impl ModelManager{
    pub async fn new() -> Self {
        let pool= PgPoolOptions::new()
        .max_connections(5)
        .connect("postgres://postgres:password@db/dev_db")
        .await.expect("Connection pool could not be created");
        Self {pool}
    }
}