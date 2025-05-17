use config::{Config, Environment};
use serde::Deserialize;
use std::sync::OnceLock;

#[derive(Deserialize, Clone)]
pub struct Settings {
    pub postgres_password: String,
    pub postgres_db: String,
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
