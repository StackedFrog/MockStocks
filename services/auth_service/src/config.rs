use config::{Config, Environment};
use serde::Deserialize;
use std::{collections::HashMap, sync::OnceLock};

#[derive(Deserialize)]
pub struct Settings {
    pub redis_password: String,
    pub cargo_pkg_name: String,
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
