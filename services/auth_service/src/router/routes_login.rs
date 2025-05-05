use super::{Error, Result};
use crate::{
    ModelManager, crypt, model::redis_token, utils::cookie_util::set_refresh_token_cookie,
};
use axum::{
    Json, Router,
    extract::State,
    routing::{get, post},
};
use serde::{Deserialize, Serialize};
use tower_cookies::{Cookie, Cookies};
use tracing::{Level, event, instrument};

pub fn routes(mm: ModelManager) -> Router {
    Router::new()
        .route("/login", post(login_handler))
        .route("/registar", post(registar_handler))
        .route("/logout", post(logoff_handler))
        .route("/refresh", post(access_token_handler))
        .with_state(mm)
}

#[derive(Clone, Debug)]
pub struct TokenClaims {
    sub: String,
    jti: String,
    pub exp: u64,
    iat: u64,
}

pub struct TokenClaimsAccessToken {
    sub: String,
    pub exp: u64,
    iat: u64,
}

impl TokenClaims {
    pub fn to_redis_key(&self) -> String {
        format!("refresh_token:{}:{}", self.sub, self.jti)
    }
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

    let refresh_token = "refresh_token".to_string();
    let token_claims = TokenClaims {
        sub: refresh_token.to_string(),
        jti: "uuid".to_string(),
        exp: 500,
        iat: 400,
    };

    // create access and refresh tokens

    let access_token = "access_token".to_string();

    redis_token::save_refresh_token(token_claims.clone(), &refresh_token, mm.client.clone())
        .await?;
    println!(
        "toekn: {:?}",
        redis_token::get_refresh_token(token_claims, mm.client).await?
    );
    set_refresh_token_cookie(cookies, refresh_token);

    Ok(Json(TokenPayload {
        token: access_token,
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

    let token_claims = TokenClaims {
        sub: "name".to_string(),
        jti: "uuid".to_string(),
        exp: 500,
        iat: 400,
    };

    // create access and refresh tokens

    let refresh_token = "refresh_token".to_string();
    let access_token = "access_token".to_string();

    redis_token::save_refresh_token(token_claims, &refresh_token, mm.client).await?;

    set_refresh_token_cookie(cookies, refresh_token);

    Ok(Json(TokenPayload {
        token: access_token,
    }))
}

#[instrument(err(Debug))]
async fn access_token_handler(
    State(mm): State<ModelManager>,
    cookies: Cookies,
) -> Result<Json<TokenPayload>> {
    let refresh_token_old = cookies
        .get("refreshToken")
        .ok_or(Error::MissingRefreshToken)?;

    let old_val = refresh_token_old.value();

    let refresh_token = "refresh_token2".to_string();

    event!(Level::ERROR, "this is an event");

    let token_claims = TokenClaims {
        sub: refresh_token.to_string(),
        jti: "uuid".to_string(),
        exp: 500,
        iat: 400,
    };

    let token_claims_old = TokenClaims {
        sub: old_val.to_string(),
        jti: "uuid".to_string(),
        exp: 500,
        iat: 400,
    };

    redis_token::rotate_token(
        token_claims_old,
        token_claims,
        refresh_token.clone(),
        mm.client,
    )
    .await?;

    let access_token = "access_token2".to_string();

    set_refresh_token_cookie(cookies, refresh_token);

    Ok(Json(TokenPayload {
        token: access_token,
    }))
}

async fn logoff_handler(
    State(mm): State<ModelManager>,
    cookies: Cookies,
    Json(payload): Json<LoginPayload>,
) -> Result<String> {
    let refresh_token = cookies
        .get("refreshToken")
        .ok_or(Error::MissingRefreshToken)?
        .into_owned();

    let token_claims = TokenClaims {
        sub: "name".to_string(),
        jti: "uuid".to_string(),
        exp: 500,
        iat: 400,
    };

    cookies.remove(refresh_token);

    redis_token::remove_refresh_token(token_claims, mm.client).await?;

    Ok(payload.pwd)
}
