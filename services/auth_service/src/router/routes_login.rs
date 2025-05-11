use super::{Error, Result};
use crate::{
    ModelManager,
    crypt::{self, token},
    jwt::{self, token_util::TokenData},
    model::users_model::{
        NewUser, add_oauth_user, add_user, get_user_by_oauth_id, get_user_by_username,
    },
    oauth::{
        o_auth_url::oauth_url,
        oauth_autherized::{AuthRequest, google_autherized},
    },
    utils::cookie_util::set_refresh_token_cookie,
};
use axum::{
    Json, Router,
    extract::{Query, State},
    routing::{get, post},
};
use serde::{Deserialize, Serialize};
use tower_cookies::Cookies;

pub fn routes(mm: ModelManager) -> Router {
    Router::new()
        .route("/login", post(login_handler))
        .route("/register", post(register_handler))
        .route("/refresh", post(access_token_handler))
        .route("/google", post(google_oauth))
        .route("/authorized", get(login_autherized))
        .with_state(mm)
}

#[derive(Deserialize)]
pub struct LoginPayload {
    pub email: String,
    pub pwd: String,
}

#[derive(Deserialize)]
pub struct RegisterPayload {
    pub email: String,
    pub name: String,
    pub pwd: String,
}

#[derive(Serialize)]
struct TokenPayload {
    token: String,
}

#[derive(Serialize)]
struct RedirectPayload {
    url: String,
}
async fn login_handler(
    State(mm): State<ModelManager>,
    cookies: Cookies,
    Json(payload): Json<LoginPayload>,
) -> Result<Json<TokenPayload>> {
    let user = get_user_by_username(&mm.pool, payload.email).await?;

    crypt::pwd::validate_pwd(payload.pwd, &user.password)?;

    let payload = login_user(user, cookies, mm).await?;

    Ok(Json(payload))
}

async fn register_handler(
    State(mm): State<ModelManager>,
    cookies: Cookies,
    Json(payload): Json<RegisterPayload>,
) -> Result<Json<TokenPayload>> {
    let pwd_hash = crypt::pwd::encrypt_pwd(payload.pwd)?;

    let new_user = NewUser::new(payload.email, payload.name, pwd_hash);

    let user = add_user(&mm.pool, new_user).await?;

    let payload = login_user(user, cookies, mm).await?;

    Ok(Json(payload))
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

async fn google_oauth(State(mm): State<ModelManager>) -> Result<Json<RedirectPayload>> {
    let url = oauth_url(mm).await?;

    Ok(Json(RedirectPayload {
        url: url.to_string(),
    }))
}

async fn login_autherized(
    Query(query): Query<AuthRequest>,
    State(mm): State<ModelManager>,
    cookies: Cookies,
) -> Result<Json<TokenPayload>> {
    let user_data = google_autherized(query, mm.clone()).await?;

    let user_option = get_user_by_oauth_id(&mm.pool, &user_data.id).await?;

    let user = match user_option {
        Some(user) => user,
        None => add_oauth_user(&mm.pool, user_data).await?,
    };

    let payload = login_user(user, cookies, mm).await?;

    Ok(Json(payload))
}

async fn login_user(
    user: impl TokenData,
    cookies: Cookies,
    mm: ModelManager,
) -> Result<TokenPayload> {
    let (user_id, user_role) = user.to_token_data();
    let (refresh_token, access_token) = jwt::creat_token_pair(user_id, user_role, mm).await?;
    set_refresh_token_cookie(cookies, refresh_token.token);
    Ok(TokenPayload {
        token: access_token.token,
    })
}
