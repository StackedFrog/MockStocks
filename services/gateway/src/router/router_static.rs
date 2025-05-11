<<<<<<< HEAD
use axum::{Router, handler::HandlerWithoutStateExt, http::StatusCode};
=======
use axum::{
    Router,
    body::Body,
    extract::{Path, Request, State},
    handler::HandlerWithoutStateExt,
    http::StatusCode,
    response::Response,
    routing::any,
};
use reqwest::get;
use tower::MakeService;
>>>>>>> c704c7d1cc7823f1ed585ee789582cb75412bf0f
use tower_http::services::ServeDir;
use tracing::info;

<<<<<<< HEAD
=======
use crate::{
    proxy_client::{
        AppState,
        proxy_utils::{ServiceRequestBuilder, ServiceResponseBuilder},
    },
    utils::url_format::target_url,
};

use super::{Error, Result};

>>>>>>> c704c7d1cc7823f1ed585ee789582cb75412bf0f
pub fn serve_static() -> Router {
    async fn handle_404() -> (StatusCode, &'static str) {
        (StatusCode::NOT_FOUND, "Not Found")
    }
    let service_404 = handle_404.into_service();

    // get static route from config
    let serve_dir = ServeDir::new("view").not_found_service(service_404);
    Router::new().fallback_service(serve_dir)
}

pub fn serve_static_dev(mm: AppState) -> Router {
    let frontend = Router::new()
        .route("/{*path}", any(frontend_proxy))
        .route("/", any(frontend_proxy))
        .with_state(mm);

    Router::new().fallback_service(frontend)
}

pub async fn frontend_proxy(state: State<AppState>, req: Request<Body>) -> Result<Response> {
    let client = state.http_client.clone();

    let auth_url = "http://frontend:5173";

    let path = req.uri().path().to_string();

    info!("{}", path);

    let target_url = target_url(auth_url, path, req.uri());

    let service_request = ServiceRequestBuilder::new(req, target_url, &client)
        .with_content_type()
        // .with_json_res()
        .with_cookie()
        .with_body()
        .await
        .build();

    let service_res = service_request
        .send()
        .await
        .map_err(|_| Error::ServiceNotAvailable)?;

    let response = ServiceResponseBuilder::new(service_res)
        .with_content_type()
        .with_status()
        .with_cookie()
        .build()
        .await
        .map_err(|_| Error::CanNotParseServiceResponse)?;

    Ok(response)
}
