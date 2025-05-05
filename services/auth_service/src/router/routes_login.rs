use axum::{extract::State, routing::{get, post}, Json, Router};
use tower_cookies::{ Cookie, Cookies};
use serde::{Deserialize, Serialize};
use tracing::{event, instrument, Level};
use crate::{crypt, model::{redis_token, users_model::{add_user, get_user_by_username, NewUser, User}}, utils::cookie_util::set_refresh_token_cookie, ModelManager};
use super::{Error, Result};

pub fn routes(mm : ModelManager) -> Router {
    Router::new()
        .route("/login", post(login_handler))
        .route("/register", post(register_handler))
        .route("/logout", post(logoff_handler))
        .route("/refresh", post(access_token_handler))
        .with_state(mm)
}

#[derive(Deserialize)]
pub struct UserPayload {
    pub username: String,
    pub password: String,
}

#[derive(Clone, Debug)]
pub struct TokenClaims{
    sub: String,
    jti: String,
    pub exp: u64,
    iat: u64
}

pub struct TokenClaimsAccessToken{
    sub: String,
    pub exp: u64,
    iat: u64
}

impl TokenClaims{
    pub fn to_redis_key(&self)-> String{
        format!("refresh_token:{}:{}", self.sub, self.jti)
    }
}

#[derive(Serialize)]
struct TokenPayload{
    token: String
}

async fn login_handler(
    State(mm): State<ModelManager>,
    cookies: Cookies,
    Json(payload): Json<UserPayload>
) -> Result<Json<TokenPayload>>{

    // get user from model by name
    let user = get_user_by_username(&mm.pool, payload.username).await?;

    // validate plaintext with hashed password
    crypt::pwd::validate_pwd(payload.password, user.password)?;

    let refresh_token = "refresh_token".to_string();
    let token_claims = TokenClaims{
        sub: refresh_token.to_string(),
        jti: "uuid".to_string(),
        exp: 500,
        iat: 400
    };

    // create access and refresh tokens

    let access_token = "access_token".to_string();

    redis_token::save_refresh_token(token_claims.clone(), &refresh_token, mm.client.clone()).await?;
    println!("toekn: {:?}",redis_token::get_refresh_token(token_claims, mm.client).await?);
    set_refresh_token_cookie(cookies, refresh_token);

    Ok(Json(TokenPayload{token: access_token}))
}


async fn register_handler(
    State(mm): State<ModelManager>,
    cookies: Cookies,
    Json(payload): Json<UserPayload>
)-> Result<Json<TokenPayload>>{

    let pwd_hash = crypt::pwd::encrypt_pwd(payload.password)?;

    let new_user = NewUser::new_basic_user(payload.username, pwd_hash);

    // check use name uniquness

    // insert new user
    let user_id = add_user(&mm.pool, new_user).await?;

    let token_claims = TokenClaims{
        sub: "name".to_string(),
        jti: "uuid".to_string(),
        exp: 500,
        iat: 400
    };

    // create access and refresh tokens

    let refresh_token = "refresh_token".to_string();
    let access_token = "access_token".to_string();

    redis_token::save_refresh_token(token_claims, &refresh_token, mm.client).await?;

    set_refresh_token_cookie(cookies, refresh_token);

    Ok(Json(TokenPayload { token : access_token}))
}

#[instrument(err(Debug))]
async fn access_token_handler(
    State(mm): State<ModelManager>,
    cookies:Cookies
) -> Result<Json<TokenPayload>>{

    let refresh_token_old = cookies.get("refreshToken").ok_or(Error::MissingRefreshToken)?;

    let old_val = refresh_token_old.value();

    let refresh_token = "refresh_token2".to_string();


    event!(Level::ERROR, "this is an event");

    let token_claims = TokenClaims{
        sub: refresh_token.to_string(),
        jti: "uuid".to_string(),
        exp: 500,
        iat: 400
    };

    let token_claims_old = TokenClaims{
        sub: old_val.to_string(),
        jti: "uuid".to_string(),
        exp: 500,
        iat: 400
    };

    redis_token::rotate_token(
        token_claims_old,
        token_claims,
        refresh_token.clone(),
        mm.client
    ).await?;

    let access_token = "access_token2".to_string();

    set_refresh_token_cookie(cookies, refresh_token);

    Ok(Json(TokenPayload { token: access_token  })  )
}

async fn logoff_handler(
    State(mm): State<ModelManager>,
    cookies: Cookies,
    Json(payload): Json<UserPayload>
)-> Result<String> {

    let refresh_token = cookies.get("refreshToken").ok_or(Error::MissingRefreshToken)?.into_owned();

    let token_claims = TokenClaims{
        sub: "name".to_string(),
        jti: "uuid".to_string(),
        exp: 500,
        iat: 400
    };

    cookies.remove(refresh_token);

    redis_token::remove_refresh_token(token_claims, mm.client).await?;

    Ok(payload.password)
}
