use ::telemetry::tracing_propegation;
use axum::Router;
use telemetry::telemetry;
use tower_http::{
    cors::CorsLayer,
    trace::{DefaultOnResponse, TraceLayer},
};

mod router;
mod services;

#[tokio::main]
async fn main() {
    telemetry::init_telemetry("Stocks_Api_Servie");

    // for testing, remove later
    let origin = ["http://localhost:5173".parse().unwrap()];
    let cors = CorsLayer::new().allow_origin(origin);

    let app = Router::new()
        .merge(router::routes_stocks::routes())
        .layer(
            TraceLayer::new_for_http()
                .make_span_with(tracing_propegation::propagate_tracing)
                .on_response(DefaultOnResponse::new().include_headers(true)),
        )
        .layer(cors);
    let listener = tokio::net::TcpListener::bind("0.0.0.0:4003").await.unwrap();
    println!("server running on 4003");
    axum::serve(listener, app.into_make_service())
        .await
        .unwrap();
}
