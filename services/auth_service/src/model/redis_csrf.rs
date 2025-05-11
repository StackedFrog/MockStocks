use oauth2::{CsrfToken, PkceCodeVerifier};
use redis::{AsyncCommands, aio::MultiplexedConnection};

use super::{Error, Result};

pub async fn save_csrf_token(
    csrf: CsrfToken,
    pkce_verifier: PkceCodeVerifier,
    mut con: MultiplexedConnection,
) -> Result<()> {
    let _: String = con
        .set_ex(csrf.secret(), pkce_verifier.secret(), 300)
        .await
        .map_err(|_| Error::FailedToSaveCsrf)?;
    Ok(())
}

pub async fn get_csrf_token(csrf_token: String, mut con: MultiplexedConnection) -> Result<String> {
    let token: String = con.get(csrf_token).await.map_err(|_| Error::CsrfNotFound)?;
    Ok(token)
}

pub async fn delete_csrf_token(csrf_token: String, mut con: MultiplexedConnection) -> Result<()> {
    let _: String = con.del(csrf_token).await.map_err(|_| Error::CsrfNotFound)?;
    Ok(())
}
