pub mod db_setup;
use sqlx::{Postgres, postgres::PgPoolOptions};
pub type Pool = sqlx::Pool<Postgres>;

#[derive(Clone, Debug)]
pub struct ModelManager {
    pub pool: Pool,
}

impl ModelManager {
    pub async fn new() -> Self {
        let pool = PgPoolOptions::new()
            .max_connections(5)
            .connect("postgres://postgres:password@localhost:5432/dev_db")
            .await
            .expect("Connection pool could not be created");
        Self { pool }
    }
}
