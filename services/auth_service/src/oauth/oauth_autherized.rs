use oauth2::{AuthorizationCode, PkceCodeVerifier, TokenResponse};
use serde::{Deserialize, Serialize};

use crate::{
    model::{ModelManager, redis_csrf},
    router::Result,
};

use super::Error;

#[derive(Deserialize)]
pub struct AuthRequest {
    code: String,
    state: String,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct UserData {
    pub given_name: String,
    pub family_name: String,
    picture: String,
    pub id: String,
    pub name: String,
}

pub async fn google_autherized(auth_request: AuthRequest, mm: ModelManager) -> Result<UserData> {
    let pkce_verifier =
        redis_csrf::get_csrf_token(auth_request.state.clone(), mm.client.clone()).await?;
    redis_csrf::delete_csrf_token(auth_request.state, mm.client).await?;

    let http_client = mm.oauth_manager.token_client;

    let token_response = mm
        .oauth_manager
        .oauth_client
        .exchange_code(AuthorizationCode::new(auth_request.code))
        .set_pkce_verifier(PkceCodeVerifier::new(pkce_verifier))
        .request_async(&http_client)
        .await
        .map_err(|_| Error::FailedToFetchToken)?;

    let client = mm.oauth_manager.api_client;

    let user_data = client
        .get("https://www.googleapis.com/oauth2/v2/userinfo")
        .bearer_auth(token_response.access_token().secret())
        .send()
        .await
        .map_err(|_| Error::FailedToFetchUserData)?
        .json::<UserData>()
        .await
        .map_err(|_| Error::UserDataWrongFormat)?;

    Ok(user_data)
}
