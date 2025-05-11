use axum::{http::StatusCode, response::IntoResponse};

pub type Result<T> = core::result::Result<T, Error>;

#[derive(Debug)]
pub enum Error {
<<<<<<< HEAD
    CanNotParesResponseBody,
=======
>>>>>>> c704c7d1cc7823f1ed585ee789582cb75412bf0f
    CanNotParesServiceName,
}

impl IntoResponse for Error {
    fn into_response(self) -> axum::response::Response {
        StatusCode::INTERNAL_SERVER_ERROR.into_response()
    }
}
