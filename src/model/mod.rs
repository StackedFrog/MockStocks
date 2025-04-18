use sqlx::{postgres::PgPoolOptions, Postgres};
pub type Pool = sqlx::Pool<Postgres>;
pub mod users_model;
pub mod error;
pub struct Db {
    pub pool: Pool
}

impl Db {
    pub async fn new() -> Db {
        Db {
            pool: PgPoolOptions::new()
            .max_connections(5)
            .connect("postgres://postgres:password@localhost/dev_db")
            .await.expect("Connection pool could not be created")
        }
    }
}