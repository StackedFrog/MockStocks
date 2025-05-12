pub type Result<T> = core::result::Result<T, Error>;

#[derive(Debug, Clone)]
pub enum Error {
    UserIDNotFound,
    HoldingNotUpdated,
    HoldingNotDeleted,
    HoldingNotAdded,
    TransactionNotAdded,
    PasswordNotUpdated,
    BalanceNotUpdated,
    UserNotDeleted,
    TxNotCreated,
    TxFailed
}
