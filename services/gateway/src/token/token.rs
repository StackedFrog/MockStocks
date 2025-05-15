use super::error::{Error, Result};
use crate::config::Settings;
use jsonwebtoken::{Algorithm, DecodingKey, TokenData, Validation, decode};
use serde::{Deserialize, Serialize};
use tracing::info;
use uuid::Uuid;

#[derive(Serialize, Deserialize, Clone, Debug)]
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

pub fn validate_dash_token(token: &str) -> Result<()> {
    let secret = &Settings::get().token_dash_secret;
    decode::<Claims>(
        token,
        &DecodingKey::from_secret(secret.as_ref()),
        &Validation::new(Algorithm::HS256),
    )
    .map_err(|_e| {
        info!("{}", _e);
        Error::FailedToValidateToken
    })?;
    Ok(())
}

pub fn validate_admin_token(token: &str) -> Result<TokenData<Claims>> {
    let token_data = validdate_token(token)?;
    validdate_role(&token_data.claims)?;
    Ok(token_data)
}

fn validdate_role(claims: &Claims) -> Result<()> {
    match claims.role {
        UserType::Admin => {}
        UserType::User => Err(Error::NotAuthorized)?,
    };
    Ok(())
}

pub fn validdate_token(token: &str) -> Result<TokenData<Claims>> {
    let secret = &Settings::get().token_access_secret;
    decode::<Claims>(
        token,
        &DecodingKey::from_secret(secret.as_ref()),
        &Validation::new(Algorithm::HS256),
    )
    .map_err(|_e| {
        info!("{}", _e);
        Error::FailedToValidateToken
    })
}
