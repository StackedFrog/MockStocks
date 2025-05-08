use axum::{extract::State, routing::post, Json, Router};
use shared_utils::ctx::{self, Ctx};

use crate::model::ModelManager;



pub fn routes(mm : ModelManager) -> Router {
    return Router::new()
    .route("/change_password", post(change_pass_handler))
    .with_state(mm);
}

async fn change_pass_handler(State(mm) : State<ModelManager>,
    Json(body) : Json<>,
    ctx : Ctx) -> Result<()> {
    let id = ctx.user_id();
}