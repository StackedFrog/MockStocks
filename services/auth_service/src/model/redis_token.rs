use redis::{aio::MultiplexedConnection, AsyncCommands};
use crate::router::routes_login::TokenClaims;
use super::{Error, Result};

pub async fn save_refresh_token(
    token_claims: TokenClaims,
    token: &String,
    mut con: MultiplexedConnection
) -> Result<()>{
    let redis_key = token_claims.to_redis_key();
    let _: String = con.set_ex(redis_key, token, token_claims.exp).await.map_err(|_| Error::FailedToSaveToken)?;
    Ok(())
}

pub async fn remove_refresh_token(
    token_claims: TokenClaims,
    mut con: MultiplexedConnection
)-> Result<()>{
    let _: () = con.del(token_claims.to_redis_key()).await.map_err(|_| Error::FailedToDeleteToken)?;
    Ok(())
}

pub async fn get_refresh_token(
    token_claims: TokenClaims,
    mut con: MultiplexedConnection
) -> Result<String>{
    let token : String = con.get(token_claims.to_redis_key()).await.map_err(|_| Error::TokenNotFound)?;
    Ok(token)
}

pub async fn rotate_token(
    old_refresh_claims: TokenClaims,
    new_refresh_claims: TokenClaims,
    new_refresh: String,
    mut con: MultiplexedConnection
) -> Result<()>{
    let (_, _): (String, String) = redis::pipe().atomic()
        .get_del(old_refresh_claims.to_redis_key())
        .set_ex(new_refresh_claims.to_redis_key(), new_refresh, new_refresh_claims.exp)
        .query_async(&mut con)
        .await.map_err(|_|Error::TokenRotationFailed)?;
    Ok(())
}
