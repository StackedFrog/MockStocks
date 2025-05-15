use uuid::Uuid;

use crate::{
    config::Settings,
    crypt::token::{Claims, create_token},
    model::{ModelManager, redis_token, users_model::UserType},
};

use super::Result;

pub struct RefreshToken {
    pub token: String,
    pub claims: Claims,
}
pub struct AccessToken {
    pub token: String,
}

pub struct DashToken {
    pub token: String,
}

impl AccessToken {
    pub fn new(id: Uuid, role: UserType) -> Result<Self> {
        let settings = Settings::get();
        let experation_time = settings.token_access_exp;
        let secret = settings.token_access_secret.clone();
        let claims = Claims::new(id, role, experation_time);

        let token = create_token(&claims, secret)?;

        Ok(Self { token })
    }
}

impl RefreshToken {
    pub fn new(id: Uuid, role: UserType) -> Result<Self> {
        let settings = Settings::get();
        let experation_time = settings.token_refresh_exp;
        let secret = settings.token_refresh_secret.clone();
        let claims = Claims::new(id, role, experation_time);
        let token = create_token(&claims, secret)?;

        Ok(Self { token, claims })
    }

    pub async fn store_token(self: &Self, mm: ModelManager) -> Result<()> {
        redis_token::save_refresh_token(&self.claims, &self.token, mm.client).await?;
        Ok(())
    }
}

impl DashToken {
    pub fn new(id: Uuid, role: UserType) -> Result<Self> {
        let settings = Settings::get();
        let experation_time = settings.token_access_exp;
        let secret = settings.token_dash_secret.clone();
        let claims = Claims::new(id, role, experation_time);
        let token = create_token(&claims, secret)?;
        Ok(Self { token })
    }
}

pub trait TokenData {
    fn to_token_data(&self) -> (Uuid, UserType);
}
