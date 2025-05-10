use crate::{crypt, model, oauth};
use axum::{http::StatusCode, response::IntoResponse};
use std::fmt::Debug;
use tracing::info;
pub type Result<T> = core::result::Result<T, Error>;

#[derive(Debug, Clone)]
pub enum Error {
    MissingRefreshToken,
    NotAuthorized,
    Model(model::Error),
    Crypt(crypt::Error),
    Oauth(oauth::Error),
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

impl From<oauth::Error> for Error {
    fn from(val: oauth::Error) -> Self {
        Error::Oauth(val)
    }
}
impl IntoResponse for Error {
    fn into_response(self) -> axum::response::Response {
        let err = match &self {
            Error::Model(error) => format!("Error: {:?}", error),
            Error::Crypt(error) => format!("Error: {:?}", error),
            Error::Oauth(error) => format!("Error: {:?}", error),
            error => format!("Error: {:?}", error),
        };

        info!(err);

        let code = match self {
            Error::MissingRefreshToken => StatusCode::UNAUTHORIZED,
            Error::NotAuthorized => StatusCode::FORBIDDEN,
            Error::Oauth(err) => match err {
                oauth::Error::FailedToFetchToken
                | oauth::Error::FailedToFetchUserData
                | oauth::Error::UserDataWrongFormat => StatusCode::UNAUTHORIZED,
                oauth::Error::FailedAuthUrl
                | oauth::Error::FailedRedirectUrl
                | oauth::Error::FailedTokenUrl => StatusCode::INTERNAL_SERVER_ERROR,
            },
            Error::Crypt(_) => StatusCode::UNAUTHORIZED,
            Error::Model(err) => match err {
                model::Error::UsernameNotFound => StatusCode::UNAUTHORIZED,
                model::Error::UserNotAdded => StatusCode::BAD_REQUEST,
                _ => StatusCode::INTERNAL_SERVER_ERROR,
            },
        };

        code.into_response()
    }
}
