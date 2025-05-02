use crate::model::Pool;
use uuid::Uuid;
use crate::model::error::{Error, Result};

#[derive(sqlx::FromRow, Debug)]
pub struct Holding {
    user_id: Uuid,
    symbol: String,
    quantity:  Number,
    last_updated: Date
}