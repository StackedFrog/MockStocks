use super::{Error, Result};
use crate::{
    ModelManager,
    crypt::{self, token},
    jwt,
    model::{
        redis_token,
        users_model::{NewUser, add_user, get_user_by_username},
    },
    oauth::{
        o_auth_url::oauth_url,
        oauth_autherized::{AuthRequest, UserData, google_autherized},
    },
    utils::cookie_util::set_refresh_token_cookie,
};
use axum::{
    Json, Router,
    extract::{Query, State},
    routing::{get, post},
};
use serde::{Deserialize, Serialize};
use tower_cookies::{Cookie, Cookies};
use tracing::info;

pub fn routes(mm: ModelManager) -> Router {
    Router::new()
        .route("/login", post(login_handler))
        .route("/register", post(register_handler))
        .route("/logout", post(logoff_handler))
        .route("/refresh", post(access_token_handler))
        .route("/google", post(google_oauth))
        .route("/authorized", get(login_autherized))
        .with_state(mm)
}

#[derive(Deserialize)]
pub struct UserPayload {
    pub username: String,
    pub pwd: String,
}

#[derive(Serialize)]
struct TokenPayload {
    token: String,
}

async fn login_handler(
    State(mm): State<ModelManager>,
    cookies: Cookies,
    Json(payload): Json<UserPayload>,
) -> Result<Json<TokenPayload>> {
    let user = get_user_by_username(&mm.pool, payload.username).await?;

    crypt::pwd::validate_pwd(payload.pwd, user.pwd)?;

    let user_id = user.user_id;

    let (refresh_token, access_token) = jwt::creat_token_pair(user_id.to_string(), mm).await?;

    set_refresh_token_cookie(cookies, refresh_token.token);

    Ok(Json(TokenPayload {
        token: access_token.token,
    }))
}

async fn register_handler(
    State(mm): State<ModelManager>,
    cookies: Cookies,
    Json(payload): Json<UserPayload>,
) -> Result<Json<TokenPayload>> {
    let pwd_hash = crypt::pwd::encrypt_pwd(payload.pwd)?;

    let new_user = NewUser::new_basic_user(payload.username, pwd_hash);

    let user_id = add_user(&mm.pool, new_user).await?;

    let (refresh_token, access_token) = jwt::creat_token_pair(user_id.to_string(), mm).await?;

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
    Json(payload): Json<UserPayload>,
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
    let url = oauth_url(mm).await?;

    Ok(url.to_string())
}

async fn login_autherized(
    Query(query): Query<AuthRequest>,
    State(mm): State<ModelManager>,
) -> Result<Json<UserData>> {
    let user = google_autherized(query, mm).await?;

    info!("User data: {:?}", user);

    Ok(Json(user))
}
