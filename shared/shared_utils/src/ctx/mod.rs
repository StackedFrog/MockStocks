use std::str::FromStr;

use axum::{extract::FromRequestParts, http::request::Parts};
use uuid::Uuid;

mod error;

use self::error::{Error, Result};

#[derive(Debug, Clone)]
pub struct Ctx {
    user_id: Uuid,
}

impl Ctx {
    pub fn new(id: Uuid) -> Self {
        Ctx { user_id: id }
    }
}

impl Ctx {
    pub fn user_id(&self) -> &Uuid {
        &self.user_id
    }
}

impl<S: Send + Sync> FromRequestParts<S> for Ctx {
    type Rejection = Error;
    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self> {
        if let Some(user_id) = parts.headers.get("x-user-id") {
            if let Ok(id) = user_id.to_str() {
                if let Ok(uuid) = Uuid::from_str(id) {
                    return Ok(Ctx::new(uuid));
                }
            }
        }
        Err(Error::HeaderMissing)
    }
}
