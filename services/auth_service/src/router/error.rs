use crate::{crypt, model};
use axum::{http::StatusCode, response::IntoResponse};
use std::fmt::Debug;
use tracing::error;
pub type Result<T> = core::result::Result<T, Error>;

#[derive(Debug, Clone)]
pub enum Error {
    MissingRefreshToken,
    Model(model::Error),
    Crypt(crypt::Error),
}

impl From<model::Error> for Error {
    fn from(val: model::Error) -> Self {
        Error::Model(val)
    }
}

impl From<crypt::Error> for Error {
    fn from(val: crypt::Error) -> Self {
        Error::Crypt(val)
    }
}

impl IntoResponse for Error {
    fn into_response(self) -> axum::response::Response {
        let err = match &self {
            Error::Model(error) => format!("Error: {:?}", error),
            Error::Crypt(error) => format!("Error: {:?}", error),
            error => format!("Error: {:?}", error),
        };

        error!(err);

        (StatusCode::INTERNAL_SERVER_ERROR, err).into_response()
    }
}
