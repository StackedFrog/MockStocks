use axum::{http::StatusCode, response::IntoResponse};
use tracing::error;

pub type Result<T> = core::result::Result<T, Error>;

#[derive(Debug)]
pub enum Error {
    ServiceDoesNotExist,
    ServiceNotAvailable,
    CanNotParseServiceResponse,
    TokenMissing,
    BadTokenFormat,
}

impl IntoResponse for Error {
    fn into_response(self) -> axum::response::Response {
        let err = format!("Error: {:?}", self);

        error!(err);

        (StatusCode::INTERNAL_SERVER_ERROR, err).into_response()
    }
}
