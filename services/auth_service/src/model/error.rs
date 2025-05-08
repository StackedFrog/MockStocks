pub type Result<T> = core::result::Result<T, Error>;

#[derive(Debug, Clone)]
pub enum Error {
    FailedToSaveToken,
    TokenNotFound,
    FailedToDeleteToken,
    TokenRotationFailed,
    UsersNotFound,
    UserIDNotFound,
    UsernameNotFound,
    UserNotAdded,
    PasswordNotUpdated,
    RoleNotUpdated,
    UserNotDeleted,
}
