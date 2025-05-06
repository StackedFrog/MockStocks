use jsonwebtoken::{decode, encode, Algorithm, DecodingKey, EncodingKey, Header, TokenData, Validation};
use serde::{Deserialize, Serialize};
use chrono::Utc;
use uuid::Uuid;

use super::{Error, Result};

// methods for token 
#[derive(Serialize, Deserialize)]
pub struct Claims {
    sub: String,  // subject
    jti: String, // unique id
    exp: u64, // expiration time
    iat:  u64 // creation time 
}

impl Claims {
    pub fn new(id: String) -> Self{
        Claims {
            sub: id,
            jti: Uuid::new_v4().to_string(),
            exp: 0, // from config later
            iat: Utc::now()
        }
    }
}

pub fn validate_signature(token: String) -> Result<TokenData<Claims>>{
    let secret = "secret";
    decode::<Claims>(&token, &DecodingKey::from_secret(secret.as_ref()), &Validation::new(Algorithm::HS256))
    .map_err(|_| Error::FailedToValidateToken) // lambda, returns claims or error
    // if cannot decode, throw error (fail to validate, mapped into error types)
}

pub fn create_token(claims: Claims) -> Result<String>{
    let secret = "secret";
    encode(&Header::default(), &claims, &EncodingKey::from_secret(secret.as_ref()))
    .map_err(|_| Error::FailedToCreateToken)
}

