use crate::model;
use axum::{http::StatusCode, response::IntoResponse};
use tracing::error;
pub type Result<T> = core::result::Result<T, Error>;

#[derive(Debug, Clone)]
pub enum Error {
    MissingRefreshToken,
    Model(model::Error),
    UuidNotParsed,
    InsufficientStockQuantity,
    InsufficientBalance,
    FailedToFetchStock,
    FailedToParseLatestQuote,
    FailedToParsePrice,
    NotAuthorized
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

        error!(err);

        (StatusCode::INTERNAL_SERVER_ERROR, err).into_response()
    }
}
