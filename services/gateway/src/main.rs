use ::telemetry::{metrics::MetricsLayer, tracing_propegation::set_trace_kind};
use axum::{Router, middleware::from_fn};
use proxy_client::AppState;
use router::{router_api, router_auth, router_grafana, router_static};
use telemetry::telemetry;
use tower_http::trace::{DefaultOnResponse, TraceLayer};
mod config;
mod proxy_client;
mod router;
mod token;
mod utils;

#[tokio::main]
async fn main() {
    telemetry::init_gateway_telemetry("Gateway");

    let metrics_layer = MetricsLayer::new();

    let state = AppState::new();

    let api_router =
        router_api::routes(state.clone()).layer(from_fn(router::mw_auth::mw_ctx_resolver));

    let traced_routes = Router::new()
        .merge(api_router)
        .merge(router_auth::routes(state.clone()))
        .layer(from_fn(metrics_layer.into_middleware()))
        .layer(
            TraceLayer::new_for_http()
                .make_span_with(set_trace_kind)
                .on_response(DefaultOnResponse::new().include_headers(true)),
        );

    let app = router_grafana::routes(state.clone())
        .merge(traced_routes)
        .fallback_service(router_static::serve_static(state));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:4001").await.unwrap();

    println!("server running on 4001");
    axum::serve(listener, app.into_make_service())
        .await
        .unwrap();
}
