use config::{Config, Environment};
use serde::Deserialize;
use std::sync::OnceLock;

#[derive(Deserialize, Clone)]
pub struct Settings {
    pub redis_password: String,
    pub cargo_pkg_name: String,
    pub client_id: String,
    pub client_secret: String,
    pub redirect_url: String,
    pub auth_url: String,
    pub token_url: String,
    pub postgres_password: String,
    pub postgres_db: String,
    pub token_refresh_secret: String,
    pub token_refresh_exp: u64,
    pub token_access_secret: String,
    pub token_access_exp: u64,
    pub token_dash_secret: String,
}

impl Settings {
    fn load() -> Self {
        Config::builder()
            .add_source(Environment::default())
            .build()
            .unwrap()
            .try_deserialize()
            .unwrap()
    }

    pub fn get() -> &'static Self {
        static INSTANCE: OnceLock<Settings> = OnceLock::new();
        INSTANCE.get_or_init(|| Self::load())
    }
}
