use axum::Router;
use telemetry::telemetry;

mod router;
mod services;

#[tokio::main]
async fn main() {

    telemetry::init_telemetry("Stocks_Api_Servie");


    let app = Router::new()
        .merge(router::routes_stocks::routes());

    let listener = tokio::net::TcpListener::bind("0.0.0.0:4003")
        .await.unwrap();

    axum::serve(listener, app.into_make_service()).await.unwrap();
}

