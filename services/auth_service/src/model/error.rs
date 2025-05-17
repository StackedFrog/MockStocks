pub type Result<T> = core::result::Result<T, Error>;

#[derive(Debug, Clone)]
pub enum Error {
    FailedToSaveToken,
    FailedToDeleteToken,
    FailedToSaveCsrf,
    TokenRotationFailed,
    FailedTokenScan,
    CsrfNotFound,
    // UsersNotFound,
    UserIDNotFound,
    UsernameNotFound,
    UserNotAdded,
    PwdNotUpdated,
    RoleNotUpdated,
    // UserNotDeleted
}
