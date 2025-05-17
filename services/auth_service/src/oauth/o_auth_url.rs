use oauth2::{CsrfToken, PkceCodeChallenge, Scope, url::Url};

use crate::{
    model::{ModelManager, redis_csrf},
    router::Result,
};

pub async fn oauth_url(mm: ModelManager) -> Result<Url> {
    let client = mm.oauth_manager.oauth_client;

    let (pkce_challenge, pkce_verifier) = PkceCodeChallenge::new_random_sha256();

    let (auth_url, csrf_token) = client
        .authorize_url(CsrfToken::new_random)
        .add_scope(Scope::new("openid".to_string()))
        .add_scope(Scope::new(
            "https://www.googleapis.com/auth/userinfo.profile".to_string(),
        ))
        .add_scope("https://www.googleapis.com/auth/userinfo.email".to_string())
        .set_pkce_challenge(pkce_challenge)
        .url();

    redis_csrf::save_csrf_token(csrf_token, pkce_verifier, mm.client).await?;

    Ok(auth_url)
}
