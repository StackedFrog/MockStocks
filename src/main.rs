use axum::{middleware::from_fn, Router};
use tower_http::trace::TraceLayer;
use tracing::info;

mod router;
mod ctx;
mod utils;



#[tokio::main]
async fn main() {

    utils::telemetry::init_dev_telemetry();

    let app = Router::new()
        .layer(from_fn(router::mw_auth::mw_ctx_resolver))
        .fallback_service(router::router_static::serve_static())
        .layer(TraceLayer::new_for_http());


    let listener = tokio::net::TcpListener::bind("0.0.0.0:3001")
        .await.unwrap();

    info!("server Running on 3001");
    axum::serve(listener, app.into_make_service()).await.unwrap();

}
