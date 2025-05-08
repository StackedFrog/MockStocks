use ::telemetry::tracing_propegation;
use axum::Router;
use model::ModelManager;
use telemetry::telemetry;
use tower_cookies::CookieManagerLayer;
use tower_http::trace::{DefaultOnResponse, TraceLayer};

mod crypt;
mod error;
mod model;
mod router;
mod utils;

#[tokio::main]
async fn main() {
    telemetry::init_telemetry("auth service");

    let mm = ModelManager::new().await;

    let app = Router::new()
        .merge(router::routes_login::routes(mm))
        .layer(CookieManagerLayer::new())
        .layer(
            TraceLayer::new_for_http()
                .make_span_with(tracing_propegation::propagate_tracing)
                .on_response(DefaultOnResponse::new().include_headers(true)),
        );

    let listener = tokio::net::TcpListener::bind("0.0.0.0:4002").await.unwrap();

    // info!("server Running on 3001");
    println!("server running ");
    axum::serve(listener, app.into_make_service())
        .await
        .unwrap();
}
