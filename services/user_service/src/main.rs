use axum::Router;
use model::ModelManager;
use telemetry::telemetry;
mod model;
mod router;
mod config;

#[tokio::main]
async fn main() {
    telemetry::init_telemetry("user service");

    let mm = ModelManager::new().await;

    let app = Router::new().merge(router::user_routes::routes(mm));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:4004").await.unwrap();

    println!("user_service server running ");
    axum::serve(listener, app.into_make_service())
        .await
        .unwrap();
}
