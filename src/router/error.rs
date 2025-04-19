use axum::{http::StatusCode, response::IntoResponse};

pub type Result<T> = core::result::Result<T, Error>;


#[derive(Debug, Clone)]
pub enum Error {
    CtxNotFound,
    TokenNotFound,
    LoginFailedPwdNotMatching,
    FailedToEncryptPwd,
}

impl IntoResponse for Error{
    fn into_response(self) -> axum::response::Response {

        StatusCode::INTERNAL_SERVER_ERROR.into_response()

    }

}
