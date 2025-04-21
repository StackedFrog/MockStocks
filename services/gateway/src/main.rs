use axum::{middleware::from_fn, Router};
use reqwest::Client;
use router::{router_api, router_auth, router_static};
use tower_http::trace::TraceLayer;

mod router;
mod utils;
mod ctx;

#[derive(Clone)]
struct AppState{

    http_client: Client

}

impl AppState{
    fn new() -> AppState{
        AppState { http_client: Client::new()}
    }
}


#[tokio::main]
async fn main() {

    telemetry::init_dev_telemetry();

    let state = AppState::new();

    let api_router =  router_api::routes(state.clone())
        .layer(from_fn(router::mw_auth::mw_ctx_resolver));

    let app = Router::new()
        .merge(api_router)
        .merge(router_auth::routes(state))
        .fallback_service(router_static::serve_static());
        // .layer(TraceLayer::new_for_http());


    let listener = tokio::net::TcpListener::bind("0.0.0.0:4001")
        .await.unwrap();

    // info!("server Running on 3001");
    println!("server running");
    axum::serve(listener, app.into_make_service()).await.unwrap();
}
