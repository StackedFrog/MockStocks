pub type Result<T> = core::result::Result<T, Error>;

#[derive(Debug, Clone)]
pub enum Error {
    PwdNotMatching,
    PwdFailedHash,
    PwdWrongFormat,
}
