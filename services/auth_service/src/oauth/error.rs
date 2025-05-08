#[derive(Debug, Clone)]
pub enum Error {
    FailedAuthUrl,
    FailedTokenUrl,
    FailedRedirectUrl,
    FailedToFetchUserData,
    UserDataWrongFormat,
    FailedToFetchToken,
}
