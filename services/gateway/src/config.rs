use config::{Config, Environment};
use serde::Deserialize;
use std::sync::OnceLock;

#[derive(Deserialize, Clone)]
pub struct Settings {
    pub token_refresh_secret: String,
    pub token_access_secret: String,
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
