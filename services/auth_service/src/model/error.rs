pub type Result<T> = core::result::Result<T, Error>;

#[derive(Debug, Clone)]
pub enum Error {
    FailedToSaveToken,
    TokenNotFound,
    FailedToDeleteToken,
    TokenRotationFailed
}
