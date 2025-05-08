use super::error::{Error, Result};
use axum::{extract::Request, middleware::Next, response::Response};
use hyper::HeaderMap;
use jsonwebtoken::{Algorithm, DecodingKey, TokenData, Validation, decode};
use serde::{Deserialize, Serialize};
use shared_utils::ctx::Ctx;

#[derive(Serialize, Deserialize, Clone)]
pub struct Claims {
    pub sub: String,
    jti: String,
    pub exp: u64,
    iat: u64,
}

pub async fn mw_ctx_resolver(mut req: Request, next: Next) -> Result<Response> {
    let ctx = ctx_resolver(req.headers()).await?;

    req.extensions_mut().insert(ctx);

    Ok(next.run(req).await)
}

async fn ctx_resolver(header: &HeaderMap) -> Result<Ctx> {
    let auth_header = header.get("AUTHORIZATION").ok_or(Error::TokenMissing)?;

    let token = auth_header
        .to_str()
        .ok()
        .and_then(|s| s.strip_prefix("Bearer "))
        .ok_or(Error::BadTokenFormat)?;

    let token_data = validdate_token(token)?;

    let id = token_data.claims.sub;

    Ok(Ctx::new(id))
}

fn validdate_token(token: &str) -> Result<TokenData<Claims>> {
    let secret = "secret";
    decode::<Claims>(
        token,
        &DecodingKey::from_secret(secret.as_ref()),
        &Validation::new(Algorithm::HS256),
    )
    .map_err(|_| Error::FailedToValidateToken)
}
