use crate::{
    config::Settings,
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
    pub fn new(id: String, role: String) -> Result<Self> {
        let experation_time = Settings::get().token_access_exp;
        let claims = Claims::new(id, role, experation_time);
        let token = create_token(&claims)?;

        Ok(Self { token })
    }
}

impl RefreshToken {
    pub fn new(id: String, role: String) -> Result<Self> {
        let experation_time = Settings::get().token_refresh_exp;
        let claims = Claims::new(id, role, experation_time);
        let token = create_token(&claims)?;

        Ok(Self { token, claims })
    }

    pub async fn store_token(self: &Self, mm: ModelManager) -> Result<()> {
        redis_token::save_refresh_token(&self.claims, &self.token, mm.client).await?;
        Ok(())
    }
}

pub trait TokenData {
    fn to_token_data(&self) -> (String, String);
}
