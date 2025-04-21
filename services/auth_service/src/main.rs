use axum::Router;
use tower_cookies::CookieManagerLayer;



mod router;
mod crypt;



#[derive(Clone)]
pub struct ModelManager{}


#[tokio::main]
async fn main() {

    // utils::telemetry::init_dev_telemetry

    let mm = ModelManager{};

    let app = Router::new()
         .merge(router::routes_login::routes(mm))
         .layer(CookieManagerLayer::new());
        // .layer(TraceLayer::new_for_http());


    let listener = tokio::net::TcpListener::bind("0.0.0.0:4002")
        .await.unwrap();

    // info!("server Running on 3001");
    print!("server running ");
    axum::serve(listener, app.into_make_service()).await.unwrap();
}
