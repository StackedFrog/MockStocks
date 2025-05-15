use crate::{
    config::Settings,
    crypt::token::{self, Claims, create_token},
    jwt::token_util,
    model::{
        ModelManager, redis_token,
        users_model::{UserType, get_users_role, update_role},
    },
    utils::cookie_util::{remove_refresh_token_cookie, set_dash_token_cookie},
};
use axum::{
    Json, Router,
    extract::State,
    routing::{get, post},
};
use serde::{Deserialize, Serialize};
use shared_utils::ctx::Ctx;
use telemetry::tracing_propegation::inject_tracing_context;
use tower_cookies::Cookies;
use tracing::info;
use uuid::Uuid;

use super::{Error, Result, routes_user::logout_handler};

#[derive(Deserialize)]
struct NewRolePayload {
    user_id: Uuid,
    new_role: UserType,
}
#[derive(Deserialize, Serialize)]
struct DeletionPayload {
    user_id: Uuid,
}

pub fn routes(mm: ModelManager) -> Router {
    Router::new()
        .route("/update_role", post(update_role_handler))
        .route("/grafana", get(grafana_token_handler))
        .route("/delete", post(delete_user_handler))
        .with_state(mm)
}

async fn grafana_token_handler(
    State(mm): State<ModelManager>,
    cookies: Cookies,
    ctx: Ctx,
) -> Result<()> {
    let admin_id = ctx.user_id();
    let role = get_users_role(&mm.pool, admin_id).await?;

    match role {
        UserType::Admin => {}
        UserType::User => {
            logout_handler(State(mm.clone()), cookies.clone()).await?;
            Err(Error::NotAuthorized)
        }?,
    };

    let token = token_util::DashToken::new(admin_id.clone(), role)?;
    set_dash_token_cookie(cookies, token.token);

    Ok(())
}

async fn delete_user_handler(
    State(mm): State<ModelManager>,
    cookies: Cookies,
    ctx: Ctx,
    Json(deletion_payload): Json<DeletionPayload>,
) -> Result<()> {
    let admin_id = ctx.user_id();
    let role = get_users_role(&mm.pool, admin_id).await?;

    match role {
        UserType::Admin => {}
        UserType::User => {
            logout_handler(State(mm.clone()), cookies).await?;
            Err(Error::NotAuthorized)
        }?,
    };

    let headers = inject_tracing_context();

    mm.oauth_manager
        .api_client
        .post("http://user:4004/admin/delete_account")
        .headers(headers)
        .json(&deletion_payload)
        .send()
        .await
        .map_err(|_| Error::NotAuthorized)?;

    redis_token::remove_all_refresh_tokens(deletion_payload.user_id, mm.client).await?;

    Ok(())
}

async fn update_role_handler(
    State(mm): State<ModelManager>,
    cookies: Cookies,
    ctx: Ctx,
    Json(new_role_payload): Json<NewRolePayload>,
) -> Result<()> {
    let admin_id = ctx.user_id();

    let role = get_users_role(&mm.pool, admin_id).await?;

    match role {
        UserType::Admin => {}
        UserType::User => {
            logout_handler(State(mm.clone()), cookies).await?;
            Err(Error::NotAuthorized)
        }?,
    };

    update_role(
        &mm.pool,
        new_role_payload.user_id,
        new_role_payload.new_role,
    )
    .await?;

    redis_token::remove_all_refresh_tokens(new_role_payload.user_id, mm.client).await?;
    Ok(())
}
