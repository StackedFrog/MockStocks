pub type Result<T> = core::result::Result<T, Error>;

#[derive(Debug, Clone)]
pub enum Error {
    UserIDNotFound,
    FailedToFetchUsers,
    HoldingNotUpdated,
    HoldingNotDeleted,
    HoldingNotAdded,
    TransactionNotAdded,
    BalanceNotUpdated,
    UserNotDeleted,
    TxNotCreated,
    TxFailed,
    FailedToFetchRole,
    TransactionsNotDeleted,
    HoldingsNotDeleted,
}
