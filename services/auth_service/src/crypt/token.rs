use jsonwebtoken::{
    Algorithm, DecodingKey, EncodingKey, Header, TokenData, Validation, decode, encode,
    get_current_timestamp,
};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::{config::Settings, model::users_model::UserType};

use super::{Error, Result};

// methods for token
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Claims {
    pub sub: Uuid, // subject
    jti: String,   // unique id
    pub exp: u64,  // expiration time
    pub role: UserType,
    iat: u64, // creation time
}

impl Claims {
    pub fn new(id: Uuid, role: UserType, exp: u64) -> Self {
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

pub fn validate_signature_refresh(token: &str) -> Result<TokenData<Claims>> {
    let settings = Settings::get();
    let secret = &settings.token_refresh_secret;
    decode::<Claims>(
        token,
        &DecodingKey::from_secret(secret.as_ref()),
        &Validation::new(Algorithm::HS256),
    )
    .map_err(|_e| Error::FailedToValidateToken) // lambda, returns claims or error
    // if cannot decode, throw error (fail to validate, mapped into error types)
}

pub fn create_token(claims: &Claims, secret: String) -> Result<String> {
    encode(
        &Header::default(),
        claims,
        &EncodingKey::from_secret(secret.as_ref()),
    )
    .map_err(|_| Error::FailedToCreateToken)
}
