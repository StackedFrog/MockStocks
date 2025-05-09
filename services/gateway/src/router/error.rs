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
    FailedToValidateToken,
}

impl IntoResponse for Error {
    fn into_response(self) -> axum::response::Response {
        let err = format!("Error: {:?}", self);

        error!(err);
        let code = match self {
            Error::TokenMissing | Error::BadTokenFormat | Error::FailedToValidateToken => {
                StatusCode::UNAUTHORIZED
            }
            Error::CanNotParseServiceResponse => StatusCode::BAD_GATEWAY,
            Error::ServiceNotAvailable | Error::ServiceDoesNotExist => {
                StatusCode::SERVICE_UNAVAILABLE
            } // _ => StatusCode::INTERNAL_SERVER_ERROR
        };

        code.into_response()
    }
}
