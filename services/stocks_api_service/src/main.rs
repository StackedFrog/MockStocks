use axum::Router;
use telemetry::telemetry;
use ::telemetry::tracing_propegation;
use tower_http::trace::{DefaultOnResponse, TraceLayer};

mod router;
mod services;

#[tokio::main]
async fn main() {

    telemetry::init_telemetry("Stocks_Api_Servie");

    let app = Router::new()
        .merge(router::routes_stocks::routes())
        .layer(
            TraceLayer::new_for_http()
                .make_span_with(tracing_propegation::propagate_tracing)
                .on_response(DefaultOnResponse::new().include_headers(true)),
        );
    let listener = tokio::net::TcpListener::bind("0.0.0.0:4003")
        .await.unwrap();
    println!("server running on 4003");
    axum::serve(listener, app.into_make_service()).await.unwrap();
}
