use axum::{Json, Router, extract::State, routing::post};
use serde::Deserialize;
use shared_utils::ctx::Ctx;
use telemetry::tracing_propegation::inject_tracing_context;
use tower_cookies::{Cookie, Cookies};
use tracing::info;

use crate::{
    config::Settings,
    crypt::{
        self,
        token::{self},
    },
    model::{
        ModelManager, redis_token,
        users_model::{get_user_by_id, update_pwd},
    },
    utils::cookie_util::{remove_all_cookies, remove_refresh_token_cookie},
};

use super::{Error, Result};

pub fn routes(mm: ModelManager) -> Router {
    Router::new()
        .route("/logout", post(logout_handler))
        .route("/change_pwd", post(change_pwd_handler))
        .route("/logout_all", post(logout_all_handler))
        .route("/delete", post(delete_user_handler))
        .with_state(mm)
}

#[derive(Deserialize, Debug)]
struct ChangePwdPayload {
    old_pwd: String,
    new_pwd: String,
}

pub async fn logout_handler(State(mm): State<ModelManager>, cookies: Cookies) -> Result<()> {
    let refresh_token_cookie = cookies
        .get("refreshToken")
        .ok_or(Error::MissingRefreshToken)?;

    let refresh_token = refresh_token_cookie.value();

    let claims = token::validate_signature_refresh(refresh_token)?;

    remove_all_cookies(cookies);

    redis_token::remove_refresh_token(&claims.claims, mm.client).await?;

    Ok(())
}

async fn change_pwd_handler(
    State(mm): State<ModelManager>,
    ctx: Ctx,
    Json(change_paw_payload): Json<ChangePwdPayload>,
) -> Result<()> {
    let user = get_user_by_id(&mm.pool, ctx.user_id()).await?;

    crypt::pwd::validate_pwd(change_paw_payload.old_pwd, &user.password)?;

    let pwd_hash = crypt::pwd::encrypt_pwd(change_paw_payload.new_pwd)?;

    update_pwd(&mm.pool, user.user_id, pwd_hash).await?;

    Ok(())
}

async fn logout_all_handler(State(mm): State<ModelManager>, cookies: Cookies) -> Result<()> {
    let refresh_token_cookie = cookies
        .get("refreshToken")
        .ok_or(Error::MissingRefreshToken)?;

    let refresh_token = refresh_token_cookie.value();

    remove_refresh_token_cookie(cookies.clone());

    let claims = token::validate_signature_refresh(refresh_token)?;

    redis_token::remove_all_refresh_tokens(claims.claims.sub, mm.client).await?;

    Ok(())
}

async fn delete_user_handler(
    State(mm): State<ModelManager>,
    cookies: Cookies,
    ctx: Ctx,
) -> Result<()> {
    let refresh_token_cookie = cookies
        .get("refreshToken")
        .ok_or(Error::MissingRefreshToken)?;

    let refresh_token = refresh_token_cookie.value();
    let claims = token::validate_signature_refresh(refresh_token)?;

    let headers = inject_tracing_context();
    mm.oauth_manager
        .api_client
        .delete("http://user:4004/user/delete_account")
        .header("x-user-id", claims.claims.sub.to_string())
        .headers(headers)
        .send()
        .await
        .map_err(|_| Error::NotAuthorized)?;

    remove_refresh_token_cookie(cookies);

    redis_token::remove_all_refresh_tokens(claims.claims.sub, mm.client).await?;
    Ok(())
}
