use crate::{crypt, model};

pub type Result<T> = core::result::Result<T, Error>;

#[derive(Debug, Clone)]
pub enum Error {
    Crypt(crypt::Error),
    Model(model::Error),
}

impl From<crypt::Error> for Error {
    fn from(val: crypt::Error) -> Self {
        Error::Crypt(val)
    }
}

impl From<model::Error> for Error {
    fn from(val: model::Error) -> Self {
        Error::Model(val)
    }
}
