use super::{Error, Result};
use crate::{config::Settings, crypt::token::Claims};
use redis::{AsyncCommands, aio::MultiplexedConnection};
use tracing::info;
use uuid::Uuid;

pub async fn save_refresh_token(
    token_claims: &Claims,
    token: &String,
    mut con: MultiplexedConnection,
) -> Result<()> {
    let exp = Settings::get().token_refresh_exp;
    let redis_key = token_claims.to_redis_key();
    let _: String = con
        .set_ex(redis_key, token, exp)
        .await
        .map_err(|_| Error::FailedToSaveToken)?;
    Ok(())
}

pub async fn remove_all_refresh_tokens(
    user_id: Uuid,
    mut con: MultiplexedConnection,
) -> Result<()> {
    let pattern = format!("refresh_token:{}:*", user_id);
    let mut cursor: u64 = 0;

    loop {
        let (next_cursor, keys): (u64, Vec<String>) = redis::cmd("SCAN")
            .arg(cursor)
            .arg("MATCH")
            .arg(&pattern)
            .arg("COUNT")
            .arg(100)
            .query_async(&mut con)
            .await
            .map_err(|_e| {
                info!("{}", _e);
                Error::FailedTokenScan
            })?;

        if !keys.is_empty() {
            con.del(keys)
                .await
                .map_err(|_| Error::FailedToDeleteToken)?
        }
        if next_cursor == 0 {
            break;
        }
        cursor = next_cursor;
    }

    Ok(())
}

pub async fn remove_refresh_token(
    token_claims: &Claims,
    mut con: MultiplexedConnection,
) -> Result<()> {
    let _: () = con
        .del(token_claims.to_redis_key())
        .await
        .map_err(|_| Error::FailedToDeleteToken)?;
    Ok(())
}

pub async fn rotate_token(
    old_refresh_claims: &Claims,
    new_refresh_claims: &Claims,
    new_refresh: &String,
    mut con: MultiplexedConnection,
) -> Result<()> {
    let exp = Settings::get().token_refresh_exp;
    let (_, _): (String, String) = redis::pipe()
        .atomic()
        .get_del(old_refresh_claims.to_redis_key())
        .set_ex(new_refresh_claims.to_redis_key(), new_refresh, exp)
        .query_async(&mut con)
        .await
        .map_err(|_| Error::TokenRotationFailed)?;
    Ok(())
}
