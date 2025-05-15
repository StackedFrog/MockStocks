use axum::{http::StatusCode, response::IntoResponse};
use tracing::info;

use crate::token;

pub type Result<T> = core::result::Result<T, Error>;

#[derive(Debug)]
pub enum Error {
    ServiceDoesNotExist,
    ServiceNotAvailable,
    CanNotParseServiceResponse,
    TokenMissing,
    Token(token::Error),
}

impl From<token::Error> for Error {
    fn from(val: token::Error) -> Self {
        Error::Token(val)
    }
}

impl IntoResponse for Error {
    fn into_response(self) -> axum::response::Response {
        let err = match &self {
            Error::Token(error) => format!("Error: {:?}", error),
            error => format!("Error: {:?}", error),
        };

        info!(err);

        let code = match self {
            Error::TokenMissing => StatusCode::UNAUTHORIZED,
            Error::CanNotParseServiceResponse => StatusCode::BAD_GATEWAY,
            Error::ServiceNotAvailable | Error::ServiceDoesNotExist => {
                StatusCode::SERVICE_UNAVAILABLE
            }
            Error::Token(err) => match err {
                token::Error::NotAuthorized => StatusCode::FORBIDDEN,
                _ => StatusCode::UNAUTHORIZED,
            },
            _ => StatusCode::INTERNAL_SERVER_ERROR,
        };

        code.into_response()
    }
}
