use super::{Error, Result};
use crate::{
    crypt::{
        self,
        token::{self, Claims},
    }, jwt, model::redis_token, oAuth::{
        oAuth_url::oauth_url,
        oauth_autherized::{self, google_autherized, AuthRequest, UserData},
    }, utils::cookie_util::set_refresh_token_cookie, ModelManager
};
use axum::{
    Json, Router,
    extract::{Query, State},
    routing::{get, post},
};
use serde::{Deserialize, Serialize};
use tower_cookies::{Cookie, Cookies};
use tracing::{Level, event, info, instrument};

pub fn routes(mm: ModelManager) -> Router {
    Router::new()
        .route("/login", post(login_handler))
        .route("/registar", post(registar_handler))
        .route("/logout", post(logoff_handler))
        .route("/refresh", post(access_token_handler))
        .route("/google", post(google_oauth))
        .route("/authorized", get(login_autherized))
        .with_state(mm)
}

#[derive(Debug, Deserialize)]
struct LoginPayload {
    user_name: String,
    pwd: String,
}

#[derive(Serialize)]
struct TokenPayload {
    token: String,
}

async fn login_handler(
    State(mm): State<ModelManager>,
    cookies: Cookies,
    Json(payload): Json<LoginPayload>,
) -> Result<Json<TokenPayload>> {
    // get user from model by name
    let user_name = "username".to_string();
    let pwd = "pwd".to_string();

    // crypt::pwd::validate_pwd(payload.pwd, pwd)?;

    let user_id = "test_id".to_string();

    let (refresh_token, access_token) = jwt::creat_token_pair(user_id, mm).await?;

    // create access and refresh TokenClaims

    set_refresh_token_cookie(cookies, refresh_token.token);

    Ok(Json(TokenPayload {
        token: access_token.token,
    }))
}

async fn registar_handler(
    State(mm): State<ModelManager>,
    cookies: Cookies,
    Json(payload): Json<LoginPayload>,
) -> Result<Json<TokenPayload>> {
    let pwd_hash = crypt::pwd::encrypt_pwd(payload.pwd)?;

    // check use name uniquness

    // insert new user

    let user_id = "test_id".to_string();

    let (refresh_token, access_token) = jwt::creat_token_pair(user_id, mm).await?;

    // create access and refresh tokens

    set_refresh_token_cookie(cookies, refresh_token.token);


    Ok(Json(TokenPayload {
        token: access_token.token,
    }))
}

async fn access_token_handler(
    State(mm): State<ModelManager>,
    cookies: Cookies,
) -> Result<Json<TokenPayload>> {
    let refresh_token_cookie = cookies
        .get("refreshToken")
        .ok_or(Error::MissingRefreshToken)?;

    let refresh_token = refresh_token_cookie.value();
    let claims = token::validate_signature(refresh_token)?;
    let (refresh_token_new, access_token) = jwt::rotate_tokens(claims, mm).await?;

    set_refresh_token_cookie(cookies, refresh_token_new.token);

    Ok(Json(TokenPayload {
        token: access_token.token,
    }))
}

async fn logoff_handler(
    State(mm): State<ModelManager>,
    cookies: Cookies,
    Json(payload): Json<LoginPayload>,
) -> Result<String> {
    let refresh_token_cookie = cookies
        .get("refreshToken")
        .ok_or(Error::MissingRefreshToken)?;

    let refresh_token = refresh_token_cookie.value();
    let claims = token::validate_signature(refresh_token)?;

    cookies.remove(Cookie::from("refreshToken"));
    redis_token::remove_refresh_token(&claims.claims, mm.client).await?;

    Ok(payload.pwd)
}

async fn google_oauth(State(mm): State<ModelManager>) -> Result<String> {
    let url = oauth_url(mm)
        .await
        .map_err(|_| Error::MissingRefreshToken)?;

    Ok(url.to_string())
}

async fn login_autherized(
    Query(query): Query<AuthRequest>,
    State(mm): State<ModelManager>,
) -> Result<Json<UserData>> {
    let user = google_autherized(query, mm)
        .await
        .map_err(|_| Error::MissingRefreshToken)?;

    info!("User data: {:?}", user);

    Ok(Json(user))
}
