use crate::{
    crypt::token::{Claims, create_token},
    model::{ModelManager, redis_token},
};

use super::Result;

pub struct RefreshToken {
    pub token: String,
    pub claims: Claims,
}
pub struct AccessToken {
    pub token: String,
}

impl AccessToken {
    pub fn new(id: String) -> Result<Self> {
        let experation_time = 500;
        let claims = Claims::new(id, experation_time);
        let token = create_token(&claims)?;

        Ok(Self { token })
    }
}

impl RefreshToken {
    pub fn new(id: String) -> Result<Self> {
        let experation_time = 500;
        let claims = Claims::new(id, experation_time);
        let token = create_token(&claims)?;

        Ok(Self { token, claims })
    }

    pub async fn store_token(self: &Self, mm: ModelManager) -> Result<()> {
        redis_token::save_refresh_token(&self.claims, &self.token, mm.client).await?;
        Ok(())
    }
}
