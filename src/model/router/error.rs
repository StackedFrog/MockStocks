use core::fmt;

use axum::{http::StatusCode, response::IntoResponse};

use crate::{crypt, model};

pub type Result<T> = core::result::Result<T, Error>;


#[derive(Debug, Clone)]
pub enum Error {
    MissingRefreshToken,
    Model(model::Error),
    Crypt(crypt::Error)
}


impl From<model::Error> for Error{
    fn from(val:model::Error) -> Self {
        Error::Model(val)
    }
}
impl From<crypt::Error> for Error{
    fn from(val:crypt::Error) -> Self {
        Error::Crypt(val)
    }
}

impl fmt::Display for Error {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{:?}", self)
    }

}

impl IntoResponse for Error{
    fn into_response(self) -> axum::response::Response {

        (StatusCode::INTERNAL_SERVER_ERROR, self.to_string()).into_response()

    }

}
