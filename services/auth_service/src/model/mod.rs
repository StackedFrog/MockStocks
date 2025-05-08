use redis::aio::MultiplexedConnection;
mod error;
pub mod redis_token;
pub use self::error::{Error, Result};
use sqlx::{Postgres, postgres::PgPoolOptions};
pub type Pool = sqlx::Pool<Postgres>;
pub mod users_model;

#[derive(Clone, Debug)]
pub struct ModelManager {
    pub client: MultiplexedConnection,
    pub pool: Pool,
}

impl ModelManager {
    pub async fn new() -> Self {
        let client = redis::Client::open("redis://redis:6379").unwrap();
        let con = client.get_multiplexed_tokio_connection().await.unwrap();
        let pool = PgPoolOptions::new()
            .max_connections(5)
            .connect("postgres://postgres:password@db/dev_db")
            .await
            .expect("Connection pool could not be created");
        Self { client: con, pool }
    }
}
