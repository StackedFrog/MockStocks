use axum::{handler::HandlerWithoutStateExt, http::StatusCode, Router};
use tower_http::services::ServeDir;

pub fn serve_static() -> Router{
    async fn handle_404() -> (StatusCode, &'static str){
        (StatusCode::NOT_FOUND, "Not Found")
    }
    let service_404 = handle_404.into_service();

    // get static route from config
    let serve_dir = ServeDir::new("view").not_found_service(service_404);
    Router::new().fallback_service(serve_dir)
}
