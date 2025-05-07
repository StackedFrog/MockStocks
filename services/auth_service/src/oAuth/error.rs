use crate::model;

pub type Result<T> = core::result::Result<T, Error>;

#[derive(Debug, Clone)]
pub enum Error {
    FailedAuthUrl,
    FailedTokenUrl,
    FailedRedirectUrl,
    FailedCsrfSave,
    FailedToFetchUserData,
    UserDataWrongFormat,
    FailedToFetchToken,
    Model(model::Error),
}

impl From<model::Error> for Error {
    fn from(val: model::Error) -> Self {
        Error::Model(val)
    }
}
