use axum::{middleware::from_fn, Router};
use tower_cookies::CookieManagerLayer;
use tower_http::trace::TraceLayer;
use tracing::info;

mod router;
mod ctx;
mod utils;
mod crypt;




#[tokio::main]
async fn main() {

    utils::telemetry::init_dev_telemetry();

    let app = Router::new()
        //.merge(router::routes_login::routes(mm.clone()))
        .layer(from_fn(router::mw_auth::mw_ctx_resolver))
        .layer(CookieManagerLayer::new())
        .fallback_service(router::router_static::serve_static())
        .layer(TraceLayer::new_for_http());


    let listener = tokio::net::TcpListener::bind("0.0.0.0:3001")
        .await.unwrap();

    info!("server Running on 3001");
    axum::serve(listener, app.into_make_service()).await.unwrap();
}
