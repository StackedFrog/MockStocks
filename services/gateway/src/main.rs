use axum::{Router, middleware::from_fn};
<<<<<<< HEAD
use reqwest::Client;
=======
use proxy_client::AppState;
>>>>>>> c704c7d1cc7823f1ed585ee789582cb75412bf0f
use router::{router_api, router_auth, router_static};
use telemetry::telemetry;
use tower_http::trace::{DefaultMakeSpan, DefaultOnResponse, TraceLayer};
mod config;
mod proxy_client;
mod router;
mod utils;

<<<<<<< HEAD
#[derive(Clone, Debug)]
struct AppState {
    http_client: Client,
}

impl AppState {
    fn new() -> AppState {
        AppState {
            http_client: Client::new(),
        }
    }
}

=======
>>>>>>> c704c7d1cc7823f1ed585ee789582cb75412bf0f
#[tokio::main]
async fn main() {
    telemetry::init_telemetry("Gateway");

    let state = AppState::new();

    let api_router =
        router_api::routes(state.clone()).layer(from_fn(router::mw_auth::mw_ctx_resolver));

    let app = Router::new()
        .merge(api_router)
<<<<<<< HEAD
        .merge(router_auth::routes(state))
        .fallback_service(router_static::serve_static())
=======
        .merge(router_auth::routes(state.clone()))
>>>>>>> c704c7d1cc7823f1ed585ee789582cb75412bf0f
        .layer(
            TraceLayer::new_for_http()
                .make_span_with(DefaultMakeSpan::new().include_headers(true))
                .on_response(DefaultOnResponse::new().include_headers(true)),
<<<<<<< HEAD
        );

    let listener = tokio::net::TcpListener::bind("0.0.0.0:4001").await.unwrap();

    // info!("server Running on 3001");
    println!("server running");
=======
        )
        .fallback_service(router_static::serve_static_dev(state));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:4001").await.unwrap();

    println!("server running on 4001");
>>>>>>> c704c7d1cc7823f1ed585ee789582cb75412bf0f
    axum::serve(listener, app.into_make_service())
        .await
        .unwrap();
}
