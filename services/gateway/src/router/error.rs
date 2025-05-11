use axum::{http::StatusCode, response::IntoResponse};
<<<<<<< HEAD
=======
use tracing::info;
>>>>>>> c704c7d1cc7823f1ed585ee789582cb75412bf0f

pub type Result<T> = core::result::Result<T, Error>;

#[derive(Debug)]
pub enum Error {
    ServiceDoesNotExist,
    ServiceNotAvailable,
    CanNotParseServiceResponse,
    TokenMissing,
    BadTokenFormat,
    FailedToValidateToken,
    NotAuthorized,
}

impl IntoResponse for Error {
    fn into_response(self) -> axum::response::Response {
<<<<<<< HEAD
        StatusCode::INTERNAL_SERVER_ERROR.into_response()
=======
        let err = format!("Error: {:?}", self);

        info!(err);
        let code = match self {
            Error::TokenMissing | Error::BadTokenFormat | Error::FailedToValidateToken => {
                StatusCode::UNAUTHORIZED
            }
            Error::CanNotParseServiceResponse => StatusCode::BAD_GATEWAY,
            Error::ServiceNotAvailable | Error::ServiceDoesNotExist => {
                StatusCode::SERVICE_UNAVAILABLE
            }
            Error::NotAuthorized => StatusCode::FORBIDDEN, // _ => StatusCode::INTERNAL_SERVER_ERROR
        };

        code.into_response()
>>>>>>> c704c7d1cc7823f1ed585ee789582cb75412bf0f
    }
}
