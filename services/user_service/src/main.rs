use axum::Router;
use model::ModelManager;
use telemetry::telemetry;
mod config;
mod model;
mod router;
use ::telemetry::tracing_propegation;
use tower_http::trace::{DefaultOnResponse, TraceLayer};

#[tokio::main]
async fn main() {
    telemetry::init_telemetry("user service");

    let mm = ModelManager::new().await;
    let user_routes = router::user_routes::routes(mm.clone());
    let admin_routes = router::admin_routes::routes(mm.clone());

    let app = Router::new()
        .merge(user_routes)
        .nest("/admin", admin_routes)
        .layer(
            TraceLayer::new_for_http()
                .make_span_with(tracing_propegation::propagate_tracing)
                .on_response(DefaultOnResponse::new().include_headers(true)),
        );

    let listener = tokio::net::TcpListener::bind("0.0.0.0:4004").await.unwrap();

    println!("user_service server running on port 4004");
    axum::serve(listener, app.into_make_service())
        .await
        .unwrap();
}
