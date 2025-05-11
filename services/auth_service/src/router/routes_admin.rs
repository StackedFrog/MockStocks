use crate::model::{
    ModelManager, redis_token,
    users_model::{UserType, get_users_role, update_role},
};
use axum::{Json, Router, extract::State, routing::post};
use serde::Deserialize;
use shared_utils::ctx::Ctx;
use tower_cookies::Cookies;
use uuid::Uuid;

use super::{Error, Result, routes_user::logout_handler};

#[derive(Deserialize)]
struct NewRolePayload {
    user_id: Uuid,
    new_role: UserType,
}

pub fn routes(mm: ModelManager) -> Router {
    Router::new()
        .route("/update_role", post(update_role_handler))
        .with_state(mm)
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
