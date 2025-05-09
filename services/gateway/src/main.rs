use axum::{Router, middleware::from_fn};
use proxy_client::AppState;
use router::{router_api, router_auth, router_static};
use telemetry::telemetry;
use tower_http::{
    cors::CorsLayer,
    trace::{DefaultMakeSpan, DefaultOnResponse, TraceLayer},
};
mod proxy_client;
mod router;
mod utils;

#[tokio::main]
async fn main() {
    telemetry::init_telemetry("Gateway");

    let state = AppState::new();

    let api_router =
        router_api::routes(state.clone()).layer(from_fn(router::mw_auth::mw_ctx_resolver));

    // allowing cors accsess for testing
    let origin = ["http://localhost:5173".parse().unwrap()];
    let cors = CorsLayer::new().allow_origin(origin);

    let app = Router::new()
        .merge(api_router)
        .merge(router_auth::routes(state))
        .fallback_service(router_static::serve_static())
        .layer(
            TraceLayer::new_for_http()
                .make_span_with(DefaultMakeSpan::new().include_headers(true))
                .on_response(DefaultOnResponse::new().include_headers(true)),
        )
        .layer(cors);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:4001").await.unwrap();

    println!("server running on 4001");
    axum::serve(listener, app.into_make_service())
        .await
        .unwrap();
}
