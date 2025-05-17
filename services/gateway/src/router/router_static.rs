use axum::{
    Router,
    body::Body,
    extract::{Request, State},
    handler::HandlerWithoutStateExt,
    http::StatusCode,
    response::{Html, IntoResponse, Response},
    routing::{any, get},
};
use tokio::fs::read_to_string;
use tower_http::services::ServeDir;
use tracing::info;

use crate::{
    config::Settings,
    proxy_client::{
        AppState,
        proxy_utils::{ServiceRequestBuilder, ServiceResponseBuilder},
    },
    utils::url_format::target_url,
};

use super::{Error, Result};

pub fn serve_static(mm: AppState) -> Router {
    let dev = Settings::get().dev;

    if dev {
        serve_static_dev(mm)
    } else {
        async fn handle_404() -> (StatusCode, &'static str) {
            (StatusCode::NOT_FOUND, "Not Found")
        }

        async fn index_fallback() -> Response {
            match read_to_string("/app/view/index.html").await {
                Ok(html) => Html(html).into_response(),
                Err(_) => {
                    (StatusCode::INTERNAL_SERVER_ERROR, "index.html not found").into_response()
                }
            }
        }

        let service_404 = handle_404.into_service();
        // get static route from config
        let serve_dir = ServeDir::new("/app/view/").fallback(get(index_fallback)); //.not_found_service(service_404);
        Router::new().fallback_service(serve_dir)
    }
}

fn serve_static_dev(mm: AppState) -> Router {
    let frontend = Router::new()
        .route("/{*path}", any(frontend_proxy))
        .route("/", any(frontend_proxy))
        .with_state(mm);

    Router::new().fallback_service(frontend)
}

async fn frontend_proxy(state: State<AppState>, req: Request<Body>) -> Result<Response> {
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
