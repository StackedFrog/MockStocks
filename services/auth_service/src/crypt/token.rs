use jsonwebtoken::{
    Algorithm, DecodingKey, EncodingKey, Header, TokenData, Validation, decode, encode,
    get_current_timestamp,
};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::config::Settings;

use super::{Error, Result};

// methods for token
#[derive(Serialize, Deserialize, Clone)]
pub struct Claims {
    pub sub: String, // subject
    jti: String,     // unique id
    pub exp: u64,    // expiration time
    pub role: String,
    iat: u64, // creation time
}

impl Claims {
    pub fn new(id: String, role: String, exp: u64) -> Self {
        Claims {
            sub: id,
            jti: Uuid::new_v4().to_string(),
            role: role,
            exp: get_current_timestamp() + exp, // from config later
            iat: get_current_timestamp(),
        }
    }

    pub fn to_redis_key(&self) -> String {
        format!("refresh_token:{}:{}", self.sub, self.jti)
    }
}

pub fn validate_signature(token: &str) -> Result<TokenData<Claims>> {
    let settings = Settings::get();
    let secret = &settings.token_secret;
    decode::<Claims>(
        token,
        &DecodingKey::from_secret(secret.as_ref()),
        &Validation::new(Algorithm::HS256),
    )
    .map_err(|_| Error::FailedToValidateToken) // lambda, returns claims or error
    // if cannot decode, throw error (fail to validate, mapped into error types)
}

pub fn create_token(claims: &Claims) -> Result<String> {
    let settings = Settings::get();
    let secret = &settings.token_secret;
    encode(
        &Header::default(),
        claims,
        &EncodingKey::from_secret(secret.as_ref()),
    )
    .map_err(|_| Error::FailedToCreateToken)
}
