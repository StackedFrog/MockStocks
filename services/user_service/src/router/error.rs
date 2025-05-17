use crate::model;
use axum::{http::StatusCode, response::IntoResponse};
use tracing::info;
pub type Result<T> = core::result::Result<T, Error>;

#[derive(Debug, Clone)]
pub enum Error {
    Model(model::Error),
    InsufficientStockQuantity,
    InsufficientBalance,
    FailedToFetchStock,
    FailedToParseLatestQuote,
    FailedToParsePrice,
    NotAuthorized,
}

impl From<model::Error> for Error {
    fn from(val: model::Error) -> Self {
        Error::Model(val)
    }
}

impl IntoResponse for Error {
    fn into_response(self) -> axum::response::Response {
        let err = match &self {
            Error::Model(error) => format!("Error: {:?}", error),
            error => format!("Error: {:?}", error),
        };

        info!(err);

        let code = match self {
            Error::NotAuthorized => StatusCode::FORBIDDEN,
            _ => StatusCode::INTERNAL_SERVER_ERROR,
        };

        code.into_response()
    }
}
