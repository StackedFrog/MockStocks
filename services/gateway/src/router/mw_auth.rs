<<<<<<< HEAD
use super::error::{Error, Result};
use axum::{extract::Request, middleware::Next, response::Response};
use hyper::HeaderMap;
use shared_utils::ctx::Ctx;

pub async fn mw_ctx_resolver(mut req: Request, next: Next) -> Result<Response> {
=======
use crate::config::Settings;

use super::error::{Error, Result};
use axum::{extract::Request, middleware::Next, response::Response};
use hyper::HeaderMap;
use jsonwebtoken::{Algorithm, DecodingKey, TokenData, Validation, decode};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
//
// #[derive(Serialize, Deserialize, Clone)]
// pub struct Claims {
//     pub sub: String,
//     jti: String,
//     pub exp: u64,
//     iat: u64,
// }

#[derive(Serialize, Deserialize, Clone)]
pub struct Claims {
    pub sub: Uuid, // subject
    jti: String,   // unique id
    pub exp: u64,  // expiration time
    pub role: UserType,
    iat: u64, // creation time
}
#[derive(Debug, Deserialize, Serialize, Clone, Copy)]
pub enum UserType {
    Admin,
    User,
}

pub async fn mw_ctx_resolver(mut req: Request, next: Next) -> Result<Response> {
    let ctx = ctx_resolver(req.headers()).await?;
    req.extensions_mut().insert(ctx);

    Ok(next.run(req).await)
}

pub async fn mw_ctx_resolver_admin(mut req: Request, next: Next) -> Result<Response> {
>>>>>>> c704c7d1cc7823f1ed585ee789582cb75412bf0f
    let ctx = ctx_resolver(req.headers()).await?;

    validdate_role(&ctx)?;

    req.extensions_mut().insert(ctx);

    Ok(next.run(req).await)
}

<<<<<<< HEAD
async fn ctx_resolver(header: &HeaderMap) -> Result<Ctx> {
    // let token = header.get("AUTHORIZATION").ok_or(Error::Variant1)?;

    let Some(auth_header) = header.get("AUTHORIZATION") else {
        return Err(Error::TokenMissing);
    };
=======
async fn ctx_resolver(header: &HeaderMap) -> Result<Claims> {
    let auth_header = header.get("AUTHORIZATION").ok_or(Error::TokenMissing)?;
>>>>>>> c704c7d1cc7823f1ed585ee789582cb75412bf0f

    let token = auth_header
        .to_str()
        .ok()
        .and_then(|s| s.strip_prefix("Bearer "))
        .ok_or(Error::BadTokenFormat)?;

    let token_data = validdate_token(token)?;

    let claims = token_data.claims;

    Ok(claims)
}

fn validdate_role(claims: &Claims) -> Result<()> {
    match claims.role {
        UserType::Admin => {}
        UserType::User => Err(Error::NotAuthorized)?,
    };
    Ok(())
}

fn validdate_token(token: &str) -> Result<TokenData<Claims>> {
    let secret = &Settings::get().token_secret;
    decode::<Claims>(
        token,
        &DecodingKey::from_secret(secret.as_ref()),
        &Validation::new(Algorithm::HS256),
    )
    .map_err(|_| Error::FailedToValidateToken)
}
