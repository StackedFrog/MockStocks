use axum::Router;
use model::ModelManager;
use tower_cookies::CookieManagerLayer;
use tower_http::trace::TraceLayer;

mod router;
mod crypt;
mod model;
mod utils;
mod error;

#[tokio::main]
async fn main() {

    telemetry::init_dev_telemetry();

    let mm = ModelManager::new().await;

    let app = Router::new()
        .merge(router::routes_login::routes(mm))
        .layer(CookieManagerLayer::new())
        .layer(TraceLayer::new_for_http());


    let listener = tokio::net::TcpListener::bind("0.0.0.0:4002")
        .await.unwrap();

    // info!("server Running on 3001");
    print!("server running ");
    axum::serve(listener, app.into_make_service()).await.unwrap();
}
