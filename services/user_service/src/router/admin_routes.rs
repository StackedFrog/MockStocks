use crate::model::user::delete_user_completely;
use crate::model::user::get_all_users;
use crate::model::user::get_users_role;
use crate::model::user::User;
use crate::model::user::UserType;
use crate::model::{
    ModelManager,
};
use axum::{
    Json, Router,
    extract::State,
    routing::{get, post},
};

use serde::Deserialize;
use shared_utils::ctx::Ctx;
use uuid::Uuid;

use super::{Error, Result};

#[derive(Deserialize)]
pub struct UserPayload {
    pub user_id: Uuid
}

pub fn routes(mm: ModelManager) -> Router {
    Router::new()
        .route("/users", get(users_handler))
        .route("/delete_account", post(delete_account_handler))
        .with_state(mm)
}

async fn users_handler(ctx: Ctx, State(mm): State<ModelManager>) -> Result<Json<Vec<User>>> {
    let admin_id = ctx.user_id();
    let role = get_users_role(&mm.pool, admin_id).await?;

    match role {
        UserType::Admin => {}
        UserType::User => {
            Err(Error::NotAuthorized)
        }?,
    };
    
    let users = get_all_users(&mm.pool).await?;

    Ok(Json(users))
}

async fn delete_account_handler(ctx: Ctx,
    State(mm): State<ModelManager>,
    Json(payload): Json<UserPayload>) -> Result<()> {
    
    let admin_id = ctx.user_id();
    let role = get_users_role(&mm.pool, admin_id).await?;

    match role {
        UserType::Admin => {

        }
        UserType::User => {
            Err(Error::NotAuthorized)
        }?,
    };

    delete_user_completely(&mm.pool, &payload.user_id).await?;

    Ok(())
}