pub mod redis_token;
mod error;
use redis::{aio::MultiplexedConnection};

pub use self::error::{Error, Result};



#[derive(Clone)]
pub struct ModelManager{
    pub client : MultiplexedConnection
}

impl ModelManager{
    pub async fn new() -> Self{
        let client= redis::Client::open("redis://redis:6379").unwrap();
        let con = client.get_multiplexed_tokio_connection().await.unwrap();
        Self{client: con}
    }

}
